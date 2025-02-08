import { fetchAuthSession } from "aws-amplify/auth";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { signOut } from "aws-amplify/auth";

const client = generateClient<Schema>();

export default function TodoList() {
  const createTodo = async () => {
    const session = await fetchAuthSession();
    if (!session) {
      throw new Error("No session found");
    }

    console.log("session", session);
  };

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
