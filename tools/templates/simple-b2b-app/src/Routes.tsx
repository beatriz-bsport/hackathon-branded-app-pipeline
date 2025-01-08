import { Routes, Route } from "react-router";
import App from "#src/pages/App";

const AppRoutes = () => (
  <Routes>
    <Route index element={<App />} />
  </Routes>
);

export default AppRoutes;
