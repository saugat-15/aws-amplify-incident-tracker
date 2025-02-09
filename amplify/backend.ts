import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { imageProcessor } from "./functions/imageProcessor/resource";
import { configureApi } from "./config/api/imageApi";
import { configureStorage } from "./config/s3/imageBucket";
import { Stack } from "aws-cdk-lib";

const backend = defineBackend({
  auth,
  data,
  imageProcessor,
});

// sanitising the branch name for use in the bucket naming
const envName = process.env.AWS_BRANCH!.toLowerCase().replace(/_/g, "-").trim();

const storageStack = backend.createStack(`public-storage-${envName}`);
const apiStack = backend.createStack("api-stack");

const imageApi = configureApi(backend, apiStack, envName);
const imageBucket = configureStorage(backend, storageStack, envName);

backend.addOutput({
  custom: {
    API: {
      [imageApi.restApiName]: {
        endpoint: imageApi.url,
        region: Stack.of(imageApi).region,
        apiName: imageApi.restApiName,
      },
    },
    Storage: {
      [imageBucket.bucketName]: {
        bucketName: imageBucket.bucketName,
        region: Stack.of(imageBucket).region,
      },
    },
  },
});
