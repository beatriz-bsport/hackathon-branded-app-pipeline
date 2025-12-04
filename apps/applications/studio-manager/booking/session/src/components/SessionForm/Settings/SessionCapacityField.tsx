import { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";

/**
 * Field component for setting session capacity (effectif or waiting list max size)
 * Props:
 * - fieldIdPrefix: string - Prefix for the field ID
 * - fieldName: "effectif" | "waiting_list_max_size" - Name of the field in the form data
 * - label: string - Label for the text field
 * @example
 * ```tsx
 * <SessionCapacityField
 *   fieldIdPrefix="unique-prefix"
 *   fieldName="effectif"
 *   label={t("settings.effectif")}
 * />
 * <SessionCapacityField
 *   fieldIdPrefix="unique-prefix"
 *   fieldName="waiting_list_max_size"
 *   label={t("settings.waitingList")}
 * />
 * ```
 */
export const SessionCapacityField: FC<{
  fieldIdPrefix: string;
  fieldName: "effectif" | "waiting_list_max_size";
  label: string;
}> = ({ fieldIdPrefix, fieldName, label }) => {
  return (
    <FormField<SessionCreationFormData, typeof fieldName>
      name={fieldName}
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        value: String(defaultProps.value ?? ""),
        onChange: (e) => {
          const numValue = parseInt(e.target.value, 10);
          defaultProps.onChange(isNaN(numValue) ? 0 : Math.max(0, numValue));
        },
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-${fieldName}`}
        label={label}
        required
        type="number"
      />
    </FormField>
  );
};
