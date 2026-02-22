PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bids` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`user_id` text,
	`amount` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `auction_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bids`("id", "item_id", "user_id", "amount", "created_at") SELECT "id", "item_id", "user_id", "amount", "created_at" FROM `bids`;--> statement-breakpoint
DROP TABLE `bids`;--> statement-breakpoint
ALTER TABLE `__new_bids` RENAME TO `bids`;--> statement-breakpoint
PRAGMA foreign_keys=ON;