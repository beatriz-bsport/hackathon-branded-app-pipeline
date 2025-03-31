import { Suspense, lazy } from "react";

const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

export function Root() {
  return (
    <div>
      App
      <Suspense
        fallback={
          <div className="h-screen w-[240px] bg-surface-page-navigation" />
        }
      >
        <NavigationSidebar />
      </Suspense>
    </div>
  );
}
