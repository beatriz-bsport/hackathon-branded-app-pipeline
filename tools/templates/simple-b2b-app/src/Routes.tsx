import { Route, Routes } from "react-router";
import { DevLoginPage } from "@bsport/b2b-backbone";
import App from "#src/pages/Home";
import ListPage from "#src/pages/ListPage";
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
      {isLocalDevelopment && <Route element={<DevLoginPage />} path="login" />}
    </Routes>
  );
};

export default AppRoutes;
