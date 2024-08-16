"use server";

import { headers } from "next/headers";
import retry from "async-await-retry";
import { RateLimiterRes } from "rate-limiter-flexible";

import { imgGenService } from "@/app/services/img-gen";
import { translate, TranslateResult } from "@/app/services/text-gen";
import { limiter } from "@/app/services/rate-limit";

function IP() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export async function generateImage(prompt: string) {
  const ipAddress = IP();

  try {
    await limiter.consume(ipAddress, 1);

    const translateResult: TranslateResult = (await retry(
      () => translate(prompt),
      undefined,
      {
        retriesMax: 4,
        interval: 1000,
        exponential: true,
      }
    )) || { translatedText: prompt, model: "unknown" };

    const imgUrl = await imgGenService.callAPI(translateResult.translatedText);

    console.log({
      ipAddress,
      prompt,
      translateResult,
      imgUrl,
    });

    return {
      imgUrl,
    };
  } catch (e: any) {
    if ("msBeforeNext" in e) {
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
