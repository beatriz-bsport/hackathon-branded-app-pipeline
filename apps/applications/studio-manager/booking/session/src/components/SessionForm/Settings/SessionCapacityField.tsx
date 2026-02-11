import { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";

/**
 * Field component for setting session capacity (effectif, waiting list max size or partner max booking count).
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
 * <SessionCapacityField
 *   fieldIdPrefix="unique-prefix"
 *   fieldName="partner_max_booking_count"
 *   label={t("settings.partnership")}
 * />
 * ```
 */
export const SessionCapacityField: FC<{
  fieldIdPrefix: string;
  fieldName: "effectif" | "waiting_list_max_size" | "partner_max_booking_count";
  label: string;
  helperText?: string;
}> = ({ fieldIdPrefix, fieldName, label, helperText }) => {
  return (
    <FormField<SessionCreationFormData, typeof fieldName>
      name={fieldName}
      mapProps={({ defaultProps, fieldState }) => ({
        ...defaultProps,
        value: String(defaultProps.value ?? ""),
        onChange: (e) => {
          const numValue = parseInt(e.target.value, 10);
          defaultProps.onChange(isNaN(numValue) ? 0 : Math.max(0, numValue));
        },
        status: fieldState.error ? "error" : "default",
        statusText: fieldState.error?.message,
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-${fieldName}`}
        label={label}
        required
        containerProps={{ className: "max-w-full" }}
        type="number"
        helperText={helperText}
      />
    </FormField>
  );
};
