import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import { URLS } from "./urls";

const ArchivedMemberListPage = lazy(
  () => import("#src/pages/ArchivedMemberList"),
);
const MemberListPage = lazy(() => import("#src/pages/MemberList"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MemberListPage />} index />
      <Route element={<ArchivedMemberListPage />} path={URLS.ARCHIVED} />
      <Route element={<Navigate to={URLS.INDEX} />} path="*" />
    </Routes>
  );
};
