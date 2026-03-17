import { QueryClient } from "@tanstack/react-query";
import type { FC } from "react";

import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { ReactQueryProvider } from "#src/components/react-query-provider";
import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

import "./index.css";

const queryClient = new QueryClient();

/**
 * Core of the application.
 * This is what is built and federated.
 */
const App: FC = () => {
  return (
    <ErrorBoundaryWrapper appName={__PAYOUT__.__SENTRY_SCOPE_TAG__}>
      <ReactQueryProvider client={queryClient}>
        <AppI18nextProvider>
          <AppRoutes />
        </AppI18nextProvider>
      </ReactQueryProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
