import { lazy } from "react";
import { Route, Routes } from "react-router";

import { AppWrapper } from "@bsport/b2b-backbone";

const GroupActivities = lazy(() => import("sm-group-activity/App"));
const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

const basename = __HOST__.__BASENAME__;

export function Root() {
  return (
    <AppWrapper basename={basename} NavigationApp={NavigationSidebar}>
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />
        <Route path="/activity/*" element={<GroupActivities />} />
      </Routes>
    </AppWrapper>
  );
}
