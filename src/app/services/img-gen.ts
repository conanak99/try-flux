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

async function callAPI(prompt: string) {
  await init();

  const response = await runware.requestImages({
    positivePrompt: prompt,
    // height: 1024,
    // width: 768,
    height: 640,
    width: 1024,
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
