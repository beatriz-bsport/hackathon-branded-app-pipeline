import { type ReactNode, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
// Import urls from the navigation sidebar
import {
  REVAMP_URLS_DEVELOPMENT,
  REVAMP_URLS_PRODUCTION,
} from "sm-navigation-sidebar/urls";

import { getEnv } from "@bsport/envs";
import { initIntercomWidget, shutdownIntercom } from "@bsport/intercom";
import { Loader } from "@bsport/kaizen-primitive-core";
import {
  BSPORT_REQUEST_FROM_HEADER_VALUES,
  setBsportRequestFrom,
} from "@bsport/request-from-header";
import { AppWrapper, captureException } from "@bsport/sm-backbone";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AppcuesTag } from "#src/components/onboarding/AppcuesTag";
import { analyticsClient, debugActive } from "#src/utils/analytics";
import { NavFlags, useNavFlag } from "#src/utils/featureFlags";

import { removeAppcuesScripts } from "./components/onboarding/appcues-scripts";

// ----- Booking -----
const GroupActivities = lazy(() => import("sm-group-activity/App"));
const Session = lazy(() => import("sm-session/App"));

// ----- Buyables -----
const Giftcard = lazy(() => import("sm-giftcard/App"));
const Order = lazy(() => import("@bsport/sm-order"));
const Pack = lazy(() => import("sm-pack/App"));

// ----- Core-data -----
const MemberList = lazy(() => import("sm-member-list/App"));
const Teacher = lazy(() => import("@bsport/sm-teacher"));

// ----- Financial Services -----
const Invoice = lazy(() => import("@bsport/sm-invoice"));

// ----- Customer Data Platform -----
const EmailTemplate = lazy(() => import("@bsport/sm-email-template"));
const Smartlists = lazy(() => import("@bsport/sm-smartlists"));
const CustomForm = lazy(() => import("@bsport/sm-custom-form"));
const ReferralProgram = lazy(() => import("@bsport/sm-referral-program"));
const Tag = lazy(() => import("sm-tag/App"));
const TransactionalNotification = lazy(
  () => import("sm-transactional-notification/App"),
);
const MarketingNotification = lazy(
  () => import("@bsport/sm-marketing-notification"),
);

// ----- Business Insights -----
const Insights = lazy(() => import("sm-insights/App"));
const Homepage = lazy(() => import("sm-homepage/App"));

// ----- Common -----
const NavigationSidebar = lazy(
  () => import("sm-navigation-sidebar/NavigationSidebar"),
);

const basename = __HOST__.__BASENAME__;
const env = getEnv();

const loginUrl = import.meta.env.PROD
  ? `${window.location.origin}/login`
  : undefined;

type RouteConfig = {
  url?: string;
  element: ReactNode;
  hidden?: boolean;
};

export function Root() {
  useEffect(() => {
    // Init analytics tool only once
    analyticsClient.configure({
      env: env === "production" ? "production" : "dev",
      debug: debugActive, // Mixpanel debug mode
      track_pageview: "url-with-path-and-query-string",
    });
  }, []);

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
          removeAppcuesScripts();
        },
      }}
      loginUrl={loginUrl}
    >
      <AuthenticatedLayout />
    </AppWrapper>
  );
}

function AuthenticatedLayout() {
  const user = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const toggleAppcues = useNavFlag(NavFlags.TOGGLE_APPCUES);

  return (
    <>
      {toggleAppcues && (
        <AppcuesTag
          companyId={companyTheme?.company}
          companyRole={user?.role}
          email={user?.username}
          franchiseId={companyTheme?.franchisor}
          franchiseRole={user?.franchise_role}
          userId={user?.id}
          username={user?.name ?? user?.username}
        />
      )}
      <AuthenticatedRoutes />
    </>
  );
}

const AuthenticatedRoutes = () => {
  const user = dataAccessLayer.useUserAccess();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const permissions = dataAccessLayer.useUserRole();
  const env = getEnv();
  const isProductionEnvironment = ["production", "staging"].includes(env);

  useEffect(() => {
    window.addEventListener("beforeunload", shutdownIntercom);
    return () => {
      shutdownIntercom();
      window.removeEventListener("beforeunload", shutdownIntercom);
    };
  }, []);

  useEffect(() => {
    if (companyTheme?.hide_intercom || !isProductionEnvironment) {
      console.log(
        "Intercom has not been initialized as we are not on production environment",
      );
      return;
    }
    if (user?.name && companyTheme?.company && permissions?.name) {
      const companyId = companyTheme?.company;
      const userName = user?.name;
      const companyName = companyTheme.company_name;
      const email = user?.username;
      const userRole = permissions?.name;
      const companyLocale = companyTheme.locale;
      const colorOverride = companyTheme.primary_color;

      initIntercomWidget({
        name: userName,
        email: email,
        environment: env,
        role: userRole,
        companyId: companyId,
        companyName: companyName,
        companyLocale,
        actionColor: colorOverride,
        onEmailValidationFailure: (error, context) => {
          captureException(error, { extra: context });
        },
      });
    }
  }, [user?.name, permissions?.name, companyTheme?.company]);

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
  }, [user, companyTheme, env]);

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

  const urls =
    env === "staging" || env === "production"
      ? REVAMP_URLS_PRODUCTION
      : REVAMP_URLS_DEVELOPMENT;

  const isHomepageEnabled = useNavFlag(NavFlags.HOMEPAGE);
  const isPacksPageEnabled = useNavFlag(NavFlags.PACKS);

  /**
   * Add configs to the Host Router.
   * If hidden is set to true, it will render the Route but with a null component,
   * in order to have the route still defined while feature flags are loading.
   */
  const routesConfigs: RouteConfig[] = [
    /* ----- Booking ----- */
    { url: urls.activity, element: <GroupActivities /> },
    { url: urls.calendar, element: <Session /> },

    /* ----- Buyables ----- */
    { url: urls.giftcard, element: <Giftcard /> },
    { url: urls.order, element: <Order /> },
    { url: urls.pack, element: <Pack />, hidden: !isPacksPageEnabled },

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

    /* ----- Business Insights ----- */
    { url: urls.insights, element: <Insights /> },
    {
      url: urls.homepage,
      element: <Homepage />,
      hidden: !isHomepageEnabled,
    },
  ];

  return (
    <Routes>
      {!isHomepageEnabled && (
        <Route
          path="/"
          element={
            <div className="flex flex-col justify-center h-screen items-center flex-1">
              <Loader size="xl" />
            </div>
          }
        />
      )}

      {routesConfigs
        .filter((config) => !!config.url)
        .map((config) => (
          <Route
            key={`route-${config.url}`}
            path={`${config.url}/*`}
            element={config.hidden ? null : config.element}
          />
        ))}

      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  );
};
