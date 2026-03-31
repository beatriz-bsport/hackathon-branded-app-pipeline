import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  MAP_ENV_TO_API_URL,
  getApiFeatureBranchUrl,
  getFullUri,
  getIsFrontendOnly,
  getLocalAPIBaseUrl,
  getRuntimeAPIBaseUrl,
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
    delete window.runtime;
    delete window.runtimeBsport;
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

  describe("getRuntimeAPIBaseUrl", () => {
    it("returns undefined when runtime env is missing", () => {
      expect(getRuntimeAPIBaseUrl()).toBeUndefined();
    });

    it("reads the explicit runtime API base url from window.runtime", () => {
      window.runtime = {
        env: {
          VITE_API_BASE_URL: " https://api.runtime.bsport.io ",
        },
      };

      expect(getRuntimeAPIBaseUrl()).toBe("https://api.runtime.bsport.io");
    });

    it("reads the explicit runtime API base url from window.runtimeBsport first", () => {
      window.runtime = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime.bsport.io",
        },
      };
      window.runtimeBsport = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime-bsport.bsport.io",
        },
      };

      expect(getRuntimeAPIBaseUrl()).toBe(
        "https://api.runtime-bsport.bsport.io",
      );
    });
  });

  describe("getFullUri", () => {
    it("uses the explicit runtime API base url before inferred environment", () => {
      mockedGetEnv.mockReturnValue("production");
      window.runtime = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime.bsport.io",
        },
      };

      const res = getFullUri("users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

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

    it("keeps the declared path when feature branch is NOT frontend-only", () => {
      mockedGetEnv.mockReturnValue("alpha");
      mockedIsEnvFeatureBranch.mockReturnValue(true);
      vi.stubEnv("VITE_FRONTEND_ONLY", "false");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`https://api-alpha.chaos.bsport.io/users/v1/123`);
    });

    it("keeps service-style mapping when local API is localhost by default", () => {
      mockedGetEnv.mockReturnValue("local");
      mockedIsEnvFeatureBranch.mockReturnValue(false);
      vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000");

      const res = getFullUri("users/v1/123");

      expect(res).toBe(`http://localhost:8000/users/v1/123`);
    });

    it("normalizes a leading slash without changing the declared path", () => {
      mockedGetEnv.mockReturnValue("production");

      const res = getFullUri("/users/v1/123");

      expect(res).toBe(`${MAP_ENV_TO_API_URL.production}/users/v1/123`);
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
