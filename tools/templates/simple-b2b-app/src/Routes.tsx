import { Route, Routes } from "react-router";
import App from "#src/pages/Home";
import ListPage from "#src/pages/ListPage";
import Login from "#src/pages/Login";
import { AuthenticatedAppWrapper } from "./AppWrapper";

const AppRoutes = () => {
  const isLocalDevelopment = true; // TODO : control with env variable for build
  return (
    <Routes>
      {/* Grouped authenticated routes */}
      <Route
        path="/"
        element={
          <AuthenticatedAppWrapper isLocalDevelopment={isLocalDevelopment} />
        }
      >
        <Route element={<App />} index />
        <Route element={<ListPage />} path="list-example" />
      </Route>
      {/* Unauthenticated routes */}
      {isLocalDevelopment && <Route element={<Login />} path="login" />}
    </Routes>
  );
};

export default AppRoutes;
