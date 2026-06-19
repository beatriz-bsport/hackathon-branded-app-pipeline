import { describe, expect, it } from "vitest";

import { ALL_PAYMENT_METHOD_SELECTOR_ID } from "./constants";
import {
  type SavedSelectionSource,
  enrichSavedSelection,
  isSameSelection,
  parseSelectValue,
  toSelectValue,
} from "./helpers";
import { PAYMENT_METHOD_SELECTOR_SELECTION_KIND } from "./types";

const savedMethods: SavedSelectionSource[] = [
  { id: "pm_card_123", savedType: "card", paymentBackendIdentifier: 42 },
  { id: "pm_sepa_456", savedType: "sepa_debit", paymentBackendIdentifier: 99 },
];

describe("toSelectValue / parseSelectValue", () => {
  it("round-trips a saved selection", () => {
    const value = toSelectValue({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
      id: "pm_card_123",
    });

    expect(value).toBe("saved:pm_card_123");
    expect(parseSelectValue(value)).toEqual({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
      id: "pm_card_123",
    });
  });

  it("round-trips an all-methods selection", () => {
    const value = toSelectValue({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
      id: ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT,
    });

    expect(value).toBe("all:sepa_debit");
    expect(parseSelectValue(value)).toEqual({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
      id: ALL_PAYMENT_METHOD_SELECTOR_ID.SEPA_DEBIT,
    });
  });

  it("returns null for malformed values and unknown all-method ids", () => {
    expect(parseSelectValue("saved:")).toBeNull();
    expect(parseSelectValue("all:not_a_method")).toBeNull();
    expect(parseSelectValue("garbage")).toBeNull();
  });
});

describe("isSameSelection", () => {
  it("compares on kind and id, ignoring enrichment fields", () => {
    expect(
      isSameSelection(
        {
          kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
          id: "pm_card_123",
        },
        {
          kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
          id: "pm_card_123",
          paymentMethodType: "card",
          payment_backend_identifier: 42,
        },
      ),
    ).toBe(true);
  });

  it("treats null consistently", () => {
    expect(isSameSelection(null, null)).toBe(true);
    expect(
      isSameSelection(null, {
        kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
        id: ALL_PAYMENT_METHOD_SELECTOR_ID.CARD,
      }),
    ).toBe(false);
  });
});

describe("enrichSavedSelection", () => {
  it("attaches paymentMethodType and payment_backend_identifier for a matching saved method", () => {
    expect(
      enrichSavedSelection(
        {
          kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
          id: "pm_sepa_456",
        },
        savedMethods,
      ),
    ).toEqual({
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
      id: "pm_sepa_456",
      paymentMethodType: "sepa_debit",
      payment_backend_identifier: 99,
    });
  });

  it("leaves the selection unchanged when no saved method matches", () => {
    const selection = {
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED,
      id: "pm_unknown",
    } as const;

    expect(enrichSavedSelection(selection, savedMethods)).toBe(selection);
  });

  it("returns all-method selections and null untouched", () => {
    const allSelection = {
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
      id: ALL_PAYMENT_METHOD_SELECTOR_ID.CARD,
    } as const;

    expect(enrichSavedSelection(allSelection, savedMethods)).toBe(allSelection);
    expect(enrichSavedSelection(null, savedMethods)).toBeNull();
  });
});
