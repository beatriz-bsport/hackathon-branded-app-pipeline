import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from '@bsport/analytics';
import { captureException } from '@sentry/react';

import Config from '#src/config';

const ACTIVATE_DEBUG = process.env.NODE_ENV !== 'production';
const IS_PRODUCTION = Config.REACT_APP_SENTRY_ENVIRONMENT === 'production';

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
 * The logic is wrapped inside a try/catch to avoid crashing the flow if it fails
 * to initialize, as it's done high level in the DOM.
 */
export const configureAnalyticsB2BInstance = () => {
  try {
    // The package uses Mixpanel B2B projects tokens by default, based on the env input
    // We don't need to provide them
    analyticsClientB2B.configure({
      debug: ACTIVATE_DEBUG,
      env: IS_PRODUCTION ? 'production' : 'dev',
      autocapture: false,
      track_pageview: 'url-with-path-and-query-string',
    });
  } catch (error) {
    console.error(error);
    captureException(error);
  }
};

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
 * The logic is wrapped inside a try/catch to avoid crashing the flow if it fails
 * to initialize, as it's done high level in the DOM.
 */
export const configureAnalyticsB2CInstance = () => {
  try {
    analyticsClientB2C.configure({
      debug: ACTIVATE_DEBUG,
      env: IS_PRODUCTION ? 'production' : 'dev',
      token: Config.REACT_APP_MIXPANEL_TOKEN,
      autocapture: false,
      track_pageview: 'url-with-path-and-query-string',
    });
  } catch (error) {
    console.error(error);
    captureException(error);
  }
};
