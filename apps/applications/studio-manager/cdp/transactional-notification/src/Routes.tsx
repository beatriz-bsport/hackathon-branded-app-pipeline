import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const NotificationRuleGroupListPage = lazy(
  () => import("#src/pages/NotificationRuleGroupListPage"),
);

const NotificationRuleGroupDetailPage = lazy(
  () => import("#src/pages/NotificationRuleGroupDetailPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<NotificationRuleGroupListPage />} path="/" />
      <Route element={<NotificationRuleGroupDetailPage />} path=":id" />
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};
