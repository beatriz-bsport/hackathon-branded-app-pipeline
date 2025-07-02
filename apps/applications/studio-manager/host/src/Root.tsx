import { type ReactNode, lazy } from "react";
import { Route, Routes } from "react-router";
// Import urls from the navigation sidebar
import {
  REVAMP_URLS_DEVELOPMENT,
  REVAMP_URLS_PRODUCTION,
} from "sm-navigation-sidebar/urls";

import { getEnv } from "@bsport/envs";
import { AppWrapper } from "@bsport/sm-backbone";

// ----- Booking -----
const GroupActivities = lazy(() => import("sm-group-activity/App"));

// ----- Buyables -----
const Giftcard = lazy(() => import("sm-giftcard/App"));
const Order = lazy(() => import("sm-order/App"));
const Pack = lazy(() => import("sm-pack/App"));

// ----- Core-data -----
const MemberList = lazy(() => import("sm-member-list/App"));
const Teacher = lazy(() => import("sm-teacher/App"));

// ----- Financial Services -----
const Invoice = lazy(() => import("sm-invoice/App"));

// ----- Customer Data Platform -----
const EmailTemplate = lazy(() => import("sm-email-template/App"));
const Smartlists = lazy(() => import("sm-smartlists/App"));
const CustomForm = lazy(() => import("sm-custom-form/App"));
const ReferralProgram = lazy(() => import("sm-referral-program/App"));

// ----- Common -----
const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

const basename = __HOST__.__BASENAME__;

const loginUrl = import.meta.env.PROD
  ? `${window.location.origin}/login`
  : undefined;

export function Root() {
  const env = getEnv();

  const urls =
    env === "staging" || env === "production"
      ? REVAMP_URLS_PRODUCTION
      : REVAMP_URLS_DEVELOPMENT;

  const routes_configs: Array<{ url?: string; element: ReactNode }> = [
    /* ----- Booking ----- */
    { url: urls.activity, element: <GroupActivities /> },

    /* ----- Buyables ----- */
    { url: urls.giftcard, element: <Giftcard /> },
    { url: urls.order, element: <Order /> },
    { url: urls.pack, element: <Pack /> },

    /* ----- Core-data ----- */
    { url: urls.member, element: <MemberList /> },
    { url: urls.teacher, element: <Teacher /> },

    /* ----- Financial Services ----- */
    { url: urls.invoice, element: <Invoice /> },

    /* ----- Customer Data Platform ----- */
    { url: urls.customForm, element: <CustomForm /> },
    { url: urls.emailTemplate, element: <EmailTemplate /> },
    { url: urls.settings_referral, element: <ReferralProgram /> },
    { url: urls.smartlist, element: <Smartlists /> },
  ];

  return (
    <AppWrapper
      basename={basename}
      NavigationApp={NavigationSidebar}
      loginUrl={loginUrl}
    >
      <Routes>
        <Route path="/" element={<h1>Hello world</h1>} />

        {routes_configs
          .filter((config) => !!config.url)
          .map((config) => (
            <Route
              key={`route-${config.url}`}
              path={`${config.url}/*`}
              element={config.element}
            />
          ))}
      </Routes>
    </AppWrapper>
  );
}
