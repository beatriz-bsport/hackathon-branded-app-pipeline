import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppWrapper } from "@bsport/b2b-backbone";
import "@bsport/kaizen-primitive-core/styles";

import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>,
);
