import type { ComponentType } from "react";
import type {
  FieldErrors,
  FieldNamesMarkedBoolean,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import type { z } from "zod";

/**
 * Generic props shared by all sub-filter section components.
 *
 * Default `TExtraProps` uses `Record<never, never>` (not `Record<string, never>`): it adds
 * no keys and no string index signature, so React JSX attributes such as `key` remain valid
 * for `ComponentType<SubFilterSectionProps<…>>`.
 */
export type SubFilterSectionProps<
  TFormValue extends FieldValues,
  TExtraProps extends object = Record<never, never>,
> = {
  id: string;
  value: TFormValue;
  errors: FieldErrors<TFormValue>;
  setValue: UseFormSetValue<TFormValue>;
  onRemove: () => void;
} & TExtraProps;

/**
 * Generic contract for sub-filter modules.
 *
 * Each filter family (passes, total-booking, ...) can specialize this by
 * binding its form value, API filter, payload, and section prop types.
 */
export type SubFilterModule<
  TId extends string,
  TFormValue extends FieldValues,
  TApiFilter,
  TCreatePayload,
  TDirtyPatchPayload,
  TSectionProps extends SubFilterSectionProps<TFormValue, object>,
> = {
  id: TId;
  labelKey: string;
  Section: ComponentType<TSectionProps>;
  refine: (value: TFormValue, context: z.RefinementCtx) => void;
  readFromApi: (filter: TApiFilter) => {
    isActive: boolean;
    partial: Partial<TFormValue>;
  };
  appendCreatePayloadSlice: (value: TFormValue) => Partial<TCreatePayload>;
  appendDirtyPatchSlice: (
    dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<TFormValue>>>,
    value: TFormValue,
  ) => TDirtyPatchPayload;
};
