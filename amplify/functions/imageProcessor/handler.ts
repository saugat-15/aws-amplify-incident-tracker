import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

// Initialize logger
const logger = new Logger({
  serviceName: "image-processor",
});

// S3 Client initialization
const s3Client = new S3Client();

// CORS headers for the response
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "GET, POST",
  "Access-Control-Allow-Methods": "*",
};

enum ACTION {
  UPLOAD = "UPLOAD",
  LIST = "LIST",
}

// Lambda function handler
export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info("Received request", { event });
  const data =
    event.httpMethod === "POST"
      ? parseEventBody(event.body)
      : event.queryStringParameters;

  if (!data) {
    return response(400, "Invalid input data.");
  }

  logger.info("Request data parsed", {
    action: data.action,
    fileName: data.fileName,
  });

  try {
    switch (data.action) {
      case ACTION.UPLOAD:
        return await handleUpload(data);
      case ACTION.LIST:
        return await handleList();
      default:
        return response(400, "Invalid action specified.");
    }
  } catch (error) {
    logger.error("Error processing request", { error });
    return response(500, "Error processing request");
  }
};

// Helper function to parse event body
const parseEventBody = (body: string | null) => {
  const MAX_PAYLOAD_SIZE = 1048576; // 1 MB limit
  if (body && Buffer.byteLength(body, "utf8") > MAX_PAYLOAD_SIZE) {
    logger.error("Payload size too large");
    return null;
  }

  try {
    logger.info("Parsing event body", { body });
    return body ? JSON.parse(body) : null;
  } catch (error) {
    logger.error("Error parsing event body", { error });
    return null;
  }
};

// Function to send response
const response = (statusCode: number, message: string, data: any = null) => ({
  statusCode,
  headers,
  body: JSON.stringify({ message, data }),
});

// Handle image upload
const handleUpload = async (data: {
  action: string;
  fileName: string;
  imageData: string;
}) => {
  const { fileName, imageData } = data;
  logger.info("Starting image upload", { fileName });

  await writeToS3(fileName, imageData);

  return response(200, "Image uploaded successfully");
};

// Handle listing images
const handleList = async () => {
  const data = await listS3Files();
  return response(200, "Images listed successfully", data);
};

// List files in S3
const listS3Files = async () => {
  const bucketName = process.env.BUCKET_NAME!;
  try {
    logger.info("Listing all files in S3 bucket", { bucketName });
    const { Contents } = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "public/",
      })
    );

    if (!Contents || Contents.length === 0) {
      return [];
    }

    const imageUrls = Contents.map(
      (item) => `https://${bucketName}.s3.amazonaws.com/${item.Key}`
    );
    logger.info("Successfully listed files from S3", {
      fileCount: Contents.length,
    });

    return imageUrls;
  } catch (error) {
    logger.error("Error listing files from S3", { error, bucketName });
    throw new Error("Failed to list files from S3");
  }
};

// Function to upload a file to S3
const writeToS3 = async (fileName: string, imageData: string) => {
  const bucketName = process.env.BUCKET_NAME;
  const key = `public/${fileName}`;
  const buffer = Buffer.from(imageData, "base64");

  try {
    logger.info("Uploading file to S3", { bucketName, key });
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
      })
    );

    logger.info("Successfully uploaded file to S3", { bucketName, key });
  } catch (error) {
    logger.error("Error uploading file to S3", {
      error,
      bucketName,
      key,
    });
    throw new Error("Failed to upload file to S3");
  }
};
