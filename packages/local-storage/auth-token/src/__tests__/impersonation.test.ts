import { beforeEach, describe, expect, it } from "vitest";

import {
  BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY,
  BSPORT_I18NEXTLNG_ORIGIN_KEY,
  BSPORT_I18NEXTLNG_SESSION_KEY,
  BSPORT_IMPERSONATION_AUTH_TOKEN_KEY,
  BSPORT_IMPERSONATION_ORIGIN_URL_KEY,
  clearFranchiseImpersonationSession,
  hasFranchisorNavigationContext,
} from "#src/impersonation";

describe("impersonation", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("Constants", () => {
    it("should export correct sessionStorage key for impersonation", () => {
      expect(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY).toBe("http:token");
    });

    it("should export franchise origin token session key", () => {
      expect(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY).toBe(
        "bsport:franchise:http:token",
      );
    });
  });

  describe("hasFranchisorNavigationContext", () => {
    it("should be false when franchise origin token is absent", () => {
      expect(hasFranchisorNavigationContext()).toBe(false);
    });

    it("should be false when franchise origin token is the string null", () => {
      sessionStorage.setItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY, "null");
      expect(hasFranchisorNavigationContext()).toBe(false);
    });

    it("should be true when franchise origin token is set", () => {
      sessionStorage.setItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY, "tok");
      expect(hasFranchisorNavigationContext()).toBe(true);
    });
  });

  describe("clearFranchiseImpersonationSession", () => {
    it("should remove franchise navigation session keys", () => {
      sessionStorage.setItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY, "a");
      sessionStorage.setItem(BSPORT_IMPERSONATION_ORIGIN_URL_KEY, "/x");
      sessionStorage.setItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY, "b");
      sessionStorage.setItem(BSPORT_I18NEXTLNG_ORIGIN_KEY, "en");
      sessionStorage.setItem(BSPORT_I18NEXTLNG_SESSION_KEY, "fr");

      clearFranchiseImpersonationSession();

      expect(
        sessionStorage.getItem(BSPORT_FRANCHISE_ORIGIN_TOKEN_KEY),
      ).toBeNull();
      expect(
        sessionStorage.getItem(BSPORT_IMPERSONATION_ORIGIN_URL_KEY),
      ).toBeNull();
      expect(
        sessionStorage.getItem(BSPORT_IMPERSONATION_AUTH_TOKEN_KEY),
      ).toBeNull();
      expect(sessionStorage.getItem(BSPORT_I18NEXTLNG_ORIGIN_KEY)).toBeNull();
      expect(sessionStorage.getItem(BSPORT_I18NEXTLNG_SESSION_KEY)).toBeNull();
    });
  });
});
