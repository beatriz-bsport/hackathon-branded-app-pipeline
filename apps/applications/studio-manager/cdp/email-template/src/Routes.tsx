import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "./urls";

const CustomListPage = lazy(() => import("#src/pages/CustomTemplate/ListPage"));

const SharedListPage = lazy(() => import("#src/pages/SharedTemplate/ListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={ROUTES.CUSTOM_TEMPLATES} />} />
      <Route element={<CustomListPage />} path={ROUTES.CUSTOM_TEMPLATES} />
      <Route element={<SharedListPage />} path={ROUTES.MASTER_TEMPLATES} />
      <Route element={<SharedListPage />} path={ROUTES.BSPORT_TEMPLATES} />
      <Route
        path="*"
        element={<Navigate to={`../${ROUTES.CUSTOM_TEMPLATES}`} />}
      />
    </Routes>
  );
};
