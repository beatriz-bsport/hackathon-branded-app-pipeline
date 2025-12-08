import { beforeEach, describe, expect, it, vi } from "vitest";

import { FEATURE_FLAG_CONFIGS } from "#src/feature-flags/constants";
import {
  buildUnleashConfig,
  getFeatureFlagConfig,
} from "#src/feature-flags/get-configs";

// Mock env imports
vi.mock("@bsport/envs", () => ({
  getEnv: vi.fn(),
  isEnvFeatureBranch: vi.fn(),
}));

const { getEnv: mockedGetEnv, isEnvFeatureBranch: mockedIsEnvFeatureBranch } =
  vi.mocked(await import("@bsport/envs"));

describe("feature-flags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  // ------------------------------------------------------------
  // getFeatureFlagConfig
  // ------------------------------------------------------------
  describe("getFeatureFlagConfig", () => {
    it("returns feature-branch config when isEnvFeatureBranch() is true", () => {
      mockedIsEnvFeatureBranch.mockReturnValue(true);

      const result = getFeatureFlagConfig("alpha");

      expect(result).toEqual(FEATURE_FLAG_CONFIGS["feature-branch"]);
    });

    it("returns dev config for local env if no override env vars are provided", () => {
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      vi.stubEnv("VITE_UNLEASH_PROXY_URL", "");
      vi.stubEnv("VITE_UNLEASH_CLIENT_KEY", "");

      const result = getFeatureFlagConfig("local");

      expect(result).toEqual(FEATURE_FLAG_CONFIGS.dev);
    });

    it("returns overridden values for local env when both VITE vars are set", () => {
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      const proxyOverride = "http://custom-proxy";
      const keyOverride = "custom-key";

      vi.stubEnv("VITE_UNLEASH_PROXY_URL", proxyOverride);
      vi.stubEnv("VITE_UNLEASH_CLIENT_KEY", keyOverride);

      const result = getFeatureFlagConfig("local");

      expect(result).toEqual({
        proxyUrl: proxyOverride,
        clientKey: keyOverride,
      });
    });

    it("returns dev config for unknown environments", () => {
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      const result = getFeatureFlagConfig("weird-env");

      expect(result).toEqual(FEATURE_FLAG_CONFIGS.dev);
    });

    it("returns correct config for dev, staging, and production", () => {
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      expect(getFeatureFlagConfig("dev")).toEqual(FEATURE_FLAG_CONFIGS.dev);
      expect(getFeatureFlagConfig("staging")).toEqual(
        FEATURE_FLAG_CONFIGS.staging,
      );
      expect(getFeatureFlagConfig("production")).toEqual(
        FEATURE_FLAG_CONFIGS.production,
      );
    });
  });

  // ------------------------------------------------------------
  // buildUnleashConfig
  // ------------------------------------------------------------
  describe("buildUnleashConfig", () => {
    it("returns correct values for dev environment", () => {
      mockedGetEnv.mockReturnValue("dev");
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      const result = buildUnleashConfig();

      const expected = {
        url: FEATURE_FLAG_CONFIGS.dev.proxyUrl,
        clientKey: FEATURE_FLAG_CONFIGS.dev.clientKey,
        appName: "studio-manager",
        environment: "dev",
        refreshInterval: 0,
        metricsInterval: 240,
        customHeaders: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      };

      expect(result).toEqual(expected);
    });

    it("returns feature-branch configs when environment is a feature branch", () => {
      mockedGetEnv.mockReturnValue("alpha");
      mockedIsEnvFeatureBranch.mockReturnValue(true);

      const result = buildUnleashConfig();

      expect(result.url).toBe(FEATURE_FLAG_CONFIGS["feature-branch"].proxyUrl);
      expect(result.clientKey).toBe(
        FEATURE_FLAG_CONFIGS["feature-branch"].clientKey,
      );
      expect(result.environment).toBe("feature-branch"); // important
    });

    it("returns overridden local keys when provided", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      const proxyOverride = "http://custom-proxy";
      const keyOverride = "custom-key";
      vi.stubEnv("VITE_UNLEASH_PROXY_URL", proxyOverride);
      vi.stubEnv("VITE_UNLEASH_CLIENT_KEY", keyOverride);

      const result = buildUnleashConfig();

      expect(result.url).toBe(proxyOverride);
      expect(result.clientKey).toBe(keyOverride);
      expect(result.environment).toBe("local");
    });

    it("falls back to dev config in local env without overrides", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      vi.stubEnv("VITE_UNLEASH_PROXY_URL", "");
      vi.stubEnv("VITE_UNLEASH_CLIENT_KEY", "");

      const result = buildUnleashConfig();

      expect(result.url).toBe(FEATURE_FLAG_CONFIGS.dev.proxyUrl);
      expect(result.clientKey).toBe(FEATURE_FLAG_CONFIGS.dev.clientKey);
      expect(result.environment).toBe("local");
    });

    it("uses dev config for invalid environments", () => {
      mockedGetEnv.mockReturnValue("something-weird");
      mockedIsEnvFeatureBranch.mockReturnValue(false);

      const result = buildUnleashConfig();

      expect(result.url).toBe(FEATURE_FLAG_CONFIGS.dev.proxyUrl);
      expect(result.clientKey).toBe(FEATURE_FLAG_CONFIGS.dev.clientKey);
      expect(result.environment).toBe("something-weird");
    });
  });
});
