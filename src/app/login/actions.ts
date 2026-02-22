"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

export async function loginAction(data: { email: string; password: string }) {
  const result = await login(data);
  if (!result.success) {
    return { error: result.error };
  }
  redirect("/admin/auctions-dashboard");
}
