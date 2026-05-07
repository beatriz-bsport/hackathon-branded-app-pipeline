import type { ReactNode } from "react";

import type { Fetch } from "@bsport/fetch";
import type { SelectProps } from "@bsport/kaizen-primitive-core";

import type { AllPaymentMethodKey } from "./constants";

export type PaymentMethodSelectorSelection =
  | { kind: "saved"; id: string }
  | { kind: "all"; id: AllPaymentMethodKey }
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
    /** Optional custom right-side content for "All methods" entries. */
    adornmentById?: Partial<Record<AllPaymentMethodKey, ReactNode>>;
  };
};
