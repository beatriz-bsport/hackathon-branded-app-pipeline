import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Navigate, Route, Routes } from "react-router";

import "@bsport/kaizen-primitive-core/styles";
import { AppWrapper } from "@bsport/sm-backbone";

import App from "./App";
import { SMARTLIST_APP_ROOT_PATH } from "./urls";

const basename = __SEGMENT__.__BASENAME__;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper
      basename={basename}
      NavigationApp={lazy(
        () => import("sm-navigation-sidebar/NavigationSidebar"),
      )}
    >
      <Routes>
        <Route
          path="/"
          element={<Navigate to={SMARTLIST_APP_ROOT_PATH} replace />}
        />
        <Route path={`${SMARTLIST_APP_ROOT_PATH}/*`} element={<App />} />
      </Routes>
    </AppWrapper>
  </StrictMode>,
);
