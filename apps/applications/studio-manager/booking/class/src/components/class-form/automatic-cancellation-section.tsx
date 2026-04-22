import { type FC } from "react";

import { useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { type ClassFormValues, fieldIdPrefix } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormSection, FormSectionHeader } from "./class-form.shared";
import { FormNumberFieldFallbackZero } from "./form-number-field-fallback-zero";

export const AutomaticCancellationSection: FC = () => {
  const { t } = useTranslation("add-edit-form");
  const { watch, setValue } = useFormContext<ClassFormValues>();
  const isEnabled = watch("auto_discard_active");

  return (
    <FormSection>
      <FormSectionHeader title={t("addEditForm.automaticCancellation.title")} />
      <Toggle
        id={`${fieldIdPrefix}-cancel-underbooked-sessions`}
        label={t("addEditForm.automaticCancellation.toggleLabel")}
        checked={isEnabled}
        onToggleChange={(checked) => {
          setValue("auto_discard_active", checked, {
            shouldDirty: true,
            shouldValidate: true,
          });
          if (!checked) {
            setValue("auto_discard_hours_before_start", 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("auto_discard_min_bookings_nb", 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }}
      />
      {isEnabled ? (
        <div className="flex flex-col gap-md max-w-[320px]">
          <FormNumberFieldFallbackZero<
            ClassFormValues,
            "auto_discard_hours_before_start"
          >
            fieldName="auto_discard_hours_before_start"
            id={`${fieldIdPrefix}-auto-discard-hours-before-start`}
            label={t("addEditForm.automaticCancellation.hoursBeforeStart")}
            min={0}
            fullWidth
          />
          <FormNumberFieldFallbackZero<
            ClassFormValues,
            "auto_discard_min_bookings_nb"
          >
            fieldName="auto_discard_min_bookings_nb"
            id={`${fieldIdPrefix}-auto-discard-min-bookings`}
            label={t("addEditForm.automaticCancellation.minimumBookings")}
            min={0}
            fullWidth
          />
        </div>
      ) : null}
    </FormSection>
  );
};
