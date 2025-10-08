import type { FC } from "react";

import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

import "./index.css";

/**
 * Core of the application.
 * This is what is built and federated.
 */
const App: FC = () => {
  return (
    <ErrorBoundaryWrapper appName={__HOMEPAGE__.__SENTRY_SCOPE_TAG__}>
      <AppI18nextProvider>
        <AppRoutes />
      </AppI18nextProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
