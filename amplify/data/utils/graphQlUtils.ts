import { Logger } from "@aws-lambda-powertools/logger";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../resource";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "graphql-utils",
});

const client = generateClient<Schema>();

export const executeGraphQL = async <T>(
  operation: string,
  variables: any
): Promise<T> => {
  const response = await client.graphql({
    query: operation,
    variables,
  });

  if ("errors" in response) {
    logger.error("GraphQL operation failed", { errors: response.errors });
    throw new Error(
      response.errors?.[0]?.message || "GraphQL operation failed"
    );
  }

  if ("data" in response) {
    return response.data as T;
  }
  throw new Error("No data returned from GraphQL operation");
};
