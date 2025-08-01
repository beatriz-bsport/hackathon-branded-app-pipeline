import { lazy } from "react";
import { Route, Routes } from "react-router";

const SettingPage = lazy(() => import("#src/pages/SettingPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<SettingPage />} path="/" />
    </Routes>
  );
};
