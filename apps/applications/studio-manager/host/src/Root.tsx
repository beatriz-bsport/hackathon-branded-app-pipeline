import { lazy } from "react";
import { Route, Routes } from "react-router";

import { AppWrapper } from "@bsport/sm-backbone";

// ----- Booking -----
const GroupActivities = lazy(() => import("sm-group-activity/App"));

// ----- Buyables -----
const Giftcard = lazy(() => import("sm-giftcard/App"));

// ----- Core-data -----
const MemberList = lazy(() => import("sm-member-list/App"));

// ----- Financial Services -----
const Invoice = lazy(() => import("sm-invoice/App"));

// ----- Common -----
const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

const basename = __HOST__.__BASENAME__;

export function Root() {
  return (
    <AppWrapper basename={basename} NavigationApp={NavigationSidebar}>
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />

        {/* ----- Booking ----- */}
        <Route path="/activity/*" element={<GroupActivities />} />

        {/* ----- Buyables ----- */}
        <Route path="/giftcard/*" element={<Giftcard />} />

        {/* ----- Core-data ----- */}
        <Route path="/member/*" element={<MemberList />} />

        {/* ----- Financial Services ----- */}
        <Route path="/invoice/*" element={<Invoice />} />
      </Routes>
    </AppWrapper>
  );
}
