import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const config = {
  runwareApiKey: process.env.RUNWARE_API_KEY || '',
  groqApiKeys: process.env.GROQ_API_KEYS?.split(',') || [],
  bingApiKey: process.env.BING_API_KEY || '',
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || '',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
    bucketName: process.env.MINIO_BUCKET_NAME || '',
  },
};
