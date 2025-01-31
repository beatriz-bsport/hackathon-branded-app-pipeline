import { lazy, Suspense } from "react";
import { AuthWrapper } from "@bsport/b2b-backbone";
import { ThemeProvider } from "@bsport/kaizen-primitive-core";

import { i18nInstance, I18nextProvider } from "#src/utils/i18n";
import DevTools from "#src/components/dev-tools/DevTools";
import HomeExample from "#src/components/template-examples/HomeExample";

const Navigation = lazy(() => import("navigation-sidebar/Navigation"));

function App() {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider>
        <div className="bg-surface-page min-h-screen">
          <AuthWrapper>
            <div className="flex">
              <Suspense>
                <Navigation />
              </Suspense>
              <DevTools />
              <HomeExample />
            </div>
          </AuthWrapper>
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
