import { Logger } from "@aws-lambda-powertools/logger";
import type { Schema } from "../../resource";

const logger = new Logger({
  serviceName: "serviceRequest",
});

export const handler: Schema["createRequest"]["functionHandler"] = async (
  event
) => {
  logger.info("Received request", { event });
  return {
    Headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "GET, POST",
      "Access-Control-Allow-Methods": "*",
    },
    StatusCode: 200,
  };
};
