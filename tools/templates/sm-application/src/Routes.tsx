import { Route, Routes } from "react-router";

import App from "#src/pages/Home";
import ListPage from "#src/pages/ListPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<App />} path="/" />
      <Route element={<ListPage />} path="/list-example" />
    </Routes>
  );
};

export default AppRoutes;
