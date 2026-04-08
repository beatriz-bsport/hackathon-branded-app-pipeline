import { beforeEach, describe, expect, it, vi } from "vitest";

import { getFullUri, getRuntimeAPIBaseUrl } from "#src/uri-management";

describe("uri-management", () => {
  const defaultApiBaseUrl = "https://api.production.bsport.io";

  beforeEach(() => {
    vi.clearAllMocks();
    delete window.__SM_RUNTIME__;
  });

  describe("getRuntimeAPIBaseUrl", () => {
    it("defaults to production when runtime env is missing", () => {
      expect(getRuntimeAPIBaseUrl()).toBe(defaultApiBaseUrl);
    });

    it("reads the explicit runtime API base url from window.__SM_RUNTIME__", () => {
      window.__SM_RUNTIME__ = {
        API_BASE_URL: " https://api.runtime.bsport.io ",
      };

      expect(getRuntimeAPIBaseUrl()).toBe("https://api.runtime.bsport.io");
    });

    it("defaults to production when the runtime API base url is empty", () => {
      window.__SM_RUNTIME__ = {
        API_BASE_URL: "   ",
      };

      expect(getRuntimeAPIBaseUrl()).toBe(defaultApiBaseUrl);
    });
  });

  describe("getFullUri", () => {
    it("uses the explicit runtime API base url", () => {
      window.__SM_RUNTIME__ = {
        API_BASE_URL: "https://api.runtime.bsport.io",
      };

      const res = getFullUri("users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

    it("normalizes a leading slash without changing the declared path", () => {
      window.__SM_RUNTIME__ = {
        API_BASE_URL: "https://api.runtime.bsport.io",
      };

      const res = getFullUri("/users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

    it("normalizes trailing slashes from the runtime API base url", () => {
      window.__SM_RUNTIME__ = {
        API_BASE_URL: "https://api.runtime.bsport.io///",
      };

      const res = getFullUri("/users/v1/123");

      expect(res).toBe("https://api.runtime.bsport.io/users/v1/123");
    });

    it("returns the same URI if it is already complete", () => {
      const completeUri = "https://api.example.com/users/v1/123";
      expect(getFullUri(completeUri)).toBe(completeUri);
    });

    it("defaults to production when no runtime API base url is configured", () => {
      expect(getFullUri("users/v1/123")).toBe(
        `${defaultApiBaseUrl}/users/v1/123`,
      );
    });
  });
});
