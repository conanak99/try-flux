import { config } from "@/config";
import { Client } from "minio";
import fetch from "node-fetch";

const { endPoint, accessKey, secretKey, bucketName } = config.minio;

const minioClient = new Client({
  endPoint,
  accessKey,
  secretKey,
  useSSL: false,
});


export async function uploadToMinio(
  imageUrl: string,
  fileName: string
): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Just upload, don't wait for it to finish
  minioClient.putObject(bucketName, fileName, Buffer.from(buffer));

  // Use wsrv.nl to get the image url work in http lol
  return `//wsrv.nl/?url=${endPoint}/${bucketName}/${fileName}`;
}
