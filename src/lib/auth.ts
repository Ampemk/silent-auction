import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "super-secret-change-me-in-production"
);
const COOKIE_NAME = "auth-token";
const TOKEN_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Password helpers
// ---------------------------------------------------------------------------
export async function hashPassword(plain: string) {
  return hash(plain, 12);
}

export async function verifyPassword(plain: string, hashed: string) {
  return compare(plain, hashed);
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------
export type TokenPayload = {
  sub: string; // user id
  email: string;
  role: "admin" | "bidder";
  orgId: string | null;
};

async function createToken(payload: TokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Session helpers (cookie-based)
// ---------------------------------------------------------------------------

/** Set the auth cookie after login / signup */
export async function setSession(payload: TokenPayload) {
  const token = await createToken(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Read the current session from cookies. Returns null if not authenticated. */
export async function getSession(): Promise<TokenPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Remove the auth cookie (logout). */
export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export type AuthResult =
  | { success: true; user: { id: string; email: string; firstName: string; lastName: string; role: "admin" | "bidder" } }
  | { success: false; error: string };

/** Register a new user and set the session cookie. */
export async function signup(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResult> {
  const existing = db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .get();

  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(data.password);

  db.insert(users)
    .values({
      id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: passwordHash,
      role: "bidder",
      createdAt: Date.now(),
    })
    .run();

  await setSession({ sub: id, email: data.email, role: "bidder", orgId: null });

  return {
    success: true,
    user: { id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: "bidder" },
  };
}

/** Authenticate a user by email + password and set the session cookie. */
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const user = db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .get();

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const valid = await verifyPassword(data.password, user.password);
  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  await setSession({ sub: user.id, email: user.email, role: user.role, orgId: user.orgId ?? null });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

/** Log the current user out. */
export async function logout() {
  await clearSession();
}

/** Get the currently authenticated user, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.sub))
    .get();

  return user ?? null;
}
