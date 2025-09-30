import {
  AnalyticsClient,
  MeiroAdapter,
  type MeiroConfig,
  type AnalyticsConfig,
} from '@bsport/analytics';
import { captureException } from '@sentry/react';

import Config from '#src/config';

const ACTIVATE_DEBUG = process.env.NODE_ENV !== 'production';
const IS_STAGING = Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging';

type MeiroAnalyticsConfig = Partial<AnalyticsConfig<MeiroConfig>>;

export const meiroAnalyticsClient = new AnalyticsClient<MeiroAnalyticsConfig>({
  internalDebug: ACTIVATE_DEBUG,
  instanceName: 'meiro-b2c',
  adapter: new MeiroAdapter(),
});

/**
 * Wraps Meiro operations with environment checks and error handling
 * @param operation The operation to execute
 * @param options Optional configuration
 * @param options.errorContext Context message for error logging
 */
const withMeiroTracking = <T>(
  operation: () => T,
  options?: { errorContext?: string },
): T | undefined => {
  if (!IS_STAGING) {
    return;
  }

  try {
    return operation();
  } catch (error) {
    const message = options?.errorContext
      ? `[Meiro] ${options.errorContext}:`
      : '[Meiro] Operation failed:';
    console.error(message, error);
    captureException(error);
  }
};

const configure = async () =>
  withMeiroTracking(
    () => {
      meiroAnalyticsClient.configure({
        env: 'dev',
        sync: {
          ga_cid: true,
          fb_cid: true,
        },
        outbound_link_tracking: {
          enabled: true,
        },
      });
    },
    { errorContext: 'Failed to configure' },
  );

/**
 * Activate tracking
 * @param props Optional context properties to set as super properties
 */
export const optIn = async (props?: {
  companyId?: number;
  franchisorId?: number;
  userId?: string;
}) =>
  withMeiroTracking(
    async () => {
      await configure();

      meiroAnalyticsClient.optInTracking();

      // Set super properties if context is provided
      if (props) {
        const { companyId, franchisorId, userId } = props;
        meiroAnalyticsClient.overloadAddSuperProperties({
          company_id: companyId,
          franchise_id: franchisorId,
          user_id: userId,
          source_label: 'web',
        });
      }
    },
    { errorContext: 'Failed to opt in tracking' },
  );

/**
 * Deactivate tracking and reset super properties
 */
export const optOut = () =>
  withMeiroTracking(
    () => {
      meiroAnalyticsClient.optOutTracking();
      meiroAnalyticsClient.overloadResetSuperProperties();
    },
    { errorContext: 'Failed to opt out tracking' },
  );

/**
 * Reset analytics instance (identity and super properties)
 * Used on logout from the member area
 */
export const reset = () =>
  withMeiroTracking(
    () => {
      meiroAnalyticsClient.resetIdentity();
      optOut();
    },
    { errorContext: 'Failed to reset' },
  );

/**
 * Track an event
 * @param eventName The name of the event to track
 * @param payload Optional event properties
 */
export const track = (eventName: string, payload?: Record<string, any>) =>
  withMeiroTracking(
    () => {
      if (!meiroAnalyticsClient.getIsTracking()) {
        return;
      }

      meiroAnalyticsClient.track({
        eventType: 'custom_event',
        custom_event: eventName,
        ...payload,
      });
    },
    { errorContext: `Failed to track event "${eventName}"` },
  );
