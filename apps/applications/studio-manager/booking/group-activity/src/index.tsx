import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@bsport/kaizen-primitive-core/styles";
import { AppWrapper } from "@bsport/sm-backbone";

import App from "./App";

import "./index.css";

const basename = __GROUP_ACTIVITY__.__BASENAME__;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper basename={basename}>
      <App />
    </AppWrapper>
  </StrictMode>,
);
