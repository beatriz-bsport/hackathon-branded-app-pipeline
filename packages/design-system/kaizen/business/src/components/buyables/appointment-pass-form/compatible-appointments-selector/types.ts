import type { FieldValues } from "@bsport/form";

import type { CustomFieldPath } from "#src/utils/form-types";

/**
 * One compatibility entry — pairs an appointment id with the list of slot ids
 * that should be excluded from that appointment for the current pass.
 */
export type AppointmentCompatibility = {
  private_service: number;
  excluded_slot_ids: number[];
};

/**
 * Field path constraint that resolves to `AppointmentCompatibility[]` in the
 * consumer's form values.
 */
export type CompatibilityFieldPath<TFormValues extends FieldValues> =
  CustomFieldPath<TFormValues, AppointmentCompatibility[]>;
