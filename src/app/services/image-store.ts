import { ImageSize } from "@/app/types";
import { db, dbSchema } from "@/db";
import { desc } from "drizzle-orm";

export async function addImage(url: string, prompt: string, size: ImageSize) {
  await db.insert(dbSchema.history).values({
    prompt,
    image: url,
    size,
  });
}

export async function getImages() {
  return await db.query.history.findMany({
    orderBy: desc(dbSchema.history.createdAt),
    limit: 50
  });
}
