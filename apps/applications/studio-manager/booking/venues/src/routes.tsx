import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const ListPage = lazy(() => import("#src/pages/list-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path="/" />
      <Route path="*" element={<Navigate to=".." replace />} />
    </Routes>
  );
};
