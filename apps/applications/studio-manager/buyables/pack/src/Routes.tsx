import { lazy } from "react";
import { Route, Routes } from "react-router";

const PackListPage = lazy(() => import("#src/pages/PackList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PackListPage />} index />
    </Routes>
  );
};
