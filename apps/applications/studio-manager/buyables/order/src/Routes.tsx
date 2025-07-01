import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "./urls";

const OrderListPage = lazy(() => import("#src/pages/OrderListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<OrderListPage />} index />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
