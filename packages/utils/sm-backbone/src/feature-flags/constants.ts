export const ENVS = {
  dev: "dev",
  local: "local",
  staging: "staging",
  production: "production",
  "feature-branch": "feature-branch",
} as const;

type Env = keyof typeof ENVS;

export type FeatureFlagConfig = { proxyUrl: string; clientKey: string };

export const FEATURE_FLAG_CONFIGS = {
  [ENVS.local]: {
    proxyUrl: "http://localhost:4242/api/frontend",
    clientKey: "default:development.unleash-insecure-frontend-api-token",
  },
  [ENVS.dev]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS.staging]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS["feature-branch"]]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:development.33c0b79cf07ad244a1d63da1126b2306bc47f3c56f8f01637119d864",
  },
  [ENVS.production]: {
    proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
    clientKey:
      "default:production.71464c7970fcbcc8392a28909f14b0eb221b9c21577f2c3ee611beb2",
  },
} as const satisfies Record<Env, FeatureFlagConfig>;
