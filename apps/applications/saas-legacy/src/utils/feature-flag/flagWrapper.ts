import { useFlag as useUnleashFlag } from '@unleash/proxy-client-react';
import { captureException as sentryCaptureException } from '@sentry/react';

import { FlagName } from './flags';

/**
 * Safe wrapper around useFlag that handles errors gracefully
 * Returns false if Unleash is not available or flag lookup fails
 */
export const useSafeFlag = (flagName: FlagName): boolean => {
  try {
    return useUnleashFlag(flagName);
  } catch (error) {
    sentryCaptureException(error, {
      extra: {
        message: 'Feature flag lookup failed, returning false as fallback',
        component: 'useSafeFlag',
        flagName: flagName,
      },
    });
    return false;
  }
};
