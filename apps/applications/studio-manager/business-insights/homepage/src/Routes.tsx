import { lazy } from "react";
import { Route, Routes } from "react-router";

const HomePage = lazy(() => import("#src/pages/HomePage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
    </Routes>
  );
};
