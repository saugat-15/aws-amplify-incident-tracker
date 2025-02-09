import * as s3 from "aws-cdk-lib/aws-s3";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Effect, PolicyStatement, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { BackendResources } from "../../shared/types/backendTypes";

export const configureStorage = (
  backend: BackendResources,
  storageStack: Stack,
  envName: string
) => {
  const imageBucket = new s3.Bucket(storageStack, `image-bucket-${envName}`, {
    bucketName: `image-bucket-${envName}`,
    publicReadAccess: true,
    blockPublicAccess: new s3.BlockPublicAccess({
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    }),
    removalPolicy: RemovalPolicy.DESTROY,
  });

  imageBucket.addToResourcePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new AnyPrincipal()],
      resources: [`${imageBucket.bucketArn}/public/*`],
    })
  );

  backend.imageProcessor.resources.lambda.addToRolePolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket",
      ],
      resources: [`${imageBucket.bucketArn}/public/*`, imageBucket.bucketArn],
    })
  );

  backend.imageProcessor.addEnvironment("BUCKET_NAME", imageBucket.bucketName);

  return imageBucket;
};
