import { Route, Routes } from "react-router";

import { ArchivedMemberListPage } from "#src/pages/ArchivedMemberList";
import { MemberListPage } from "#src/pages/MemberList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MemberListPage />} index />
      <Route element={<ArchivedMemberListPage />} path="archived" />
    </Routes>
  );
};

export default AppRoutes;
