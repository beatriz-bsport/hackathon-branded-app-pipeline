import { describe, expect, it } from "vitest";

import { getEnv, isFeatureBranch } from "#src/index";

describe("getEnv", () => {
  describe("localhost URLs", () => {
    it('should return "local" for localhost with any port', () => {
      expect(getEnv("http://localhost:3000")).toBe("local");
      expect(getEnv("http://localhost:8080")).toBe("local");
      expect(getEnv("https://localhost:3000/some/path")).toBe("local");
      expect(getEnv("http://localhost")).toBe("local");
    });

    it('should return "local" for 127.0.0.1', () => {
      expect(getEnv("http://127.0.0.1:3000")).toBe("local");
      expect(getEnv("https://127.0.0.1:8080/path")).toBe("local");
      expect(getEnv("http://127.0.0.1")).toBe("local");
    });
  });

  describe("bsport.io development URLs", () => {
    it('should return "dev" for backoffice.dev.bsport.io', () => {
      expect(getEnv("https://backoffice.dev.bsport.io")).toBe("dev");
      expect(getEnv("https://backoffice.dev.bsport.io/some/path")).toBe("dev");
      expect(getEnv("http://backoffice.dev.bsport.io")).toBe("dev");
    });
  });

  describe("bsport.io staging URLs", () => {
    it('should return "staging" for backoffice.staging.bsport.io', () => {
      expect(getEnv("https://backoffice.staging.bsport.io")).toBe("staging");
      expect(getEnv("https://backoffice.staging.bsport.io/dashboard")).toBe(
        "staging",
      );
      expect(getEnv("http://backoffice.staging.bsport.io")).toBe("staging");
    });
  });

  describe("bsport.io production URLs", () => {
    it('should return "production" for backoffice.bsport.io', () => {
      expect(getEnv("https://backoffice.bsport.io")).toBe("production");
      expect(getEnv("https://backoffice.bsport.io/admin")).toBe("production");
      expect(getEnv("http://backoffice.bsport.io")).toBe("production");
    });
  });

  describe("feature branch URLs", () => {
    it("should return the branch name for backoffice-{name}.chaos.bsport.io pattern", () => {
      expect(getEnv("https://backoffice-karate.chaos.bsport.io")).toBe(
        "karate",
      );
      expect(getEnv("https://backoffice-feature-branch.chaos.bsport.io")).toBe(
        "feature-branch",
      );
      expect(getEnv("https://backoffice-test123.chaos.bsport.io/path")).toBe(
        "test123",
      );
      expect(getEnv("http://backoffice-xyz.chaos.bsport.io")).toBe("xyz");
    });

    it('should return "production" for non-backoffice chaos URLs', () => {
      expect(getEnv("https://api-test.chaos.bsport.io")).toBe("production");
      expect(getEnv("https://widget-test.chaos.bsport.io")).toBe("production");
    });
  });

  describe("other bsport.io domains", () => {
    it('should return "production" for other bsport.io subdomains', () => {
      expect(getEnv("https://api.bsport.io")).toBe("production");
      expect(getEnv("https://widget.bsport.io")).toBe("production");
      expect(getEnv("https://any-subdomain.bsport.io")).toBe("production");
    });
  });

  describe("non-bsport domains", () => {
    it('should return "local" for non-bsport domains', () => {
      expect(getEnv("https://example.com")).toBe("local");
      expect(getEnv("https://google.com")).toBe("local");
      expect(getEnv("https://app.mycompany.com")).toBe("local");
    });
  });

  describe("edge cases", () => {
    it('should return "local" for empty string', () => {
      expect(getEnv("")).toBe("local");
    });

    it('should return "local" for invalid URLs', () => {
      expect(getEnv("not-a-valid-url")).toBe("local");
      expect(getEnv("://invalid")).toBe("local");
    });

    it('should return "local" when no URL is provided and window is undefined', () => {
      expect(getEnv()).toBe("local");
    });
  });

  describe("protocol variations", () => {
    it("should work with both http and https", () => {
      expect(getEnv("http://backoffice.dev.bsport.io")).toBe("dev");
      expect(getEnv("https://backoffice.dev.bsport.io")).toBe("dev");
      expect(getEnv("http://backoffice.staging.bsport.io")).toBe("staging");
      expect(getEnv("https://backoffice.staging.bsport.io")).toBe("staging");
    });
  });

  describe("path and query parameters", () => {
    it("should ignore path and query parameters", () => {
      expect(
        getEnv("https://backoffice.dev.bsport.io/dashboard?user=123"),
      ).toBe("dev");
      expect(
        getEnv("https://backoffice.staging.bsport.io/admin/settings?tab=users"),
      ).toBe("staging");
      expect(
        getEnv("https://backoffice-test.chaos.bsport.io/api/v1/users?page=1"),
      ).toBe("test");
    });
  });
});

describe("isFeatureBranch", () => {
  describe("known environments", () => {
    it("should return false for known environments", () => {
      expect(isFeatureBranch("http://localhost:3000")).toBe(false);
      expect(isFeatureBranch("https://backoffice.dev.bsport.io")).toBe(false);
      expect(isFeatureBranch("https://backoffice.staging.bsport.io")).toBe(
        false,
      );
      expect(isFeatureBranch("https://backoffice.bsport.io")).toBe(false);
    });
  });

  describe("feature branch environments", () => {
    it("should return true for feature branch URLs", () => {
      expect(
        isFeatureBranch("https://backoffice-feature-123.chaos.bsport.io"),
      ).toBe(true);
      expect(isFeatureBranch("https://backoffice-karate.chaos.bsport.io")).toBe(
        true,
      );
      expect(
        isFeatureBranch("https://backoffice-my-branch.chaos.bsport.io"),
      ).toBe(true);
      expect(
        isFeatureBranch(
          "https://backoffice-test123.chaos.bsport.io/path?query=1",
        ),
      ).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should return false for non-bsport domains", () => {
      expect(isFeatureBranch("https://example.com")).toBe(false);
      expect(isFeatureBranch("https://google.com")).toBe(false);
    });

    it("should return false for empty string or invalid URLs", () => {
      expect(isFeatureBranch("")).toBe(false);
      expect(isFeatureBranch("invalid-url")).toBe(false);
    });

    it("should return false when no URL is provided", () => {
      expect(isFeatureBranch()).toBe(false);
    });
  });
});
