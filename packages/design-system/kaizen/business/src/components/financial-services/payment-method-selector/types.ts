import type { ReactNode } from "react";

import type { Fetch } from "@bsport/fetch";
import type { SelectProps } from "@bsport/kaizen-primitive-core";

import type {
  AllPaymentMethodKey,
  SavedPaymentMethodDiscriminator,
} from "./constants";

/** Serialized selection prefix / discriminant for `PaymentMethodSelector` values. */
export const PAYMENT_METHOD_SELECTOR_SELECTION_KIND = {
  SAVED: "saved",
  ALL: "all",
} as const;

export type PaymentMethodSelectorSelection =
  | {
      kind: typeof PAYMENT_METHOD_SELECTOR_SELECTION_KIND.SAVED;
      id: string;
      paymentMethodType?: SavedPaymentMethodDiscriminator;
      /**
       * Numeric backend identifier for the saved method, mapped from the
       * fetched saved methods. Lets consumers bridge the textual frontend id
       * and the numeric id their backend references.
       */
      payment_backend_identifier?: number;
    }
  | {
      kind: typeof PAYMENT_METHOD_SELECTOR_SELECTION_KIND.ALL;
      id: AllPaymentMethodKey;
    }
  | null;

export type PaymentMethodSelectorResolvedSelection = Exclude<
  PaymentMethodSelectorSelection,
  null
>;

export type PaymentMethodSelectorProps = Omit<
  SelectProps,
  "items" | "value" | "defaultValue" | "label" | "onChange" | "loadingProps"
> & {
  /** Member identifier used to fetch saved payment methods. */
  memberId: number;
  /** Fetch client passed to financial-services API calls. */
  fetch: Fetch;
  /**
   * Controlled selection. When provided (including `null`), the parent owns
   * the selection state and the component reflects it; `onSelectionChange`
   * acts as the change callback. The auto-select default behavior is disabled
   * in controlled mode.
   */
  value?: PaymentMethodSelectorSelection;
  /**
   * Initial selection used to seed the internal state once (uncontrolled).
   * When provided, the auto-select default behavior is disabled so the
   * consumer's initial value is preserved.
   */
  defaultValue?: PaymentMethodSelectorResolvedSelection;
  /** Main selection callback for parent payment flows. */
  onSelectionChange?: (selection: PaymentMethodSelectorSelection) => void;
  /** Optional customization for "All methods" entries. */
  allMethodsConfig?: {
    /** Optional "All methods" entries to hide. */
    hiddenIds?: AllPaymentMethodKey[];
    /** Optional "All methods" entries to disable. */
    disabledIds?: AllPaymentMethodKey[];
    /** Optional custom right-side content for "All methods" entries. */
    adornmentById?: Partial<Record<AllPaymentMethodKey, ReactNode>>;
  };
};
