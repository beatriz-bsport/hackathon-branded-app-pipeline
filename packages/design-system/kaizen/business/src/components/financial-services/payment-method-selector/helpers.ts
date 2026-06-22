import {
  ALL_PAYMENT_METHOD_OPTIONS,
  type AllPaymentMethodKey,
  type SavedPaymentMethodDiscriminator,
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

/** Minimal saved-method shape needed to enrich a `saved` selection. */
export type SavedSelectionSource = {
  id: string;
  savedType: SavedPaymentMethodDiscriminator;
  paymentBackendIdentifier?: number;
};

/**
 * Enriches a `saved` selection with `paymentMethodType` and
 * `payment_backend_identifier` resolved from the fetched saved methods.
 * Other selections (and unmatched ids) are returned unchanged.
 */
export const enrichSavedSelection = (
  selection: PaymentMethodSelectorSelection,
  savedMethods: ReadonlyArray<SavedSelectionSource>,
): PaymentMethodSelectorSelection => {
  if (
    !selection ||
    selection.kind !== PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED
  ) {
    return selection;
  }

  const matched = savedMethods.find((method) => method.id === selection.id);
  if (!matched) {
    return selection;
  }

  return {
    ...selection,
    paymentMethodType: matched.savedType,
    payment_backend_identifier: matched.paymentBackendIdentifier,
  };
};
