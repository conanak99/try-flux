import { bento } from "@/app/services/cache";
import { ImageSize } from "@/app/types";
import { db, dbSchema } from "@/db";
import { desc } from "drizzle-orm";

const RECENT_IMAGES_KEY = "recent-images";

export async function addImage(url: string, prompt: string, size: ImageSize) {
  if (containsNSFWorCSAM(prompt)) {
    console.warn("containsNSFWorCSAM, skip adding this to DB", prompt);
    return;
  }

  const images = await getImages();

  const recentImages = images.slice(0, 30);
  const duplicatedPromptCount = recentImages.filter(
    (image) => image.prompt.trim().toLowerCase() === prompt.trim().toLowerCase()
  ).length;
  if (duplicatedPromptCount > 5) {
    console.log("prompt count > 5, skip adding this to DB", prompt);
    return;
  }

  await db.insert(dbSchema.history).values({
    prompt,
    image: url,
    size,
  });

  bento.delete(RECENT_IMAGES_KEY).then((val) => {
    console.log("cache deleted", { val });
  });
}

export async function getImages() {
  return await bento.getOrSet(
    RECENT_IMAGES_KEY,
    async () => {
      return await db.query.history.findMany({
        orderBy: desc(dbSchema.history.createdAt),
        limit: 120,
      });
    },
    { ttl: "10m" }
  );
}

const nsfwKeywords = [
  "nsfw",
  "adult",
  "porn",
  "sex",
  "nude",
  "xxx",
  "erotic",
  "fetish",
  "penis",
  "vagina",
  "pussy",
  "fuck",

  "khiêu dâm",
  "tình dục",
  "khoả thân",
  "khỏa thân",
  "dâm dục",
  "địt",
  "chịch",
  "làm tình",
  "bướm",
  "lồn",
  "dâm",
];

const csamKeywords = [
  "child",
  "abuse",
  "exploitation",
  "trẻ em",
  "em bé",
  "lạm dụng",
  "bóc lột",
  "bé gái",
  "tuổi",
];

function containsNSFWorCSAM(prompt: string): boolean {
  const lowerCasePrompt = prompt.toLowerCase();
  return (
    nsfwKeywords.some((keyword) => lowerCasePrompt.includes(keyword)) ||
    csamKeywords.some((keyword) => lowerCasePrompt.includes(keyword))
  );
}
