import type { ComponentType } from "react";
import type { FieldNamesMarkedBoolean } from "react-hook-form";
import type { z } from "zod";

import type {
  CreatePaymentPackFilterPayload,
  PaymentPackFilter,
} from "@bsport/api-cdp/smartlist";

import type { DirtyPatchPayload, PassesFilterFormValue } from "../types";
import type { PassSubFilterId } from "./pass-sub-filter-id";
import type { PassSubFilterSectionProps } from "./pass-sub-filter-section-props";

/**
 * Contract every pass sub-filter module must implement so the card, schema,
 * and mappers stay generic while each sub-filter stays isolated.
 */
export type PassSubFilterModule = {
  id: PassSubFilterId;
  labelKey: string;
  Section: ComponentType<PassSubFilterSectionProps>;
  refine: (value: PassesFilterFormValue, context: z.RefinementCtx) => void;
  readFromApi: (filter: PaymentPackFilter) => {
    isActive: boolean;
    partial: Partial<PassesFilterFormValue>;
  };
  appendCreatePayloadSlice: (
    value: PassesFilterFormValue,
  ) => Partial<CreatePaymentPackFilterPayload>;
  appendDirtyPatchSlice: (
    dirtyFields: Partial<
      Readonly<FieldNamesMarkedBoolean<PassesFilterFormValue>>
    >,
    value: PassesFilterFormValue,
  ) => DirtyPatchPayload;
};
