import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "#src/urls";

const ArchivedTeacherListPage = lazy(
  () => import("#src/pages/ArchivedTeacherList"),
);
const TeacherListPage = lazy(() => import("#src/pages/TeacherList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherListPage />} index />
      <Route element={<ArchivedTeacherListPage />} path={URLS.ARCHIVED} />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
