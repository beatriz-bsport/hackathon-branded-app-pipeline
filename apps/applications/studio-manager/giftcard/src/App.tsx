import { AppI18nextProvider } from "#src/utils/i18n";

import AppRoutes from "./Routes";

/**
 * Core of the application, without wrapper.
 * This is what is built and federated.
 */
const App: React.FC = () => {
  return (
    <AppI18nextProvider>
      <AppRoutes />
    </AppI18nextProvider>
  );
};

export default App;
