import { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import type {
  SessionCapacityFieldName,
  SessionCapacityFormValues,
} from "#src/types";

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
  fieldName: SessionCapacityFieldName;
  label: string;
  helperText?: string;
  triggerPartnerCapacityValidation?: boolean;
}> = ({
  fieldIdPrefix,
  fieldName,
  label,
  helperText,
  triggerPartnerCapacityValidation = true,
}) => {
  return (
    <FormField<SessionCapacityFormValues, typeof fieldName>
      name={fieldName}
      mapProps={({ defaultProps, fieldState, form }) => ({
        ...defaultProps,
        value: String(defaultProps.value ?? ""),
        onChange: (e) => {
          const numValue = parseInt(e.target.value, 10);
          defaultProps.onChange(isNaN(numValue) ? 0 : Math.max(0, numValue));
          if (fieldName === "effectif") {
            form.trigger("effectif"); // Trigger validation to check against roomBlueprintCapacity
            if (triggerPartnerCapacityValidation) {
              form.trigger("partner_max_booking_count"); // Trigger validation to check against effectif
            }
          }
        },
        status: fieldState.error ? "error" : "default",
        statusText: fieldState.error?.message,
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-${fieldName}`}
        label={label}
        required
        type="number"
        helperText={helperText}
      />
    </FormField>
  );
};
