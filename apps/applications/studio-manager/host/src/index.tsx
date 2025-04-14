import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@bsport/kaizen-primitive-core/styles";

import { Root } from "./Root";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
