import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
// Import environment variables with type safety, scoped to post-confirmation function
import { env } from "$amplify/env/post-confirmation";

const client = new CognitoIdentityProviderClient();

async function addUserToGroup(
  username: string,
  userPoolId: string,
  groupName: string
) {
  const command = new AdminAddUserToGroupCommand({
    GroupName: groupName,
    Username: username,
    UserPoolId: userPoolId,
  });

  try {
    const response = await client.send(command);
    console.log(
      `Added user ${username} to group ${groupName}`,
      response.$metadata.requestId
    );
    return true;
  } catch (error) {
    console.error(
      `Failed to add user ${username} to group ${groupName}:`,
      error
    );
    return false;
  }
}

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const groups = env.DEFAULT_GROUPS!.split(",").map((g: string) => g.trim());

  for (const group of groups) {
    await addUserToGroup(event.userName, event.userPoolId, group);
  }

  return event;
};
