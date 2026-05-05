import { describe, expect, it } from "vitest";

import { deriveNamespaceVar, generateI18nIndexContent } from "./utils";

describe("deriveNamespaceVar", () => {
  it("derives namespace for @bsport/sm-giftcard", () => {
    expect(deriveNamespaceVar("@bsport/sm-giftcard")).toBe("__GIFTCARD__");
  });

  it("derives namespace for @bsport/sm-referral-program", () => {
    expect(deriveNamespaceVar("@bsport/sm-referral-program")).toBe(
      "__REFERRAL_PROGRAM__",
    );
  });

  it("derives namespace for @bsport/sm-member-list", () => {
    expect(deriveNamespaceVar("@bsport/sm-member-list")).toBe(
      "__MEMBER_LIST__",
    );
  });

  it("derives namespace for @bsport/sm-email-template", () => {
    expect(deriveNamespaceVar("@bsport/sm-email-template")).toBe(
      "__EMAIL_TEMPLATE__",
    );
  });

  it("derives namespace for @bsport/sm-group-activity", () => {
    expect(deriveNamespaceVar("@bsport/sm-group-activity")).toBe(
      "__GROUP_ACTIVITY__",
    );
  });

  it("derives namespace for @bsport/sm-marketing-notification", () => {
    expect(deriveNamespaceVar("@bsport/sm-marketing-notification")).toBe(
      "__MARKETING_NOTIFICATION__",
    );
  });
});

describe("generateI18nIndexContent", () => {
  it("generates i18n index content with correct structure", () => {
    const content = generateI18nIndexContent("__REFERRAL_PROGRAM__", [
      "settings",
    ]);

    expect(content).toContain(
      'import type { InMemoryTranslationsLoader } from "@bsport/i18n"',
    );
    expect(content).toContain("export const inMemoryTranslationsLoader");
    expect(content).toContain("__REFERRAL_PROGRAM__.__I18N_NAMESPACE_PREFIX__");
    expect(content).toContain('["settings"]');
  });

  it("generates content with multiple namespaces", () => {
    const content = generateI18nIndexContent("__REFERRAL_PROGRAM__", [
      "settings",
      "common",
      "imageUpload",
    ]);

    expect(content).toContain('"settings", "common", "imageUpload"');
  });

  it("includes dynamic import statements for translations", () => {
    const content = generateI18nIndexContent("__REFERRAL_PROGRAM__", [
      "settings",
    ]);

    expect(content).toContain("await import(`./source/${namespace}.json`)");
    expect(content).toContain(
      "await import(`./locales/${locale}/${namespace}.json`)",
    );
  });
});
