// Reference: https://docs.appcues.com/install-appcues-web/installation-overview-for-developers
export interface AppcuesInterface {
  identify(
    userId: string,
    userProperties?: Record<string, string | number | boolean>,
  ): void;
  group(
    groupId: string,
    groupProperties?: Record<string, string | number | boolean>,
  ): void;
  page(): void;
  track(
    eventName: string,
    eventProperties?: Record<string, string | number | boolean>,
  ): void;
  reset(): void;
  anonymous(): void;
}

declare global {
  interface Window {
    Appcues: AppcuesInterface;
  }
}
declare global {
  interface Window {
    AppcuesSettings: AppcuesInterface;
  }
}

export type OnboardingUserConfig = {
  user_id: string;
  username: string;
  company_role: number;
  franchise_role?: number;
  company_id?: number;
  franchise_id?: number;
  environment: string;
  app: string;
};

export type OnboardingGroupConfig = {
  user_id: string;
  username: string;
  franchise_role: string;
  franchise_id: number;
  brand_name?: string;
  environment: string;
  app: string;
};

/**
 * Interface of an Analytics Adapter, which basically is a set of methods that
 * allow to use tool-specific methods within the generic Analytics Client
 */
export type OnboardingManagerAdapter = {
  /**
   * Load required script for the onboarding manager to be embedded on the page.
   */
  loadScript: () => void;

  /**
   * Initialize the User on the onboarding service with provided configuration
   * @param config Parameters to provide to the adapter
   */
  initUser: (config: OnboardingUserConfig) => void;

  /**
   * Initialize a Group for an already initialized user with provided configuration
   * @param config Parameters to provide to the adapter
   */
  initGroup: (config: OnboardingGroupConfig) => void;

  /**
   * Track the navigation from a page to an other for a user
   */
  navigate: () => void;

  /**
   * Allow to send custom set of events to the onboarding tool, for now no limitations are set
   * @param eventName Name of the event triggered, prefer snake_case notation when providing one
   * @param eventProperties set of properties that can be used by the event, prefer snake_case and do not transform primitives type,
   * also we encourage to always flatten any objects yourself if you need to
   */
  trackEvent(
    eventName: string,
    eventProperties?: Record<string, string | number | boolean>,
  ): void;

  /**
   * Reset the current state of the data tracked by the onboarding manager, use this with caution because it can cause onboarding flows to trigger twice if used badly
   */
  resetData: () => void;

  /**
   * Log out the currently initialized user from the onboarding tool to tell when its the end of a session.
   */
  logOutUser: () => void;
};

export type Properties = Record<string, string | number | boolean>;
