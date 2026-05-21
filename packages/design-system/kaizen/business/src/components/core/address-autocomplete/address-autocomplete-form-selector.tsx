import type { ReactElement } from "react";

import type { AddressSuggestion } from "@bsport/api-core";
import type { FieldValues } from "@bsport/form";
import { FormField } from "@bsport/form";

import type { CustomFieldPath } from "#src/utils/form-types";

import {
  AddressAutocompleteRaw,
  type AddressAutocompleteRawProps,
} from "./address-autocomplete-raw";

export type AddressAutocompleteFormSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends CustomFieldPath<
    TFormValues,
    AddressSuggestion | null
  > = CustomFieldPath<TFormValues, AddressSuggestion | null>,
> = {
  /** Form field name — must point to an `AddressSuggestion | null` field in the schema. */
  fieldName: TFieldName;
} & Omit<AddressAutocompleteRawProps, "onChange" | "value">;

export const AddressAutocompleteFormSelector = <
  TFormValues extends FieldValues,
  TFieldName extends CustomFieldPath<
    TFormValues,
    AddressSuggestion | null
  > = CustomFieldPath<TFormValues, AddressSuggestion | null>,
>({
  fieldName,
  ...additionalProps
}: AddressAutocompleteFormSelectorProps<
  TFormValues,
  TFieldName
>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, AddressAutocompleteRawProps>
      name={fieldName}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <AddressAutocompleteRaw {...additionalProps} />
    </FormField>
  );
};
