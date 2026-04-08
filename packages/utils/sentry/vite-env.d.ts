/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_RELEASE_SHA: string;
  readonly VITE_SENTRY_SEND_ERRORS_IN_LOCAL_DEVELOPMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __BSPORT_RELEASE_SHA__?: string;
  __SM_RUNTIME__?: {
    SENTRY_DSN?: string;
  };
}
