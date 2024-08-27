
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const history = sqliteTable("history", {
  id: integer("id").primaryKey(),
  prompt: text("prompt").notNull(),
  image: text("image").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
