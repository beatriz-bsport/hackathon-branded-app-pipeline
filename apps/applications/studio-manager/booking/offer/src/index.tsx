import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";

import "@bsport/kaizen-primitive-core/styles";
import { AppWrapper } from "@bsport/sm-backbone";

import App from "./App";

const basename = __OFFER__.__BASENAME__;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper
      basename={basename}
      NavigationApp={lazy(
        () => import("sm-navigation-sidebar/NavigationSidebar"),
      )}
    >
      <App />
    </AppWrapper>
  </StrictMode>,
);
