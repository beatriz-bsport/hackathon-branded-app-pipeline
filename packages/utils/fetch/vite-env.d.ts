/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ENV: "dev" | "local" | "staging" | "production";
  // Add other env variables as needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
