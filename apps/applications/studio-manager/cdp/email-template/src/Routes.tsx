import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "./urls";

const EmailTemplateSummaryPage = lazy(
  () => import("#src/pages/EmailTemplateSummaryPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<EmailTemplateSummaryPage />} />
      <Route
        element={<EmailTemplateSummaryPage />}
        path={ROUTES.MASTER_TEMPLATES}
      />
      <Route
        element={<EmailTemplateSummaryPage />}
        path={ROUTES.BSPORT_TEMPLATES}
      />
    </Routes>
  );
};
