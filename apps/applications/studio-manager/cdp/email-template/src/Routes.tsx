import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "./urls";

const CustomListPage = lazy(() => import("#src/pages/CustomTemplate/ListPage"));

const SharedListPage = lazy(() => import("#src/pages/SharedTemplate/ListPage"));

const EmailTemplateEditor = lazy(
  () => import("#src/pages/EmailTemplateDetail/EmailTemplateEditor"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to={ROUTES.CUSTOM_TEMPLATES} />} />
      <Route element={<CustomListPage />} path={ROUTES.CUSTOM_TEMPLATES} />
      <Route element={<SharedListPage />} path={ROUTES.MASTER_TEMPLATES} />
      <Route element={<SharedListPage />} path={ROUTES.BSPORT_TEMPLATES} />
      <Route
        element={<EmailTemplateEditor />}
        path={ROUTES.EMAIL_TEMPLATE_CREATE}
      />
      <Route element={<EmailTemplateEditor />} path=":id" />
      <Route
        path="*"
        element={<Navigate to={`../${ROUTES.CUSTOM_TEMPLATES}`} />}
      />
    </Routes>
  );
};
