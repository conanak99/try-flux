import { db, dbSchema } from "@/db";
import { desc } from "drizzle-orm";

export async function addImage(url: string, prompt: string) {
  await db.insert(dbSchema.history).values({
    prompt,
    image: url,
  });
}

export async function getImages() {
  return await db.query.history.findMany({
    orderBy: desc(dbSchema.history.createdAt),
    limit: 50
  });
}
