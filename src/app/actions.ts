"use server";

import { headers } from "next/headers";
import { imgGenService } from "./services/img-gen";
import { translateText } from "@/app/services/text-gen";

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

  const translatedPrompt = (await translateText(prompt)) ?? prompt;
  const imgUrl = await imgGenService.callAPI(translatedPrompt);

  return {
    translatedPrompt,
    imgUrl,
  };
}
