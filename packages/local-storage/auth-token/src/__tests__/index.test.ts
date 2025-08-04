import { beforeEach, describe, expect, it } from "vitest";

import {
  BSPORT_AUTH_TOKEN_KEY,
  BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "#src/index";

describe("@bsport/local-storage-auth-token", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("Constants", () => {
    it("should export correct localStorage key", () => {
      expect(BSPORT_AUTH_TOKEN_KEY).toBe("bsport:http:token");
    });

    it("should export correct sessionStorage key for impersonation", () => {
      expect(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY).toBe("http:token");
    });
  });

  describe("setAuthToken", () => {
    it("should store token in localStorage", () => {
      const token = "test-token-123";
      setAuthToken(token);

      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBe(token);
    });

    it("should overwrite existing token", () => {
      const firstToken = "first-token";
      const secondToken = "second-token";

      setAuthToken(firstToken);
      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBe(firstToken);

      setAuthToken(secondToken);
      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBe(secondToken);
    });

    it("should handle empty string token", () => {
      setAuthToken("");
      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBe("");
    });
  });

  describe("getAuthToken", () => {
    it("should return token from localStorage when no impersonation token exists", () => {
      const token = "regular-token";
      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, token);

      expect(getAuthToken()).toBe(token);
    });

    it("should return null when no tokens exist", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("should prioritize sessionStorage token over localStorage (impersonation)", () => {
      const localStorageToken = "regular-token";
      const impersonationToken = "impersonation-token";

      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, localStorageToken);
      sessionStorage.setItem(
        BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
        impersonationToken,
      );

      expect(getAuthToken()).toBe(impersonationToken);
    });

    it("should return localStorage token when sessionStorage token is empty", () => {
      const localStorageToken = "regular-token";

      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, localStorageToken);
      sessionStorage.setItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY, "");

      expect(getAuthToken()).toBe(localStorageToken);
    });

    it("should return sessionStorage token when it exists and localStorage is empty", () => {
      const impersonationToken = "impersonation-only-token";

      sessionStorage.setItem(
        BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
        impersonationToken,
      );

      expect(getAuthToken()).toBe(impersonationToken);
    });

    it("should handle null values in storage", () => {
      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, "null");
      expect(getAuthToken()).toBe("null");
    });
  });

  describe("removeAuthToken", () => {
    it("should remove token from localStorage", () => {
      const token = "token-to-remove";
      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, token);

      removeAuthToken();

      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBeNull();
    });

    it("should not affect sessionStorage tokens", () => {
      const impersonationToken = "impersonation-token";
      const localToken = "local-token";

      localStorage.setItem(BSPORT_AUTH_TOKEN_KEY, localToken);
      sessionStorage.setItem(
        BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
        impersonationToken,
      );

      removeAuthToken();

      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBeNull();
      expect(sessionStorage.getItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY)).toBe(
        impersonationToken,
      );
    });

    it("should handle removing non-existent token gracefully", () => {
      expect(() => removeAuthToken()).not.toThrow();
      expect(localStorage.getItem(BSPORT_AUTH_TOKEN_KEY)).toBeNull();
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete workflow: set → get → remove", () => {
      const token = "workflow-token";

      // Set token
      setAuthToken(token);
      expect(getAuthToken()).toBe(token);

      // Remove token
      removeAuthToken();
      expect(getAuthToken()).toBeNull();
    });

    it("should handle impersonation workflow correctly", () => {
      const regularToken = "regular-user-token";
      const impersonationToken = "admin-impersonating-user-token";

      // Regular user login
      setAuthToken(regularToken);
      expect(getAuthToken()).toBe(regularToken);

      // Admin starts impersonating
      sessionStorage.setItem(
        BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
        impersonationToken,
      );
      expect(getAuthToken()).toBe(impersonationToken);

      // Admin stops impersonating
      sessionStorage.removeItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY);
      expect(getAuthToken()).toBe(regularToken);

      // User logs out
      removeAuthToken();
      expect(getAuthToken()).toBeNull();
    });

    it("should handle edge case where both tokens exist but sessionStorage is empty string", () => {
      const localToken = "local-token";

      setAuthToken(localToken);
      sessionStorage.setItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY, "");

      expect(getAuthToken()).toBe(localToken);
    });
  });
});
