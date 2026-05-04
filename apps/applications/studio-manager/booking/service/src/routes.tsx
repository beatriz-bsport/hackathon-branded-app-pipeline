import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const ListPage = lazy(() => import("./pages/classes-list"));
const ArchivedListPage = lazy(() => import("./pages/archived-classes-list"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ListPage />} path="/" />
      <Route element={<ArchivedListPage />} path="/archived" />
      <Route element={<Navigate to=".." replace />} path="*" />
    </Routes>
  );
};
