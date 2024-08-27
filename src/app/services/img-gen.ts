import { ImageSize } from "@/app/types";
import { config } from "@/config";
import { RunwareServer } from "@runware/sdk-js";
import delay from "delay";

const runware = new RunwareServer({
  apiKey: config.runwareApiKey,
});

let initialized = false;

async function init() {
  if (initialized) return;

  // Lol fake delay to wait for websocket to be initialized
  await delay(2000);
  initialized = true;
}

const getImageDimensions = (
  imageSize: ImageSize
): { width: number; height: number } => {
  switch (imageSize) {
    case "landscape":
      return { width: 1024, height: 512 };
    case "portrait":
      return { width: 512, height: 1024 };
    case "square":
    default:
      return { width: 640, height: 640 };
  }
};

async function callAPI(prompt: string, imageSize: ImageSize) {
  await init();

  const { width, height } = getImageDimensions(imageSize);

  const response = await runware.requestImages({
    positivePrompt: prompt,
    width,
    height,
    model: "runware:100@1",
  });

  return response?.[0].imageURL;
}

export const imgGenService = {
  init,
  callAPI,
};
