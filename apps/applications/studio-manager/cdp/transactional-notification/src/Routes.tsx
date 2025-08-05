import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const NotificationRuleEventPage = lazy(
  () => import("#src/pages/NotificationRuleEventPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<NotificationRuleEventPage />} path="/" />
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};
