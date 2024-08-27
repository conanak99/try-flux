CREATE TABLE `history` (
	`id` integer PRIMARY KEY NOT NULL,
	`prompt` text NOT NULL,
	`images` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
