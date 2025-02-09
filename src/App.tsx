import { fetchAuthSession } from "aws-amplify/auth";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { signOut } from "aws-amplify/auth";
import ServiceRequestForm from "./components/service-request/ServiceRequestForm";

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
    <div className="relative">
      <button className="absolute top-0 right-10" onClick={() => signOut()}>
        Sign Out
      </button>
      <ServiceRequestForm />
    </div>
  );
}
