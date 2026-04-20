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
  ...additionalProps
}: CategoryFormSelectorProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, CategoryRawSelectorProps>
      name={fieldName}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <CategoryRawSelector {...additionalProps} />
    </FormField>
  );
};
