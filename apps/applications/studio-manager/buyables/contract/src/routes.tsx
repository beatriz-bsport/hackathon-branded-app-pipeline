import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "./urls";

const ContractListPage = lazy(() => import("#src/pages/contract-list"));
const ContractEditorPage = lazy(() => import("#src/pages/contract-editor"));
const ContractOverviewPage = lazy(() => import("#src/pages/contract-overview"));
const ContractPausesListPage = lazy(
  () => import("#src/pages/contract-pauses-list"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ContractListPage />} index />

      {/** Details pages */}
      <Route element={<ContractEditorPage />} path={URLS.EDITOR_SLUG} />
      <Route element={<ContractOverviewPage />} path={URLS.OVERVIEW_SLUG} />
      <Route element={<ContractPausesListPage />} path={URLS.PAUSES_SLUG} />

      {/** Fallback to details page */}
      <Route element={<ContractEditorPage />} path={`${URLS.EDITOR_SLUG}/*`} />

      {/** Global fallback */}
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
