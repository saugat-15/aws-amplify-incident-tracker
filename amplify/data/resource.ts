import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  ServiceRequest: a
    .model({
      id: a.id().required(), //uuid
      serviceName: a.string(),
      description: a.string(),
      severity: a.enum(["LOW", "MEDIUM", "HIGH"]),
      resolutionDate: a.datetime(),
      reporterName: a.string(),
      contactEmail: a.email(),
      location: a.string(),
      timestamp: a.timestamp(),
    })
    .authorization((allow) => [allow.groups(["USERS"])]),
});

// exports the schema type to be used in the client
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed along with authorization modes
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
