import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const InsightsPage = lazy(() => import("#src/pages/InsightsPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InsightsPage />} index />
      <Route element={<Navigate to=".." />} path="*" />
    </Routes>
  );
};
