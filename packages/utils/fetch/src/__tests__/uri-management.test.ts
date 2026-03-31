import { beforeEach, describe, expect, it, vi } from "vitest";

import { getFullUri, getRuntimeAPIBaseUrl } from "#src/uri-management";

describe("uri-management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.runtime;
    delete window.runtimeBsport;
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
    it("uses the explicit runtime API base url", () => {
      window.runtime = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime.bsport.io",
        },
      };

      const res = getFullUri("users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

    it("prefers the runtime override over env.js", () => {
      window.runtime = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime.bsport.io",
        },
      };
      window.runtimeBsport = {
        env: {
          VITE_API_BASE_URL: "https://api.override.bsport.io",
        },
      };

      const res = getFullUri("users/v1/123");

      expect(res).toBe("https://api.override.bsport.io/users/v1/123");
    });

    it("normalizes a leading slash without changing the declared path", () => {
      window.runtime = {
        env: {
          VITE_API_BASE_URL: "https://api.runtime.bsport.io",
        },
      };

      const res = getFullUri("/users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

    it("returns the same URI if it is already complete", () => {
      const completeUri = "https://api.example.com/users/v1/123";
      expect(getFullUri(completeUri)).toBe(completeUri);
    });

    it("throws when no runtime API base url is configured", () => {
      expect(() => getFullUri("users/v1/123")).toThrow(
        "Missing runtime API base URL",
      );
    });
  });
});
