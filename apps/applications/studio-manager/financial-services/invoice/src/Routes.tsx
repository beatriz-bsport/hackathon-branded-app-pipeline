import { Route, Routes } from "react-router";

import { InvoiceListPage } from "#src/pages/InvoiceLisPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InvoiceListPage />} index />
    </Routes>
  );
};

export default AppRoutes;
