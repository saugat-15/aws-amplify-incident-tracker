import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { IRole } from "aws-cdk-lib/aws-iam";
import { IFunction } from "aws-cdk-lib/aws-lambda";

export interface BackendResources {
  imageProcessor: {
    resources: {
      lambda: IFunction;
    };
    addEnvironment: (key: string, value: string) => void;
  };
  auth: {
    resources: {
      userPool: IUserPool;
      authenticatedUserIamRole: IRole;
    };
  };
}
