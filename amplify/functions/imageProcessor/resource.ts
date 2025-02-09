import { defineFunction } from "@aws-amplify/backend";

export const imageProcessor = defineFunction({
  name: "image-processor",
  entry: "./handler.ts",
  environment: {
    AWS_BRANCH: process.env.AWS_BRANCH!,
    BUCKET_NAME: process.env.BUCKET_NAME || "",
  },
});
