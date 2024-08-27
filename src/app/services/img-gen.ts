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

async function callAPI(prompt: string, imageSize: string) {
  await init();

  let width, height;

  switch (imageSize) {
    case 'square':
      width = 640;
      height = 640;
      break;
    case 'rectangle':
      width = 1024;
      height = 512;
      break;
    case 'portrait':
      width = 512;
      height = 1024;
      break;
    default:
      width = 1024;
      height = 1024;
  }

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
