import { Route, Routes } from "react-router";
import App from "#src/pages/App";
import Login from "#src/pages/Login";

const AppRoutes = () => (
  <Routes>
    <Route index element={<App />} />
    <Route element={<Login />} path="/login" />
  </Routes>
);

export default AppRoutes;
