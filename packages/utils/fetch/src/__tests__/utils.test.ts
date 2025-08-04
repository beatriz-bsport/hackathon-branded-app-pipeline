import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  API_BASE_URL,
  getCustomErrorCodes,
  getFullUri,
  getHeaders,
  getMessage,
} from "../utils";

// Mock external dependencies
vi.mock("@bsport/local-storage-auth-token", () => ({
  getAuthToken: vi.fn(),
}));

vi.mock("@bsport/sentry", () => ({
  getSessionId: vi.fn(() => "test-session-id"),
  getTransactionId: vi.fn(() => "test-transaction-id"),
}));

vi.mock("@bsport/timezone-utils", () => ({
  getTimezoneName: vi.fn(() => "Europe/Paris"),
}));

const mockGetAuthToken = vi.mocked(
  await import("@bsport/local-storage-auth-token"),
).getAuthToken;

// Mock window.location for referrer tests
Object.defineProperty(window, "location", {
  value: {
    href: "https://app.bsport.io/dashboard",
  },
  writable: true,
});

describe("utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("API_BASE_URL", () => {
    it("should have a valid API base URL", () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe("string");
    });
  });

  describe("getHeaders", () => {
    it("should return default headers without auth token", () => {
      mockGetAuthToken.mockReturnValue(null);

      const headers = getHeaders();

      expect(headers).toEqual({
        Accept: "application/json",
        "X-Session-ID": "test-session-id",
        "X-Timezone-Name": "Europe/Paris",
        "X-React-Referrer": "https://app.bsport.io/dashboard",
        "X-bsport-log-collection": "true",
        "X-Transaction-ID": "test-transaction-id",
      });
    });

    it("should include authorization header when token is present", () => {
      mockGetAuthToken.mockReturnValue("test-auth-token");

      const headers = getHeaders() as Record<string, string>;

      expect(headers.Authorization).toBe("Token test-auth-token");
      expect(headers.Accept).toBe("application/json");
    });

    it("should merge custom headers with default headers", () => {
      mockGetAuthToken.mockReturnValue("test-token");

      const customHeaders = {
        "Content-Type": "multipart/form-data",
        "X-Custom-Header": "custom-value",
      };

      const headers = getHeaders(customHeaders) as Record<string, string>;

      expect(headers["Content-Type"]).toBe("multipart/form-data");
      expect(headers["X-Custom-Header"]).toBe("custom-value");
      expect(headers.Authorization).toBe("Token test-token");
      expect(headers.Accept).toBe("application/json");
    });

    it("should truncate referrer URL to 250 characters", () => {
      const longUrl = "https://app.bsport.io/" + "a".repeat(300);
      Object.defineProperty(window, "location", {
        value: { href: longUrl },
        writable: true,
      });

      const headers = getHeaders() as Record<string, string>;
      const referrer = headers["X-React-Referrer"];

      expect(referrer.length).toBe(250);
      expect(referrer).toBe(longUrl.slice(0, 250));
    });

    it("should handle missing timezone", async () => {
      const mockGetTimezoneName = vi.mocked(
        await import("@bsport/timezone-utils"),
      ).getTimezoneName;
      mockGetTimezoneName.mockReturnValue(null);

      const headers = getHeaders() as Record<string, string>;

      expect(headers["X-Timezone-Name"]).toBe("unknown");
    });
  });

  describe("getFullUri", () => {
    it("should return production URI unchanged", () => {
      const result = getFullUri("platform/v1/users");
      expect(result).toBe(`${API_BASE_URL}/platform/v1/users`);
    });
  });

  describe("getCustomErrorCodes", () => {
    it("should return empty array for undefined error", () => {
      expect(getCustomErrorCodes(undefined)).toEqual([]);
    });

    it("should return empty array for null error", () => {
      expect(getCustomErrorCodes(null as never)).toEqual([]);
    });

    it("should return array with single error code for number", () => {
      expect(getCustomErrorCodes(404)).toEqual([404]);
      expect(getCustomErrorCodes(0)).toEqual([]); // 0 is falsy, so returns []
    });

    it("should extract error codes from array of error objects", () => {
      const errors = [
        { error_code: 1001, error_message: "Validation failed" },
        { error_code: 1002, error_message: "Missing field" },
      ];
      expect(getCustomErrorCodes(errors)).toEqual([1001, 1002]);
    });

    it("should filter out falsy values from error array", () => {
      const errors = [
        { error_code: 1001, error_message: "Valid error" },
        { error_code: 1002, error_message: "Another valid error" },
      ];
      expect(getCustomErrorCodes(errors)).toEqual([1001, 1002]);
    });

    it("should return empty array for empty error array", () => {
      expect(getCustomErrorCodes([])).toEqual([]);
    });

    it("should return empty array for non-number, non-array values", () => {
      expect(getCustomErrorCodes("string" as never)).toEqual([]);
      expect(getCustomErrorCodes({} as never)).toEqual([]);
    });
  });

  describe("getMessage", () => {
    it("should return empty string for undefined error", () => {
      expect(getMessage(undefined)).toBe("");
    });

    it("should return empty string for null error", () => {
      expect(getMessage(null as never)).toBe("");
    });

    it("should return string as-is for string error", () => {
      expect(getMessage("Error message")).toBe("Error message");
      expect(getMessage("")).toBe("");
    });

    it("should join error messages from array with semicolon", () => {
      const errors = [
        { error_code: 1001, error_message: "First error" },
        { error_code: 1002, error_message: "Second error" },
      ];
      expect(getMessage(errors)).toBe("First error;Second error");
    });

    it("should filter out falsy values from error array", () => {
      const errors = [
        { error_code: 1001, error_message: "Valid error" },
        { error_code: 1002, error_message: "Another error" },
      ];
      expect(getMessage(errors)).toBe("Valid error;Another error");
    });

    it("should return empty string for empty error array", () => {
      expect(getMessage([])).toBe("");
    });

    it("should stringify non-string, non-array values", () => {
      const obj = { custom: "error" };
      expect(getMessage(obj as never)).toBe('{"custom":"error"}');
    });

    it("should handle JSON.stringify errors gracefully", () => {
      const circularObj: Record<string, unknown> = {};
      circularObj.self = circularObj;

      expect(getMessage(circularObj as never)).toBe("");
    });
  });
});
