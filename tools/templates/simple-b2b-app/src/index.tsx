import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { AppWrapper } from "@bsport/b2b-backbone";
import "@bsport/kaizen-primitive-core/styles";

import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper>
        <App />
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>,
);
