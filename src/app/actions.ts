"use server";

import { headers } from "next/headers";
import { RateLimiterRes } from "rate-limiter-flexible";

import { imgGenService } from "@/app/services/img-gen";
import { translateText } from "@/app/services/text-gen";
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
  console.log("IP Address: ", ipAddress);

  try {
    await limiter.consume(ipAddress, 1);

    const translatedPrompt = (await translateText(prompt)) ?? prompt;
    const imgUrl = await imgGenService.callAPI(translatedPrompt);

    return {
      translatedPrompt,
      imgUrl,
    };
  } catch (e: any) {
    if ("msBeforeNext" in e) {
      console.warn("Rate limit exceeded");
      const res: RateLimiterRes = e as RateLimiterRes;

      return {
        error: `Bạn có thể tạo tối đa 5 ảnh mỗi phút. Thử lại sau ${(
          res.msBeforeNext / 1000
        ).toFixed(0)} giây nha!`,
        translatedPrompt: null,
        imgUrl: null,
      };
    }

    return {
      error: e,
      translatedPrompt: null,
      imgUrl: null,
    };
  }
}
