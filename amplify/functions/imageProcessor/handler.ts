import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
// import { env } from "$amplify/env/";

const logger = new Logger({
  serviceName: "image-processor",
});

const s3Client = new S3Client();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event?.body || "{}");
    logger.info("Request data parsed", {
      action: data.action,
      fileName: data.fileName,
    });

    if (data.action === "upload") {
      // Handle image upload
      logger.info("Starting image upload", {
        fileName: data.fileName,
        imageData: data.imageData,
      });
      await _writeToS3(data.fileName, data.imageData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Image uploaded successfully" }),
      };
    } else {
      // Handle image retrieval
      const image = await _readFromS3();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Image retrieved successfully",
          data: image,
        }),
      };
    }

    // Add default return for unhandled actions
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Invalid action" }),
    };
  } catch (error) {
    logger.error("Error processing request", {
      error,
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error processing request" }),
    };
  }
};

async function _readFromS3(fileName?: string) {
  const bucketName = process.env.BUCKET_NAME;

  // If no fileName is provided, list all files in the public directory
  if (!fileName) {
    logger.info("Listing all files in bucket", {
      bucketName,
      prefix: "public/",
      operation: "ListObjectsV2",
    });

    try {
      const data = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: "public/",
        })
      );

      logger.info("Successfully listed files from S3", {
        bucketName,
        fileCount: data.Contents?.length,
      });

      return (
        data.Contents?.map((item) => ({
          key: item.Key,
          lastModified: item.LastModified,
          size: item.Size,
        })) || []
      );
    } catch (error) {
      logger.error("Error listing files from S3", {
        error,
        bucketName,
      });
      throw error;
    }
  }

  // If fileName is provided, fetch specific file
  const key = `public/${fileName}`;

  logger.info("Starting S3 read operation", {
    bucketName,
    key,
    operation: "GetObject",
  });

  try {
    const data = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    // Convert stream to base64
    const stream = data.Body as ReadableStream<Uint8Array>;
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    logger.info("Successfully read file from S3", {
      bucketName,
      key,
    });
    return buffer.toString("base64");
  } catch (error) {
    logger.error("Error reading from S3", {
      error,
      bucketName,
      key,
    });
    throw error;
  }
}

async function _writeToS3(fileName: string, imageData: string) {
  const bucketName = process.env.BUCKET_NAME;
  const key = `public/${fileName}`;

  logger.info("Starting S3 write operation", {
    bucketName,
    key,
    operation: "PutObject",
    contentType: "image/jpeg",
  });

  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(imageData, "base64");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/jpeg",
      })
    );

    logger.info("Successfully wrote file to S3", {
      bucketName,
      key,
    });
  } catch (error) {
    logger.error("Error writing to S3", {
      error,
      bucketName,
      key,
    });
    throw error;
  }
}
