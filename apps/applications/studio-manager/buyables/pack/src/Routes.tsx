import { lazy } from "react";
import { Route, Routes } from "react-router";

const PackListPage = lazy(() => import("#src/pages/PackListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PackListPage />} index />
    </Routes>
  );
};
