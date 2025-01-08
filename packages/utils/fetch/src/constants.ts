import type { ValueOf } from "type-fest";

export type Env = ValueOf<typeof ENVS>;

export const ENVS = {
  DEV: "dev",
  LOCAL: "local",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

export const ENV: Env = import.meta.env.VITE_ENV;

export const ENV_DSN = import.meta.env.VITE_SENTRY_DSN;

export const RELEASE_SHA = import.meta.env.RELEASE_SHA;
