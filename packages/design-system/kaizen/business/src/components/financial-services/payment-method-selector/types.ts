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
