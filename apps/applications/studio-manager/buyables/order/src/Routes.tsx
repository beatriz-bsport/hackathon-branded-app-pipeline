import { lazy } from "react";
import { Route, Routes } from "react-router";

const OrderListPage = lazy(() => import("#src/pages/OrderListPage"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<OrderListPage />} index />
    </Routes>
  );
};
