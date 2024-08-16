import { config } from "@/config";
import { Runware } from "@runware/sdk-js";
import delay from "delay";

const runware = new Runware({
  apiKey: config.runwareApiKey,
});

let initialized = false;

async function init() {
  if (initialized) return;
  await delay(2000);
  initialized = true;
}

async function callAPI(prompt: string) {
  await init();

  const response = await runware.requestImages({
    positivePrompt: prompt,
    height: 1024,
    width: 768,
    model: "runware:100@1",
    // steps: 30,
    // numberResults: 1,
    // clipSkip: 1,
  });

  return response?.[0].imageURL;
}

export const imgGenService = {
  init,
  callAPI,
};
