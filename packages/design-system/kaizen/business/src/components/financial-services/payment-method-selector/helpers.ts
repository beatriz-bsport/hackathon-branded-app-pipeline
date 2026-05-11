import {
  ALL_PAYMENT_METHOD_OPTIONS,
  type AllPaymentMethodKey,
} from "./constants";
import {
  PAYMENT_METHOD_SELECTOR_SELECTION_KIND,
  type PaymentMethodSelectorResolvedSelection,
  type PaymentMethodSelectorSelection,
} from "./types";

const ALL_METHOD_KEYS = new Set<AllPaymentMethodKey>(
  ALL_PAYMENT_METHOD_OPTIONS.map((option) => option.id),
);

/**
 * Serializes a resolved selection into the select control value format.
 * Format: "<kind>:<id>".
 */
export const toSelectValue = (
  selection: PaymentMethodSelectorResolvedSelection,
): string => `${selection.kind}:${selection.id}`;

/**
 * Parses a select control value into a typed selection object.
 * Returns `null` for malformed values or unknown "all" method ids.
 */
export const parseSelectValue = (
  rawValue: string,
): PaymentMethodSelectorSelection => {
  const [selectionKind, id] = rawValue.split(":");
  if (!id) {
    return null;
  }

  if (selectionKind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED) {
    return { kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED, id };
  }

  if (
    selectionKind === PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL &&
    ALL_METHOD_KEYS.has(id as AllPaymentMethodKey)
  ) {
    return {
      kind: PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL,
      id: id as AllPaymentMethodKey,
    };
  }

  return null;
};

/**
 * Compares two selections, including `null`, for semantic equality.
 */
export const isSameSelection = (
  a: PaymentMethodSelectorSelection,
  b: PaymentMethodSelectorSelection,
): boolean => {
  if (!a || !b) {
    return a === b;
  }

  return a.kind === b.kind && a.id === b.id;
};
