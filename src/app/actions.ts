"use server";

import { headers } from "next/headers";
import { RateLimiterRes } from "rate-limiter-flexible";

import { imgGenService } from "@/app/services/img-gen";
import { translate } from "@/app/services/text-gen";
import { limiter } from "@/app/services/rate-limit";
import { retryFunc } from "@/app/services/helper";

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

    const translateResult = (await retryFunc(() => translate(prompt))) || {
      translatedText: prompt,
      model: "unknown",
    };

    const imgUrl = await retryFunc(() =>
      imgGenService.callAPI(translateResult.translatedText)
    );

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
    if (typeof e === "string") {
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
