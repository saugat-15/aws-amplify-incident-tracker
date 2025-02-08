import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  data,
});

// const { cfnUserPool } = backend.auth.resources.cfnResources;

// enabling advanced security mode
// cfnUserPool.userPoolAddOns = {
//   advancedSecurityMode: "AUDIT",
// };

// cfnUserPool.enabledMfas = [...(cfnUserPool.enabledMfas || []), "EMAIL_OTP"];
