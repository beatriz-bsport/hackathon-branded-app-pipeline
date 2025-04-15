import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@bsport/kaizen-primitive-core/styles";
import { AppWrapper } from "@bsport/sm-backbone";

import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>,
);
