import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Import the i18n configuration
import "./config/i18n"; // or "./i18n" if file is i18n.ts at root

import { I18nextProvider } from "react-i18next";
import i18n from "./config/i18n"; // make sure the path matches your actual structure

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found!");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
