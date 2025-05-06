import { lazy } from "react";
import { Route, Routes } from "react-router";

const InvoiceListPage = lazy(() => import("#src/pages/InvoiceLisPage"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<InvoiceListPage />} index />
    </Routes>
  );
};

export default AppRoutes;
