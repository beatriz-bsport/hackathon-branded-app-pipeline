import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

import { AppWrapper } from "@bsport/b2b-backbone";

const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

const GroupActivities = lazy(() => import("sm-group-activity/App"));

export function Root() {
  return (
    <AppWrapper>
      <div className="flex">
        <Suspense
          fallback={
            <div className="h-screen w-[240px] bg-surface-page-navigation" />
          }
        >
          <NavigationSidebar />
        </Suspense>
        <Routes>
          <Route path="/" element={<div> hello world </div>} />
          <Route path="/activity/*" element={<GroupActivities />} />
        </Routes>
      </div>
    </AppWrapper>
  );
}
