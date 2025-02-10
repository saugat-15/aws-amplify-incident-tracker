import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import { parseAmplifyConfig } from "aws-amplify/utils";
import Header from "./components/Header.tsx";
import { signOut } from "aws-amplify/auth";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: outputs.custom.API,
  },
});
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

const theme = {
  name: "custom-theme",
  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: "#A27B5C",
          color: "#e3fcd6",
        },
      },
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Authenticator formFields={formFields}>
        <Header title="Service Request Incident Tracker" onSignOut={signOut} />
        <App />
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>
);
