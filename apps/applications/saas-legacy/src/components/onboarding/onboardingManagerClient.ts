import Config from '#src/config';
import { OnboardingManagerClient } from '@bsport/onboarding-manager';

const SAAS_LEGACY_APP_NAME = 'saas-legacy';

export const debugActive =
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
  Config.REACT_APP_SENTRY_ENVIRONMENT === 'local';

export const onboardingManagerClient = new OnboardingManagerClient({
  internalDebug: debugActive,
  instanceName: SAAS_LEGACY_APP_NAME,
});

onboardingManagerClient.addSuperProperties({
  application: SAAS_LEGACY_APP_NAME,
});
