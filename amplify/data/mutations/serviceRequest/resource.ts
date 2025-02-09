import { a } from "@aws-amplify/backend";
import { defineFunction } from "@aws-amplify/backend";

const createServiceRequestHandler = defineFunction({
  entry: "./handler.ts",
});

export const createRequest = a
  .mutation()
  .arguments({
    serviceName: a.string().required(),
    description: a.string().required(),
    severity: a.enum(["LOW", "MEDIUM", "HIGH"]),
    reporterName: a.string().required(),
    contactEmail: a.email().required(),
    location: a.string(),
    timeStamp: a.timestamp(),
    resolutionDate: a.datetime(),
  })
  .returns(a.ref("ServiceRequest"))
  .handler(a.handler.function(createServiceRequestHandler));
