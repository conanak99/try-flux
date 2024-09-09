import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { ImageSize } from '@/app/types';

export const history = sqliteTable('history', {
  id: integer('id').primaryKey(),
  prompt: text('prompt').notNull(),
  image: text('image').notNull(),
  size: text('size').$type<ImageSize>().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
