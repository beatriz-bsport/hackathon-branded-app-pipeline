import { describe, expect, it } from "vitest";

import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";

import {
  getMaskedPaymentMethodIdentifier,
  getPaymentMethodExpiry,
  getSavedPaymentMethodDisplay,
  getSavedPaymentMethodTypeLabelKey,
} from "./helpers";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BASE = {
  id: "pm_test",
  is_default: false,
  billing_details: {},
} as const;

const card = (
  readable_identifier: string,
  additional_info = "",
  brand = "visa",
  display_brand?: string,
): SavedPaymentMethod => ({
  ...BASE,
  type: "card",
  readable_identifier,
  additional_info,
  brand,
  ...(display_brand !== undefined ? { display_brand } : {}),
  is_cobranded_card: false,
});

const sepa = (readable_identifier = "DE89****3704"): SavedPaymentMethod => ({
  ...BASE,
  type: "sepa_debit",
  readable_identifier,
  additional_info: "",
  brand: "",
});

const bacs = (readable_identifier = "****0012"): SavedPaymentMethod => ({
  ...BASE,
  type: "bacs_debit",
  readable_identifier,
  additional_info: "",
  brand: "",
});

// ─── getMaskedPaymentMethodIdentifier ────────────────────────────────────────

describe("getMaskedPaymentMethodIdentifier", () => {
  it("masks the last 4 digits of a numeric identifier", () => {
    expect(getMaskedPaymentMethodIdentifier(card("4242424242424242"))).toBe(
      "****4242",
    );
  });

  it("extracts and masks last 4 digits from an IBAN-style identifier with spaces", () => {
    expect(
      getMaskedPaymentMethodIdentifier(sepa("DE89 3704 0044 0532 0130 00")),
    ).toBe("****3000");
  });

  it("normalizes a pre-masked identifier to exactly ****XXXX", () => {
    expect(getMaskedPaymentMethodIdentifier(card("****1234"))).toBe("****1234");
  });

  it("re-masks a pre-masked identifier with trailing digits to drop the excess", () => {
    expect(getMaskedPaymentMethodIdentifier(card("****1234 5678"))).toBe(
      "****5678",
    );
  });

  it("falls back to the raw identifier when no digits are present", () => {
    expect(getMaskedPaymentMethodIdentifier(card("no-digits-here"))).toBe(
      "no-digits-here",
    );
  });

  it("trims surrounding whitespace before processing", () => {
    expect(getMaskedPaymentMethodIdentifier(card("  4242  "))).toBe("****4242");
  });
});

// ─── getPaymentMethodExpiry ───────────────────────────────────────────────────

describe("getPaymentMethodExpiry", () => {
  it("normalizes a 1-digit month to 2-digit MM/YY", () => {
    expect(getPaymentMethodExpiry(card("****4242", "3/26"))).toBe("03/26");
  });

  it("normalizes a 4-digit year to 2-digit MM/YY", () => {
    expect(getPaymentMethodExpiry(card("****4242", "12/2026"))).toBe("12/26");
  });

  it("normalizes both: 1-digit month and 4-digit year", () => {
    expect(getPaymentMethodExpiry(card("****4242", "1/2030"))).toBe("01/30");
  });

  it("passes through a well-formed MM/YY unchanged", () => {
    expect(getPaymentMethodExpiry(card("****4242", "06/28"))).toBe("06/28");
  });

  it("passes through malformed values unchanged", () => {
    expect(getPaymentMethodExpiry(card("****4242", "not a date"))).toBe(
      "not a date",
    );
  });

  it("returns undefined when additional_info is empty", () => {
    expect(getPaymentMethodExpiry(card("****4242", ""))).toBeUndefined();
    expect(getPaymentMethodExpiry(card("****4242", "   "))).toBeUndefined();
  });

  it("returns undefined for sepa_debit regardless of additional_info", () => {
    const sepaWithInfo: SavedPaymentMethod = {
      ...sepa(),
      additional_info: "12/2026",
    };
    expect(getPaymentMethodExpiry(sepaWithInfo)).toBeUndefined();
  });

  it("returns undefined for bacs_debit", () => {
    expect(getPaymentMethodExpiry(bacs())).toBeUndefined();
  });
});

// ─── getSavedPaymentMethodTypeLabelKey ───────────────────────────────────────

describe("getSavedPaymentMethodTypeLabelKey", () => {
  it("returns card key", () => {
    expect(getSavedPaymentMethodTypeLabelKey(card("****1234"))).toBe(
      "paymentMethod.card",
    );
  });

  it("returns sepaDebit key", () => {
    expect(getSavedPaymentMethodTypeLabelKey(sepa())).toBe(
      "paymentMethod.sepaDebit",
    );
  });

  it("returns bacsDebit key", () => {
    expect(getSavedPaymentMethodTypeLabelKey(bacs())).toBe(
      "paymentMethod.bacsDebit",
    );
  });
});

// ─── getSavedPaymentMethodDisplay ────────────────────────────────────────────

describe("getSavedPaymentMethodDisplay", () => {
  it("returns full display model for a Visa card", () => {
    const method = card("4242424242424242", "03/26", "visa");
    const display = getSavedPaymentMethodDisplay(method);

    expect(display).toEqual({
      logoType: "visa",
      maskedIdentifier: "****4242",
      hasMaskedDigits: true,
      expiry: "03/26",
      typeLabelKey: "paymentMethod.card",
    });
  });

  it("prefers display_brand over brand for logo resolution", () => {
    const method = card("****4242", "", "visa", "mastercard");
    expect(getSavedPaymentMethodDisplay(method).logoType).toBe("mastercard");
  });

  it("returns undefined logoType for an unsupported card brand", () => {
    const method = card("****4242", "", "amex");
    expect(getSavedPaymentMethodDisplay(method).logoType).toBeUndefined();
  });

  it("sets hasMaskedDigits=false when identifier has no maskable digits", () => {
    const method = card("no-digits");
    const display = getSavedPaymentMethodDisplay(method);

    expect(display.hasMaskedDigits).toBe(false);
    expect(display.maskedIdentifier).toBe("no-digits");
  });

  it("sets hasMaskedDigits=false when a pre-masked identifier has no digits after ****", () => {
    const method = card("****");
    const display = getSavedPaymentMethodDisplay(method);

    expect(display.hasMaskedDigits).toBe(false);
    expect(display.maskedIdentifier).toBe("****");
  });

  it("returns full display model for sepa_debit", () => {
    const method = sepa("****3704");
    const display = getSavedPaymentMethodDisplay(method);

    expect(display).toEqual({
      logoType: "sepa_debit",
      maskedIdentifier: "****3704",
      hasMaskedDigits: true,
      expiry: undefined,
      typeLabelKey: "paymentMethod.sepaDebit",
    });
  });

  it("returns full display model for bacs_debit", () => {
    const method = bacs("****0012");
    const display = getSavedPaymentMethodDisplay(method);

    expect(display).toEqual({
      logoType: "bacs_debit",
      maskedIdentifier: "****0012",
      hasMaskedDigits: true,
      expiry: undefined,
      typeLabelKey: "paymentMethod.bacsDebit",
    });
  });
});
