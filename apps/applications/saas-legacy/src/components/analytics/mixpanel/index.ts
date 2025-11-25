import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from '@bsport/analytics';
import { captureException } from '@sentry/react';

import Config from '#src/config';
import { onboardingManagerClient } from '#src/components/onboarding/onboardingManagerClient';

const ACTIVATE_DEBUG = process.env.NODE_ENV !== 'production';
const IS_PRODUCTION = Config.REACT_APP_SENTRY_ENVIRONMENT === 'production';

// ==================== B2B ====================

export const analyticsClientB2B: AnalyticsClientInterface = new AnalyticsClient(
  {
    internalDebug: ACTIVATE_DEBUG,
    instanceName: 'mixpanel-b2b',
  },
);

/**
 * Initialize the Mixpanel instance for the B2B projects, with:
 * - debug on development
 * - "B2B" project token on production, else "B2B Dev" project token
 * - pageview tracking enabled (while general autocapture is disabled)
 * We opt out tracking by default as it should be activated when going on the right router.
 * The logic is wrapped inside a try/catch to avoid crashing the flow if it fails
 * to initialize, as it's done high level in the DOM.
 */
const configureAnalyticsB2B = () => {
  try {
    // The package uses Mixpanel B2B projects tokens by default, based on the env input
    // We don't need to provide them
    analyticsClientB2B.configure({
      debug: ACTIVATE_DEBUG,
      env: IS_PRODUCTION ? 'production' : 'dev',
      autocapture: false,
      track_pageview: 'url-with-path-and-query-string',
      opt_out_tracking_by_default: true,
    });
  } catch (error) {
    console.error(error);
    captureException(error);
  }
};

configureAnalyticsB2B();

export const identifyAnalyticsB2BUser = (userId: number) => {
  analyticsClientB2B.identify({
    userId: String(userId),
  });
};

export const identifyAnalyticsB2BWithTheme = ({
  companyName,
  companyId,
  franchisorId,
}: {
  companyName?: string;
  companyId?: number;
  franchisorId?: number | null;
}) => {
  analyticsClientB2B.overloadAddSuperProperties({
    company_id: companyId,
    company_name: companyName,
    franchise_id: franchisorId,
    source_label: 'web',
    is_logged_in: true,
    application: 'saas-legacy',
  });
  analyticsClientB2B.identify({
    traits: {
      company_id: companyId,
      franchise_id: franchisorId,
    },
  });
};

export const identifyAnalyticsB2BWithAccessLevel = ({
  username,
  franchiseRole,
  companyRole,
}: {
  username: string;
  franchiseRole: number;
  companyRole: number;
}) => {
  analyticsClientB2B.identify({
    traits: {
      username,
      franchise_role: franchiseRole,
      company_role: companyRole,
    },
  });
};

/**
 * Activate B2B Tracking
 */
export const optInTrackingAnalyticsB2B = () => {
  analyticsClientB2B.optInTracking();
};

/**
 * Deactivate B2B Tracking
 */
export const optOutTrackingAnalyticsB2B = () => {
  analyticsClientB2B.optOutTracking();
};

export const resetAnalyticsB2B = () => {
  analyticsClientB2B.resetIdentity();
  analyticsClientB2B.overloadResetSuperProperties();
  optOutTrackingAnalyticsB2B();
  onboardingManagerClient.logOutUser();
};

// ==================== B2C ====================

export const analyticsClientB2C: AnalyticsClientInterface = new AnalyticsClient(
  {
    internalDebug: ACTIVATE_DEBUG,
    instanceName: 'mixpanel-b2c',
  },
);

/**
 * Initialize the Mixpanel instance for the B2C projects, with:
 * - debug on development
 * - "B2C" project token on production, else "B2C Dev" project token
 * - pageview tracking enabled (while general autocapture is disabled)
 * We opt out tracking by default as it should be activated when going on the right router.
 * The logic is wrapped inside a try/catch to avoid crashing the flow if it fails
 * to initialize, as it's done high level in the DOM.
 */
const configureAnalyticsB2C = () => {
  try {
    analyticsClientB2C.configure({
      debug: ACTIVATE_DEBUG,
      env: IS_PRODUCTION ? 'production' : 'dev',
      token: Config.REACT_APP_MIXPANEL_TOKEN,
      autocapture: false,
      track_pageview: 'url-with-path-and-query-string',
      opt_out_tracking_by_default: true,
    });
  } catch (error) {
    console.error(error);
    captureException(error);
  }
};

configureAnalyticsB2C();

/**
 * Activate B2C Tracking
 */
export const optInTrackingAnalyticsB2C = () => {
  analyticsClientB2C.optInTracking();
};

/**
 * Deactivate B2C Tracking
 */
export const optOutTrackingAnalyticsB2C = () => {
  analyticsClientB2C.optOutTracking();
};

export const identifyAnalyticsB2CWithMembership = ({
  userId,
  memberId,
  username,
  companyId,
  companyName,
  franchisorId,
}: {
  userId: string;
  memberId: number;
  username: string;
  companyId?: number;
  companyName?: string;
  franchisorId?: number | null;
}) => {
  // For companies in franchise, use ${user_id}_${franchisorId}
  // https://www.notion.so/bright-shovelx-41b/User-identification-24f137e4c64080be8591e19a9784af7d?source=copy_link#253137e4c640805e998dfadc76e778ff
  const uniqueMemberId = franchisorId
    ? `${userId}_${franchisorId}`
    : String(memberId);

  analyticsClientB2C.overloadAddSuperProperties({
    member_id: memberId,
    company_id: companyId,
    company_name: companyName,
    franchise_id: franchisorId,
    source_label: 'web',
    is_logged_in: true,
    application: 'saas-legacy',
  });

  analyticsClientB2C.identify({
    userId: uniqueMemberId,
    traits: {
      username,
      member_id: memberId,
      company_id: companyId,
      franchise_id: franchisorId,
    },
  });
};

/**
 * Reset B2C Analytics instance (identity and super properties)
 * Used on logout from the member area
 */
export const resetAnalyticsB2C = () => {
  analyticsClientB2C.resetIdentity();
  analyticsClientB2C.overloadResetSuperProperties();
  analyticsClientB2C.resetSuperProperties();
  optOutTrackingAnalyticsB2C();
};
