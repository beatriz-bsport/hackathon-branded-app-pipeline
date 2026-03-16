import type { ReactElement } from "react";

import { type FieldValues, FormField } from "@bsport/form";

import type { NumberFieldPath } from "#src/utils/form-types";

import {
  BookkeepingAccountRawSelector,
  type BookkeepingAccountRawSelectorProps,
} from "./raw-selector";

export type BookkeepingAccountFormSelectorProps<
  TFormValues extends FieldValues,
  IdFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
  TaxFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  idFieldName: IdFieldName;
  taxFieldName?: TaxFieldName;
  /** Default value to apply when clearing the bookkeeping selector */
  taxFieldClearedValue?: TFormValues[TaxFieldName];
} & Omit<
  BookkeepingAccountRawSelectorProps,
  "value" | "onChange" | "onChangeTax"
>;

export const BookkeepingAccountFormSelector = <
  TFormValues extends FieldValues,
  IdFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
  TaxFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  idFieldName,
  taxFieldName,
  taxFieldClearedValue,
  ...additionalProps
}: BookkeepingAccountFormSelectorProps<
  TFormValues,
  IdFieldName,
  TaxFieldName
>): ReactElement => {
  return (
    <FormField<TFormValues, IdFieldName, BookkeepingAccountRawSelectorProps>
      name={idFieldName}
      mapProps={({ defaultProps, form }) => {
        return {
          ...defaultProps,
          onClear: () => {
            form.setValue(idFieldName, null as TFormValues[IdFieldName], {
              shouldDirty: true,
              shouldValidate: true,
            });
            if (taxFieldName) {
              form.setValue(
                taxFieldName,
                taxFieldClearedValue ?? (null as TFormValues[TaxFieldName]),
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              );
            }
          },
          onChangeTax: (value: number) => {
            if (taxFieldName) {
              form.setValue(taxFieldName, value as TFormValues[TaxFieldName], {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          },
        };
      }}
    >
      <BookkeepingAccountRawSelector {...additionalProps} />
    </FormField>
  );
};
