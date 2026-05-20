import type { ReactElement } from "react";

import type { FieldValues } from "@bsport/form";
import { FormField } from "@bsport/form";

import type { NumberListFieldPath } from "#src/utils/form-types";

import {
  EstablishmentRawSelector,
  type EstablishmentRawSelectorProps,
} from "./establishment-raw-selector";

export type EstablishmentFormSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  companyId: number;
} & Omit<
  EstablishmentRawSelectorProps,
  "onChange" | "value" | "status" | "statusText"
>;

export const EstablishmentFormSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  fieldName,
  ...additionalProps
}: EstablishmentFormSelectorProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, EstablishmentRawSelectorProps>
      name={fieldName}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <EstablishmentRawSelector {...additionalProps} />
    </FormField>
  );
};
