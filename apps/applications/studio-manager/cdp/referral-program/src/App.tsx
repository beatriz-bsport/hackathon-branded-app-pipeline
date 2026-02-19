import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

import "./index.css";

/**
 * Core of the application.
 * This is what is built and federated.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundaryWrapper appName="sm-referral-program">
      <AppI18nextProvider>
        <AppRoutes />
      </AppI18nextProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
