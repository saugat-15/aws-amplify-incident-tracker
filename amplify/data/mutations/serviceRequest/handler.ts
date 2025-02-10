import { Logger } from "@aws-lambda-powertools/logger";
import type { Schema } from "../../resource";
import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/handler";
import { executeGraphQL } from "../../utils/graphQlUtils";
import { validateServiceRequestWithoutId } from "../../../validators/ServiceRequestValidator";

const logger = new Logger({
  serviceName: "serviceRequest",
});

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "identityPool",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => {
          if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
            throw new Error("Missing required AWS credentials");
          }
          return {
            credentials: {
              accessKeyId: env.AWS_ACCESS_KEY_ID,
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
              sessionToken: env.AWS_SESSION_TOKEN,
            },
          };
        },
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

type ServiceRequest = {
  id: string;
  serviceName: string;
  description: string;
  severity: string;
  resolutionDate: string;
  reporterName: string;
  contactEmail: string;
  location: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

const operations = {
  createServiceRequest: /* GraphQL */ `
    mutation CreateServiceRequest($input: CreateServiceRequestInput!) {
      createServiceRequest(input: $input) {
        id
        serviceName
        description
        severity
        resolutionDate
        reporterName
        contactEmail
        location
        createdAt
        updatedAt
      }
    }
  `,
};

export const handler: Schema["createRequest"]["functionHandler"] = async (
  event
) => {
  try {
    const input = { ...event.arguments };

    logger.info("Creating Service Request", { input });

    const validatedInput = validateServiceRequestWithoutId(input);

    logger.info("Validated Input", { validatedInput });

    const createServiceRequestResult = await executeGraphQL<{
      createServiceRequest: ServiceRequest;
    }>(operations.createServiceRequest, { input: validatedInput.data });

    return createServiceRequestResult.createServiceRequest;
  } catch (error) {
    logger.error("Error creating Service Request", { error });
    throw error;
  }
};
