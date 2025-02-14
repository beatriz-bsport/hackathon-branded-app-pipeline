import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppWrapper } from "@bsport/b2b-backbone";
import "@bsport/kaizen-primitive-core/styles";
import "./index.css";
import App from "./App";
import { i18nInstance } from "#src/utils/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper i18nInstance={i18nInstance}>
        <App />
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>,
);
