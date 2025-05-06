import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "./urls";

const ArchivedMemberListPage = lazy(
  () => import("#src/pages/ArchivedMemberList"),
);
const MemberListPage = lazy(() => import("#src/pages/MemberList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MemberListPage />} index />
      <Route element={<ArchivedMemberListPage />} path={ROUTES.ARCHIVED} />
    </Routes>
  );
};
