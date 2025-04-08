import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AppWrapper } from "@bsport/b2b-backbone";
import "@bsport/kaizen-primitive-core/styles";

import App from "./App";

import "./index.css";

const basename = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_APPLICATION_BASE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>,
);
