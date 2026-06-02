import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";

import { Loader } from "@bsport/kaizen-primitive-core";

import { ABSOLUTE_ROUTES, LEGACY_URLS, ROUTES } from "#src/urls";
import { flags, useFlag } from "#src/utils/feature-flags";

const WidgetsSettingsPage = lazy(
  () => import("#src/pages/widgets-settings-page"),
);

const LazyRouteFallback = () => (
  <div className="grid h-full w-full place-content-center">
    <Loader size="xl" />
  </div>
);

const LegacyWidgetsSettingsRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const legacyUrl = `${LEGACY_URLS.CREATE}${location.search}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl === legacyUrl) {
      return;
    }

    window.location.assign(legacyUrl);
  }, [location.search]);

  return null;
};

export const AppRoutes = () => {
  const isWidgetsSettingsPageEnabled = useFlag(flags.widgetsSettingsPage);

  return (
    <Suspense fallback={<LazyRouteFallback />}>
      <Routes>
        <Route
          element={
            isWidgetsSettingsPageEnabled ? (
              <WidgetsSettingsPage />
            ) : (
              <LegacyWidgetsSettingsRedirect />
            )
          }
          path={ROUTES.CREATE}
        />
        <Route
          element={<Navigate to={ABSOLUTE_ROUTES.CREATE} replace />}
          path="*"
        />
      </Routes>
    </Suspense>
  );
};
