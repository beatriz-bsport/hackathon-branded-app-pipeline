import { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, TextFieldProps } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";

export const RecurrenceInterval: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  return (
    <FormField<SessionCreationFormData, "recurrenceInterval", TextFieldProps>
      name="recurrenceInterval"
      mapProps={({ defaultProps, fieldState }) => ({
        ...defaultProps,
        value: String(defaultProps.value ?? ""),
        onChange: (e) => {
          const numValue = parseInt(e.target.value, 10);
          defaultProps.onChange(isNaN(numValue) ? 1 : Math.max(1, numValue));
        },
        status: fieldState.error ? "error" : undefined,
        statusText: fieldState.error ? fieldState.error.message : undefined,
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-recurrence-interval`}
        type="number"
      />
    </FormField>
  );
};
