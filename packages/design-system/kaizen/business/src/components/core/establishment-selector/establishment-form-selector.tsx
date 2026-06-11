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
  /** Resting helper text shown below the field when there is no error. */
  helperText?: string;
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
  helperText,
  ...additionalProps
}: EstablishmentFormSelectorProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, EstablishmentRawSelectorProps>
      name={fieldName}
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        // Show the field error when present, otherwise the helper text.
        statusText: defaultProps.statusText ?? helperText,
      })}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <EstablishmentRawSelector {...additionalProps} />
    </FormField>
  );
};
