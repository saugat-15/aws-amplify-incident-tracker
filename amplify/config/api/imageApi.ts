import {
  RestApi,
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { BackendResources } from "../../shared/types/backendTypes";

export const configureApi = (
  backend: BackendResources,
  apiStack: Stack,
  envName: string
) => {
  const imageApi = new RestApi(apiStack, "RestApi", {
    restApiName: `img-api-${envName}`,
    deploy: true,
    deployOptions: {
      stageName: envName,
    },
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: Cors.DEFAULT_HEADERS,
    },
  });

  const lambdaIntegration = new LambdaIntegration(
    backend.imageProcessor.resources.lambda
  );

  const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
    cognitoUserPools: [backend.auth.resources.userPool],
  });

  const imgPath = imageApi.root.addResource("img");
  imgPath.addMethod("GET", lambdaIntegration, {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuth,
  });
  imgPath.addMethod("POST", lambdaIntegration, {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuth,
  });

  const apiPolicy = new Policy(apiStack, "RestApiPolicy", {
    statements: [
      new PolicyStatement({
        actions: ["execute-api:Invoke"],
        resources: [
          `${imageApi.arnForExecuteApi("GET", "/img", envName)}`,
          `${imageApi.arnForExecuteApi("POST", "/img", envName)}`,
        ],
      }),
    ],
  });

  backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);

  return imageApi;
};
