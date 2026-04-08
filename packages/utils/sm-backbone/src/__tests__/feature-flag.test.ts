import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildUnleashConfig,
  getFeatureFlagConfig,
} from "#src/feature-flags/get-configs";

const setRuntimeConfig = (
  config:
    | {
        UNLEASH_PROXY_URL?: string;
        UNLEASH_CLIENT_KEY?: string;
        UNLEASH_ENVIRONMENT?: string;
      }
    | undefined,
) => {
  if (!config) {
    delete (
      window as Window & {
        __SM_RUNTIME__?: {
          UNLEASH_PROXY_URL?: string;
          UNLEASH_CLIENT_KEY?: string;
          UNLEASH_ENVIRONMENT?: string;
        };
      }
    ).__SM_RUNTIME__;
    return;
  }

  (
    window as Window & {
      __SM_RUNTIME__?: {
        UNLEASH_PROXY_URL?: string;
        UNLEASH_CLIENT_KEY?: string;
        UNLEASH_ENVIRONMENT?: string;
      };
    }
  ).__SM_RUNTIME__ = config;
};

describe("feature-flags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setRuntimeConfig(undefined);
  });

  describe("getFeatureFlagConfig", () => {
    it("returns undefined when runtime config is missing", () => {
      const result = getFeatureFlagConfig();
      expect(result).toBeUndefined();
    });

    it("returns undefined and warns when runtime config is partial", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      setRuntimeConfig({
        UNLEASH_PROXY_URL: "https://unleash.tooling.bsport.io/api/frontend",
      });

      const result = getFeatureFlagConfig();

      expect(result).toBeUndefined();
      expect(warnSpy).toHaveBeenCalled();
    });

    it("returns runtime values with default environment", () => {
      setRuntimeConfig({
        UNLEASH_PROXY_URL: "https://unleash.tooling.bsport.io/api/frontend",
        UNLEASH_CLIENT_KEY: "default:development.abc",
      });

      const result = getFeatureFlagConfig();

      expect(result).toEqual({
        proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
        clientKey: "default:development.abc",
        environment: "default",
      });
    });

    it("returns runtime values with explicit environment", () => {
      setRuntimeConfig({
        UNLEASH_PROXY_URL: "https://unleash.tooling.bsport.io/api/frontend",
        UNLEASH_CLIENT_KEY: "default:production.xyz",
        UNLEASH_ENVIRONMENT: "production",
      });

      const result = getFeatureFlagConfig();

      expect(result).toEqual({
        proxyUrl: "https://unleash.tooling.bsport.io/api/frontend",
        clientKey: "default:production.xyz",
        environment: "production",
      });
    });
  });

  describe("buildUnleashConfig", () => {
    it("returns undefined when runtime config is missing", () => {
      const result = buildUnleashConfig();
      expect(result).toBeUndefined();
    });

    it("builds unleash config from runtime values", () => {
      setRuntimeConfig({
        UNLEASH_PROXY_URL: "https://unleash.tooling.bsport.io/api/frontend",
        UNLEASH_CLIENT_KEY: "default:development.abc",
        UNLEASH_ENVIRONMENT: "staging",
      });

      const result = buildUnleashConfig();

      expect(result).toEqual({
        url: "https://unleash.tooling.bsport.io/api/frontend",
        clientKey: "default:development.abc",
        appName: "studio-manager",
        environment: "staging",
        refreshInterval: 0,
        metricsInterval: 240,
        customHeaders: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
    });
  });
});
