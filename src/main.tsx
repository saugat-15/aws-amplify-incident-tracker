import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const formFields = {
  signUp: {
    email: {
      order: 1,
    },
    given_name: {
      label: "First Name",
      order: 2,
    },
    family_name: {
      label: "Last Name",
      order: 3,
    },
    password: {
      order: 5,
    },
    confirm_password: {
      order: 6,
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator formFields={formFields}>
      <App />
    </Authenticator>
  </React.StrictMode>
);
