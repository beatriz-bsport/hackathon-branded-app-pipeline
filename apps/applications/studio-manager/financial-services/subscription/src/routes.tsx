import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

const SubscriptionLayout = lazy(() => import("#src/pages/subscription-layout"));
const PlanPage = lazy(() => import("#src/pages/plan-page"));
const AddonsPage = lazy(() => import("#src/pages/addons-page"));
const BillingPage = lazy(() => import("#src/pages/billing-page"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SubscriptionLayout />}>
        <Route index element={<Navigate to="plan" replace />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="addons" element={<AddonsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="*" element={<Navigate to=".." replace />} />
      </Route>
    </Routes>
  );
};
