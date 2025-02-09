import { a } from "@aws-amplify/backend";

export const ServiceRequest = a.model({
  id: a.id().required(), //uuid
  serviceName: a.string(),
  description: a.string(),
  severity: a.enum(["LOW", "MEDIUM", "HIGH"]),
  resolutionDate: a.datetime(),
  reporterName: a.string(),
  contactEmail: a.email(),
  location: a.string(),
  timestamp: a.timestamp(),
});
