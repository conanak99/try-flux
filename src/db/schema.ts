import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { ImageSize } from '@/app/types';

export const history = sqliteTable(
  'history',
  {
    id: integer('id').primaryKey(),
    prompt: text('prompt').notNull(),
    image: text('image').notNull(),
    size: text('size').$type<ImageSize>().notNull(),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => ({
    createdAtIndex: index('created_at_idx').on(table.createdAt),
  })
);
