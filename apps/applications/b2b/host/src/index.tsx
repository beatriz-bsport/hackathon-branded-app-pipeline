import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@bsport/kaizen-primitive-core/styles";

import { Root } from "./Root";

import "./index.css";

const basename = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_APPLICATION_BASE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Root />
    </BrowserRouter>
  </StrictMode>,
);
