import { lazy } from "react";
import { Route, Routes } from "react-router";

const InsightsPage = lazy(() => import("#src/pages/InsightsPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InsightsPage />} path="/" />
    </Routes>
  );
};
