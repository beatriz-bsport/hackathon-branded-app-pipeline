import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

import "./index.css";

const App: React.FC = () => {
  return (
    <ErrorBoundaryWrapper appName={__SMARTLISTS__.__SENTRY_SCOPE_TAG__}>
      <AppI18nextProvider>
        <AppRoutes />
      </AppI18nextProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
