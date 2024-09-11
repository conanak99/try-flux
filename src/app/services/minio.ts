import { Client } from 'minio';

import { config } from '@/config';

const { endPoint, accessKey, secretKey, bucketName } = config.minio;

const minioClient = new Client({
  endPoint,
  accessKey,
  secretKey,
  useSSL: true,
});

async function uploadToMinio(
  imageUrl: string,
  fileName: string
): Promise<string> {
  fetch(imageUrl)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      // Just upload, don't wait for it to finish
      minioClient.putObject(bucketName, fileName, Buffer.from(buffer));
    })
    .catch((error) => console.error('Error uploading to Minio:', error));

  return `https://${endPoint}/${bucketName}/${fileName}`;
}

export async function uploadImageToMinio(imageUrl: string) {
  const fileName =
    imageUrl.split('/').pop() ||
    `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const minioUrl = await uploadToMinio(imageUrl, fileName);
  return minioUrl;
}
