import { lazy } from "react";
import { Route, Routes } from "react-router";

const PayoutPage = lazy(() => import("#src/pages/payout-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PayoutPage />} index />
    </Routes>
  );
};
