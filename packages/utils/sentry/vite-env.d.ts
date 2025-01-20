/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ENV: string;
  readonly RELEASE_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
