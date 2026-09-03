import { StrictMode } from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  BrowserRouter,
} from "react-router";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import App from "./App.jsx";

import "./index.css";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={googleClientId}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error) => {
        console.error(
          "Service worker registration failed:",
          error
        );
      });
  });
}