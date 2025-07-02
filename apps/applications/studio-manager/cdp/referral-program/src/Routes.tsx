import { lazy } from "react";
import { Route, Routes } from "react-router";

const ProgramPage = lazy(() => import("#src/pages/Settings/SettingsPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProgramPage />} path="/" />
    </Routes>
  );
};
