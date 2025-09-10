import { lazy } from "react";
import { Route, Routes } from "react-router";

const MarketingNotificationListPage = lazy(
  () => import("#src/pages/MarketingNotificationListPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MarketingNotificationListPage />} path="/" />
    </Routes>
  );
};
