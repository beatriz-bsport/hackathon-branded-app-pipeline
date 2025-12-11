import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LEGACY_API,
  MAP_ENV_TO_API_URL,
  getFullUri,
  getIsFrontendOnly,
  getLegacyUri,
} from "#src/uri-management";

// Mock env imports
vi.mock("@bsport/envs", () => ({
  getEnv: vi.fn(),
  isEnvFeatureBranch: vi.fn(),
}));

const { getEnv: mockedGetEnv, isEnvFeatureBranch: mockedIsEnvFeatureBranch } =
  vi.mocked(await import("@bsport/envs"));

describe("uri-management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe("getLegacyUri", () => {
    it("returns unchanged uri if starting with api-v0", () => {
      expect(getLegacyUri("api-v0/users")).toBe("api-v0/users");
    });

    it("returns unchanged uri if starting with api/v1", () => {
      expect(getLegacyUri("api/v1/users")).toBe("api/v1/users");
    });

    it("correctly maps /domain/v0/... → api-v0/...", () => {
      const uri = "local/v0/users/v1/123";
      expect(getLegacyUri(uri)).toBe(`${LEGACY_API.v0}/users/v1/123`);
    });

    it("correctly maps /domain/v1/... → api/v1/...", () => {
      const uri = "local/v1/payments/list";
      expect(getLegacyUri(uri)).toBe(`${LEGACY_API.v1}/payments/list`);
    });

    it("returns original uri and warns on unexpected structure", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const uri = "local/xxx/users";

      expect(getLegacyUri(uri)).toBe(uri);
      expect(warn).toHaveBeenCalledOnce();

      warn.mockRestore();
    });

    it("returns original uri if version missing", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const uri = "local/anything-else";

      expect(getLegacyUri(uri)).toBe(uri);
      expect(warn).toHaveBeenCalledOnce();

      warn.mockRestore();
    });
  });

  describe("getIsFrontendOnly", () => {
    it("should return a boolean", () => {
      const isFrontendOnly = getIsFrontendOnly();
      expect(isFrontendOnly).toBeDefined();
      expect(typeof isFrontendOnly).toBe("boolean");
    });

    it("should be false when import.meta.env.VITE_FRONTEND_ONLY is false", () => {
      vi.stubEnv("VITE_FRONTEND_ONLY", "false");
      expect(getIsFrontendOnly()).toBe(false);
    });

    it("should be true when import.meta.env.VITE_FRONTEND_ONLY is not false", () => {
      vi.stubEnv("VITE_FRONTEND_ONLY", "");
      expect(getIsFrontendOnly()).toBe(true);
    });
  });

  describe("getFullUri", () => {
    it("returns production URL when in production environment", () => {
      mockedGetEnv.mockReturnValue("production");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.production}/users/v1/123`);
    });

    it("returns staging URL when in staging environment", () => {
      mockedGetEnv.mockReturnValue("staging");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.staging}/users/v1/123`);
    });

    it("returns dev URL when in dev environment", () => {
      mockedGetEnv.mockReturnValue("dev");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.dev}/users/v1/123`);
    });

    it("returns dev fallback URL for feature branch frontend-only", () => {
      mockedGetEnv.mockReturnValue("alpha");
      mockedIsEnvFeatureBranch.mockReturnValue(true);
      vi.stubEnv("VITE_FRONTEND_ONLY", "true");

      const res = getFullUri("users/v1/123");

      // frontend-only → no legacy mapping, always dev base URL
      expect(res).toBe(`${MAP_ENV_TO_API_URL.dev}/users/v1/123`);
    });

    it("applies getLegacyUri when feature branch is NOT frontend-only", () => {
      mockedGetEnv.mockReturnValue("alpha");
      mockedIsEnvFeatureBranch.mockReturnValue(true);
      vi.stubEnv("VITE_FRONTEND_ONLY", "false");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`https://api-alpha.chaos.bsport.io/api/v1/123`);
    });

    it("applies legacy mapping when local API is a legacy API", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000");

      // Local env → API_BASE_URL includes "localhost" → triggers legacy → replace with api/v1
      const res = getFullUri("users/v1/123");

      expect(res).toBe(`http://localhost:8000/api/v1/123`);
    });

    it("uses specified variable to build final API base url", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      const mySpecialAPI = "https://api.omega.testing.bsport.io";
      vi.stubEnv("VITE_API_BASE_URL", mySpecialAPI);

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${mySpecialAPI}/users/v1/123`);
    });

    it("uses dev API when no value has been provided to VITE_API_BASE_URL", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      vi.stubEnv("VITE_API_BASE_URL", undefined);

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.dev}/users/v1/123`);
    });
  });
});
