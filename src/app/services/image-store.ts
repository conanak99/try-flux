import { bento } from "@/app/services/cache";
import { ImageSize } from "@/app/types";
import { db, dbSchema } from "@/db";
import { desc } from "drizzle-orm";

const RECENT_IMAGES_KEY = 'recent-images';

export async function addImage(url: string, prompt: string, size: ImageSize) {
  await db.insert(dbSchema.history).values({
    prompt,
    image: url,
    size,
  });

  bento.delete(RECENT_IMAGES_KEY);
}

export async function getImages() {
  return await bento.getOrSet(RECENT_IMAGES_KEY, async () => {
    return await db.query.history.findMany({
      orderBy: desc(dbSchema.history.createdAt),
      limit: 100
    });
  });
}
