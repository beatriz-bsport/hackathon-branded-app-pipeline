import { Route, Routes } from "react-router";

import { GiftcardArchivedListPage } from "#src/pages/GiftcardArchivedList";
import { GiftcardListPage } from "#src/pages/GiftcardList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GiftcardListPage />} index />
      <Route element={<GiftcardArchivedListPage />} path="archived" />
    </Routes>
  );
};

export default AppRoutes;
