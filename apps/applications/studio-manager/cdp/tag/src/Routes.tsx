import { lazy } from "react";
import { Route, Routes } from "react-router";

const TagsPage = lazy(() => import("#src/pages/TagsPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<TagsPage />} path="/" />
    </Routes>
  );
};
