import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { ROUTES } from "./urls";

const CustomFormListPage = lazy(
  () => import("./pages/CustomFormList/CustomFormListPage"),
);

const ArchivedFormListPage = lazy(
  () => import("./pages/ArchivedCustomFormList/ArchivedCustomFormListPage"),
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<CustomFormListPage />} />
      <Route path={ROUTES.ARCHIVED} element={<ArchivedFormListPage />} />
      <Route path="*" element={<Navigate to={ROUTES.ACTIVE} />} />
    </Routes>
  );
};
