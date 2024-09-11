import { desc } from 'drizzle-orm';

import { bento } from '@/app/services/cache';
import { ImageSize } from '@/app/types';
import { db, dbSchema } from '@/db';

const RECENT_IMAGES_KEY = 'recent-images';

export const shouldAddImage = async (prompt: string): Promise<boolean> => {
  const cleanedPrompt = prompt.replace(/[.?:,_:!]/g, '');
  if (containsNSFWorCSAM(cleanedPrompt)) {
    console.warn('containsNSFWorCSAM, skip adding this to DB', prompt);
    return false;
  }

  const images = await getImages();

  const trimmedPrompt = prompt.trim().toLowerCase();
  const recentImages = images.slice(0, 30);
  const duplicatedPromptCount = recentImages.filter(
    (image) => image.prompt.trim().toLowerCase() === trimmedPrompt
  ).length;
  if (duplicatedPromptCount > 5) {
    console.log('prompt count > 5, skip adding this to DB', prompt);
    return false;
  }

  return true;
};

export async function addImage(url: string, prompt: string, size: ImageSize) {
  if (!shouldAddImage(prompt)) {
    return;
  }

  await db.insert(dbSchema.history).values({
    prompt,
    image: url,
    size,
  });
}

export async function getImages() {
  return await bento.getOrSet(
    RECENT_IMAGES_KEY,
    async () => {
      return await db.query.history.findMany({
        orderBy: desc(dbSchema.history.createdAt),
        limit: 100,
      });
    },
    { ttl: '10m' }
  );
}

const nsfwKeywords = [
  'nsfw',
  'adult',
  'porn',
  'sex',
  'nude',
  'xxx',
  'erotic',
  'fetish',
  'penis',
  'vagina',
  'naked',
  'cock',
  'pussy',
  'fuck',
  '18',

  'khiêu dâm',
  'tình dục',
  'khoả thân',
  'diễn viên',
  'khỏa thân',
  'không mặt',
  'không mặc',
  'sinh dục',
  'cởi',
  'hở',
  'vú',
  'dâm dục',
  'địt',
  'chịch',
  'mông',
  'làm tình',
  'bướm',
  'âm hộ',
  'âm đạo',
  'lồn',
  'dâm',
  'quần',
];

const csamKeywords = [
  'child',
  'abuse',
  'exploitation',
  'trẻ em',
  'em bé',
  'lạm dụng',
  'bóc lột',
  'bé gái',
  'tuổi',
];

function containsNSFWorCSAM(prompt: string): boolean {
  const lowerCasePrompt = prompt.toLowerCase();
  return (
    nsfwKeywords.some((keyword) => lowerCasePrompt.includes(keyword)) ||
    csamKeywords.some((keyword) => lowerCasePrompt.includes(keyword))
  );
}
