'use server';

import { headers } from 'next/headers';
import { RateLimiterRes } from 'rate-limiter-flexible';

import { translateWithBing } from '@/app/services/bing-translate';
import { retryFunc } from '@/app/services/helper';
import { addImage, shouldAddImage } from '@/app/services/image-store';
import { imgGenService } from '@/app/services/img-gen';
import { uploadToMinio } from '@/app/services/minio';
import { limiter } from '@/app/services/rate-limit';
import { translate } from '@/app/services/text-gen';
import { ImageSize } from '@/app/types';

function IP() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0';
  const forwardedFor = headers().get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
}

export async function generateImage(
  prompt: string,
  imageSize: ImageSize,
  translatePrompt: boolean
) {
  const ipAddress = IP();

  try {
    await limiter.consume(ipAddress, 1);

    let translatedPrompt = prompt;
    let translationModel = 'none';

    if (translatePrompt) {
      const translateResult = (await retryFunc(() =>
        translateWithBing(prompt)
      )) || {
        translatedText: prompt,
        model: 'unknown',
      };
      translatedPrompt = translateResult.translatedText;
      translationModel = translateResult.model;
    }

    const imgUrl = await retryFunc(() =>
      imgGenService.callAPI(translatedPrompt, imageSize)
    );

    if (imgUrl) {
      if (shouldAddImage(prompt)) {
        uploadImageToMinio(imgUrl).then((minioUrl) => {
          addImage(minioUrl, prompt, imageSize);
        });
      } else {
        console.warn('skip adding this to DB', { prompt, imgUrl });
      }

      console.log({
        ipAddress,
        prompt,
        translatedPrompt,
        translationModel,
        imgUrl,
      });

      return {
        imgUrl,
      };
    }

    return {
      error: 'Failed to generate image',
      imgUrl: null,
    };
  } catch (e: any) {
    if (typeof e === 'string') {
      console.error({
        ipAddress,
        prompt,
        error: e,
      });
      return {
        error: e,
        imgUrl: null,
      };
    }

    if ('msBeforeNext' in e) {
      console.warn(`Rate limit exceeded for ${ipAddress}!`);
      const res: RateLimiterRes = e as RateLimiterRes;

      return {
        error: `Bạn có thể tạo tối đa 5 ảnh mỗi phút. Thử lại sau ${(
          res.msBeforeNext / 1000
        ).toFixed(0)} giây nha!`,
        imgUrl: null,
      };
    }

    return {
      error: JSON.stringify(e),
      imgUrl: null,
    };
  }
}

async function uploadImageToMinio(imageUrl: string) {
  const fileName =
    imageUrl.split('/').pop() ||
    `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const minioUrl = await uploadToMinio(imageUrl, fileName);
  return minioUrl;
}
