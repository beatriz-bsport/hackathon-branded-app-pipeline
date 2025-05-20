import { lazy } from "react";
import { Route, Routes } from "react-router";
// Import urls from the navigation sidebar
import urls from "sm-navigation-sidebar/urls";

import { AppWrapper } from "@bsport/sm-backbone";

// ----- Booking -----
const GroupActivities = lazy(() => import("sm-group-activity/App"));

// ----- Buyables -----
const Giftcard = lazy(() => import("sm-giftcard/App"));

// ----- Core-data -----
const MemberList = lazy(() => import("sm-member-list/App"));
const Teacher = lazy(() => import("sm-teacher/App"));

// ----- Financial Services -----
const Invoice = lazy(() => import("sm-invoice/App"));

// ----- Customer Data Platform -----
const Smartlists = lazy(() => import("sm-smartlists/App"));

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
        <Route path={`${urls.activity}/*`} element={<GroupActivities />} />

        {/* ----- Buyables ----- */}
        <Route path={`${urls.giftcard}/*`} element={<Giftcard />} />

        {/* ----- Core-data ----- */}
        <Route path={`${urls.member}/*`} element={<MemberList />} />
        <Route path={`${urls.teacher}/*`} element={<Teacher />} />

        {/* ----- Financial Services ----- */}
        <Route path={`${urls.invoice}/*`} element={<Invoice />} />

        {/* ----- Customer Data Platform ----- */}
        <Route path={`${urls.smartlist}/*`} element={<Smartlists />} />
      </Routes>
    </AppWrapper>
  );
}
