import { i18nInstance, I18nextProvider } from "#src/utils/i18n";
import AppRoutes from "./Routes";

/**
 * Core of the application, without wrapper.
 * This is what is built and federated.
 */
const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <AppRoutes />
    </I18nextProvider>
  );
};

export default App;
