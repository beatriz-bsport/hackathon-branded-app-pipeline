import type { ReactElement } from "react";

import type { FieldValues } from "@bsport/form";
import { FormField } from "@bsport/form";

import type { NumberListFieldPath } from "#src/utils/form-types";

import {
  CategoryRawSelector,
  type CategoryRawSelectorProps,
} from "./category-raw-selector";

export type CategoryFormSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  companyId: number;
  /** Resting helper text shown below the field when there is no error. */
  helperText?: string;
} & Omit<
  CategoryRawSelectorProps,
  "onChange" | "value" | "status" | "statusText"
>;

export const CategoryFormSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  fieldName,
  helperText,
  ...additionalProps
}: CategoryFormSelectorProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, CategoryRawSelectorProps>
      name={fieldName}
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        // Show the field error when present, otherwise the helper text.
        statusText: defaultProps.statusText ?? helperText,
      })}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <CategoryRawSelector {...additionalProps} />
    </FormField>
  );
};
