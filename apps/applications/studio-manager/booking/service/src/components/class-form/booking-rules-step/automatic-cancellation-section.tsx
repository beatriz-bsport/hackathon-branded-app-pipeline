import { type FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert, Body, Toggle } from "@bsport/kaizen-primitive-core";

import { FormNumberFieldFallbackZero } from "#src/components/class-form/shared/form-number-field-fallback-zero";
import { type ClassFormValues, fieldIdPrefix } from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { FormSection } from "../shared/form-section";
import { FormSectionHeader } from "../shared/form-section-header";

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
        }}
      />
      {isEnabled ? (
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col items-start gap-md">
            <FormNumberFieldFallbackZero<
              ClassFormValues,
              "auto_discard_min_bookings_nb"
            >
              fieldName="auto_discard_min_bookings_nb"
              id={`${fieldIdPrefix}-auto-discard-min-bookings`}
              aria-label={t(
                "addEditForm.automaticCancellation.minBookingsLabel",
              )}
              label={t("addEditForm.automaticCancellation.minBookingsLabel")}
              suffix={{
                type: "text",
                value: t("addEditForm.automaticCancellation.minBookingsSuffix"),
              }}
              min={0}
            />
            <FormNumberFieldFallbackZero<
              ClassFormValues,
              "auto_discard_hours_before_start"
            >
              fieldName="auto_discard_hours_before_start"
              id={`${fieldIdPrefix}-auto-discard-hours-before-start`}
              aria-label={t(
                "addEditForm.automaticCancellation.hoursBeforeStartLabel",
              )}
              label={t(
                "addEditForm.automaticCancellation.hoursBeforeStartLabel",
              )}
              suffix={{
                type: "text",
                value: t(
                  "addEditForm.automaticCancellation.hoursBeforeStartSuffix",
                ),
              }}
              min={0}
            />
          </div>
          <Alert status="info" type="weak" layout="inline">
            <Body size="md" color="info">
              {t("addEditForm.automaticCancellation.alert")}
            </Body>
          </Alert>
        </div>
      ) : null}
    </FormSection>
  );
};
