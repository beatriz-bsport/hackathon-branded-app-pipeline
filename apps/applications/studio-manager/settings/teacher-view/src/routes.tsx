import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const TeacherViewSettingsPage = lazy(
  () => import("#src/pages/teacher-view-settings"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<TeacherViewSettingsPage />} path="/" />
      <Route element={<Navigate to=".." replace />} path="*" />
    </Routes>
  );
};
