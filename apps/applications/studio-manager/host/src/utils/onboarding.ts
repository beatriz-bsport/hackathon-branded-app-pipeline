import { OnboardingManagerClient } from "@bsport/onboarding-manager";

const SM_HOST_APP_NAME = "sm-host";

export const debugActive = import.meta.env.DEV;
export const onboardingManagerClient = new OnboardingManagerClient({
  internalDebug: debugActive,
  instanceName: SM_HOST_APP_NAME,
});

onboardingManagerClient.addSuperProperties({
  application: __HOST__.__I18N_NAMESPACE_PREFIX__,
});
