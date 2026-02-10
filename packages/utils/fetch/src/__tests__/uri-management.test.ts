import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LEGACY_API,
  MAP_ENV_TO_API_URL,
  getApiFeatureBranchUrl,
  getFullUri,
  getIsFrontendOnly,
  getLegacyUri,
  getLocalAPIBaseUrl,
  setLocalAPIEnv,
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
    delete window.__API_ENV__;
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

  describe("setLocalAPIEnv", () => {
    it("does nothing silently when frontend env is deployed", () => {
      mockedGetEnv.mockReturnValue("production");

      const warn = vi.spyOn(console, "warn");

      setLocalAPIEnv("dev");

      expect(warn).not.toHaveBeenCalled();
      expect(window.__API_ENV__).toBeUndefined();
    });

    it("warns when window is undefined", () => {
      mockedGetEnv.mockReturnValue("local");

      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const originalWindow = globalThis.window;
      // @ts-expect-error intentional
      delete globalThis.window;

      setLocalAPIEnv("dev");

      expect(warn).toHaveBeenCalledOnce();

      globalThis.window = originalWindow;
      warn.mockRestore();
    });

    it("warns when apiEnv is undefined", () => {
      mockedGetEnv.mockReturnValue("local");

      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      setLocalAPIEnv(undefined);

      expect(warn).toHaveBeenCalledOnce();
      expect(window.__API_ENV__).toBeUndefined();

      warn.mockRestore();
    });

    it("stores api env on window when valid", () => {
      mockedGetEnv.mockReturnValue("local");

      setLocalAPIEnv("alpha");

      expect(window.__API_ENV__).toBe("alpha");
    });
  });

  describe("getLocalAPIBaseUrl", () => {
    it("returns VITE_API_BASE_URL when window is undefined", () => {
      vi.stubEnv("VITE_API_BASE_URL", "https://api.custom.bsport.io");

      const originalWindow = globalThis.window;
      // @ts-expect-error intentional
      delete globalThis.window;

      const result = getLocalAPIBaseUrl();

      expect(result).toBe("https://api.custom.bsport.io");

      globalThis.window = originalWindow;
    });

    it("returns VITE_API_BASE_URL when window is defined with empty string", () => {
      vi.stubEnv("VITE_API_BASE_URL", "https://api.custom.bsport.io");
      window.__API_ENV__ = "";

      const result = getLocalAPIBaseUrl();

      expect(result).toBe("https://api.custom.bsport.io");
    });

    it("returns dev API when no runtime env and no VITE_API_BASE_URL", () => {
      vi.stubEnv("VITE_API_BASE_URL", undefined);

      const result = getLocalAPIBaseUrl();

      expect(result).toBe(MAP_ENV_TO_API_URL.dev);
    });

    it("returns deployed API url when runtime env is deployed", () => {
      window.__API_ENV__ = "staging";

      const result = getLocalAPIBaseUrl();

      expect(result).toBe(MAP_ENV_TO_API_URL.staging);
    });

    it("returns local API when runtime env is local", () => {
      window.__API_ENV__ = "local";

      const result = getLocalAPIBaseUrl();

      expect(result).toBe(MAP_ENV_TO_API_URL.local);
    });

    it("returns local API when runtime env is localhost", () => {
      window.__API_ENV__ = "localhost";

      const result = getLocalAPIBaseUrl();

      expect(result).toBe(MAP_ENV_TO_API_URL.local);
    });

    it("returns feature branch API url for non-deployed runtime env", () => {
      window.__API_ENV__ = "alpha";

      const result = getLocalAPIBaseUrl();

      expect(result).toBe(getApiFeatureBranchUrl("alpha"));
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

    it("uses runtime variable to build final API base url", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      window.__API_ENV__ = "staging";

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.staging}/users/v1/123`);
    });

    it("uses dev API when no value has been provided to VITE_API_BASE_URL", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      vi.stubEnv("VITE_API_BASE_URL", undefined);

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.dev}/users/v1/123`);
    });

    it("returns the same URI if it already complete", () => {
      const completeUri = "https://api.example.com/users/v1/123";
      const res = getFullUri(completeUri);
      expect(res).toBe(completeUri);
    });
  });
});
