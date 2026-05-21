declare global {
  type StudioManagerRuntime = {
    API_BASE_URL?: string;
    SENTRY_DSN?: string;
    UNLEASH_PROXY_URL?: string;
    UNLEASH_CLIENT_KEY?: string;
    UNLEASH_ENVIRONMENT?: string;
    MIXPANEL_TOKEN?: string;
    GOOGLE_MAPS_API_KEY?: string;
  };

  interface Window {
    __SM_RUNTIME__?: StudioManagerRuntime;
  }
}

export {};
