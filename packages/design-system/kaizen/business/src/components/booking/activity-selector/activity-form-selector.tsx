import type { ReactElement } from "react";

import type { FieldValues } from "@bsport/form";
import { FormField } from "@bsport/form";

import type { NumberListFieldPath } from "#src/utils/form-types";

import {
  ActivityRawSelector,
  type ActivityRawSelectorProps,
} from "./activity-raw-selector";

export type ActivityFormSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
} & Omit<ActivityRawSelectorProps, "value" | "onChange">;

export const ActivityFormSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  fieldName,
  ...rawSelectorProps
}: ActivityFormSelectorProps<TFormValues, TFieldName>): ReactElement => {
  return (
    <FormField<TFormValues, TFieldName, ActivityRawSelectorProps>
      name={fieldName}
    >
      {/** @ts-expect-error value and onChange are provided by the FormField wrapper */}
      <ActivityRawSelector {...rawSelectorProps} />
    </FormField>
  );
};
