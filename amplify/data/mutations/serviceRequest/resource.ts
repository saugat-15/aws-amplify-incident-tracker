import { a } from "@aws-amplify/backend";
import { defineFunction } from "@aws-amplify/backend";

export const createRequestHandler = defineFunction({
  entry: "./handler.ts",
});

export const createRequest = a
  .mutation()
  .arguments({
    id: a.string().required(),
    serviceName: a.string().required(),
    description: a.string().required(),
    severity: a.enum(["LOW", "MEDIUM", "HIGH"]),
    reporterName: a.string().required(),
    contactEmail: a.email().required(),
    location: a.string(),
    resolutionDate: a.datetime(),
  })
  .returns(a.ref("ServiceRequest"))
  .handler(a.handler.function(createRequestHandler));
