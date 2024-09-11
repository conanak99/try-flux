import { Client } from 'minio';

import { config } from '@/config';

const { endPoint, accessKey, secretKey, bucketName } = config.minio;

const minioClient = new Client({
  endPoint,
  accessKey,
  secretKey,
  useSSL: true,
});

export async function uploadToMinio(
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
