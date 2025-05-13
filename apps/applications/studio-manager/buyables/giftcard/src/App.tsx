import { AppI18nextProvider } from "#src/utils/i18n";

import { AppRoutes } from "./Routes";

/**
 * Core of the application.
 * Built and federated, it can be dynamically loaded in an host application.
 */
const App: React.FC = () => {
  return (
    <AppI18nextProvider>
      <AppRoutes />
    </AppI18nextProvider>
  );
};

export default App;
