import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

import "./index.css";

const queryClient = new QueryClient();

/**
 * Core of the application.
 * This is what is built and federated.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundaryWrapper appName={__SESSION__.__SENTRY_SCOPE_TAG__}>
      <QueryClientProvider client={queryClient}>
        <AppI18nextProvider>
          <AppRoutes />
        </AppI18nextProvider>
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
