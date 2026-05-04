import { lazy } from "react";
import { Route, Routes } from "react-router";

const ListPage = lazy(() => import("#src/pages/aggregators-view-settings"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path="/" />
    </Routes>
  );
};
