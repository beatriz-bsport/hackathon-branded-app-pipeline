import { type ReactNode, lazy, useEffect } from "react";
import { Route, Routes } from "react-router";
// Import urls from the navigation sidebar
import {
  REVAMP_URLS_DEVELOPMENT,
  REVAMP_URLS_PRODUCTION,
} from "sm-navigation-sidebar/urls";

import { getEnv } from "@bsport/envs";
import { Title } from "@bsport/kaizen-primitive-core";
import {
  BSPORT_REQUEST_FROM_HEADER_VALUES,
  setBsportRequestFrom,
} from "@bsport/request-from-header";
import { AppWrapper } from "@bsport/sm-backbone";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { analyticsClient, debugActive } from "#src/utils/analytics";

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
const Tag = lazy(() => import("sm-tag/App"));
const TransactionalNotification = lazy(
  () => import("sm-transactional-notification/App"),
);
const MarketingNotification = lazy(
  () => import("sm-marketing-notification/App"),
);

// ----- Analytics -----
const Insights = lazy(() => import("sm-insights/App"));

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
    {
      url: urls.settings_referral,
      element: <ReferralProgram />,
    },
    { url: urls.smartlist, element: <Smartlists /> },
    { url: urls.tag, element: <Tag /> },
    {
      url: urls.settings_transactionalNotification,
      element: <TransactionalNotification />,
    },
    {
      url: urls.marketingNotification,
      element: <MarketingNotification />,
    },

    /* ----- Analytics ----- */
    { url: urls.insights, element: <Insights /> },
  ];

  useEffect(() => {
    // Init analytics tool only once
    analyticsClient.configure({
      env: env === "production" ? "production" : "dev",
      debug: debugActive, // Mixpanel debug mode
      track_pageview: "url-with-path-and-query-string",
    });
  }, [env]);

  useEffect(() => {
    setBsportRequestFrom(BSPORT_REQUEST_FROM_HEADER_VALUES.backoffice);
  }, []);

  return (
    <AppWrapper
      basename={basename}
      NavigationApp={NavigationSidebar}
      navigationProps={{
        onLogoutCallback: () => {
          analyticsClient.resetIdentity();
          analyticsClient.overloadResetSuperProperties(); // Analytics tool level super properties
        },
      }}
      loginUrl={loginUrl}
    >
      <AuthenticatedRoutes routes={routes_configs} />
    </AppWrapper>
  );
}

const AuthenticatedRoutes = ({
  routes,
}: {
  routes: Array<{ url?: string; element: ReactNode }>;
}) => {
  const user = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();

  useEffect(() => {
    if (user?.id) {
      const { id, role: company_role, franchise_role, username } = user;
      analyticsClient.identify({
        userId: String(id),
        traits: {
          username,
          franchise_role,
          company_role,
          company_id: companyTheme?.company,
          franchise_id: companyTheme?.franchisor,
        },
      });
    }
  }, [user, companyTheme]);

  useEffect(() => {
    if (companyTheme) {
      analyticsClient.overloadAddSuperProperties({
        company_id: companyTheme?.company,
        company_name: companyTheme?.company_name,
        franchise_id: companyTheme?.franchisor,
        source_label: "web",
        is_logged_in: true,
      });
    }
  }, [companyTheme]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col justify-center h-screen items-center flex-1">
            <Title
              htmlVariant="h1"
              color="positive"
              weight="strong"
              className="animate-bounce"
            >
              Welcome to our revamped backoffice !
            </Title>
          </div>
        }
      />

      {routes
        .filter((config) => !!config.url)
        .map((config) => (
          <Route
            key={`route-${config.url}`}
            path={`${config.url}/*`}
            element={config.element}
          />
        ))}
    </Routes>
  );
};
