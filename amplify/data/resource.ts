import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { models } from "./models";
import * as mutations from "./mutations";
import { createRequestHandler } from "./mutations/serviceRequest/resource";
// import { defineFunction } from "@aws-amplify/backend";
// import { createRequest } from "./mutations";

// import all the models so that the files can be properly arranged and we are not lost in the code when we have multiple models
const schema = a
  .schema({
    ...models,
    ...mutations,
  })
  .authorization((allow) => [
    allow.groups(["USERS"]),
    allow.resource(createRequestHandler),
  ]);

// export the schema type to be used in the client
export type Schema = ClientSchema<typeof schema>;

// define the data resource to be deployed along with authorization modes
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
