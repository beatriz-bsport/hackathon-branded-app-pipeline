import { describe, expect, it } from "vitest";

import { getUpdatedStringI18nKey } from "#src/utils/get-updated-string-i18n-key";

describe("getUpdatedStringI18nKey", () => {
  it("returns the source key when override is true", () => {
    const result = getUpdatedStringI18nKey({
      override: true,
      sourceKey: "coach",
    });

    expect(result).toBe("coach");
  });

  it("adds _revamp suffix when override is false", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "coach",
    });

    expect(result).toBe("coach_revamp");
  });

  // _plural suffix management

  it("preserves _plural suffix when override is false", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "coach_plural",
    });

    expect(result).toBe("coach_revamp_plural");
  });

  it("returns _plural key unchanged when override is true", () => {
    const result = getUpdatedStringI18nKey({
      override: true,
      sourceKey: "coach_plural",
    });

    expect(result).toBe("coach_plural");
  });

  it("handles keys containing _plural in the middle", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "user_plurality",
    });

    expect(result).toBe("user_plurality_revamp");
  });

  // _one suffix management

  it("preserves _one suffix when override is false", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "coach_one",
    });

    expect(result).toBe("coach_revamp_one");
  });

  it("returns _one key unchanged when override is true", () => {
    const result = getUpdatedStringI18nKey({
      override: true,
      sourceKey: "coach_one",
    });

    expect(result).toBe("coach_one");
  });

  it("handles keys containing _one in the middle", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "user_one_or_two",
    });

    expect(result).toBe("user_one_or_two_revamp");
  });

  // _other suffix management

  it("preserves _other suffix when override is false", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "coach_other",
    });

    expect(result).toBe("coach_revamp_other");
  });

  it("returns _other key unchanged when override is true", () => {
    const result = getUpdatedStringI18nKey({
      override: true,
      sourceKey: "coach_other",
    });

    expect(result).toBe("coach_other");
  });

  it("handles keys containing _other in the middle", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "user_otherity",
    });

    expect(result).toBe("user_otherity_revamp");
  });

  it("handles empty sourceKey", () => {
    const result = getUpdatedStringI18nKey({
      override: false,
      sourceKey: "",
    });

    expect(result).toBe("_revamp");
  });
});
