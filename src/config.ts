import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const config = {
  runwareApiKey: process.env.RUNWARE_API_KEY || "",
  groqApiKeys: process.env.GROQ_API_KEYS?.split(",") || [],
};
