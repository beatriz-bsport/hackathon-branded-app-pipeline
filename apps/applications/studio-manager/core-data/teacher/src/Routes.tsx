import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "#src/urls";

const ArchivedTeacherListPage = lazy(
  () => import("#src/pages/ArchivedTeacherList"),
);
const TeacherListPage = lazy(() => import("#src/pages/TeacherList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherListPage />} index />
      <Route element={<ArchivedTeacherListPage />} path={ROUTES.ARCHIVED} />
    </Routes>
  );
};
