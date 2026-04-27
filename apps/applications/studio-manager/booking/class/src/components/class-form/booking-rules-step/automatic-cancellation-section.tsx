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
        <div className="flex flex-col gap-md">
          <div className="flex flex-wrap items-center gap-2xs">
            <Body size="md" htmlVariant="span">
              {t("addEditForm.automaticCancellation.sentencePre")}
            </Body>
            <FormNumberFieldFallbackZero<
              ClassFormValues,
              "auto_discard_min_bookings_nb"
            >
              fieldName="auto_discard_min_bookings_nb"
              id={`${fieldIdPrefix}-auto-discard-min-bookings`}
              aria-label={t(
                "addEditForm.automaticCancellation.minBookingsAriaLabel",
              )}
              min={0}
              className="w-[48px]"
            />
            <Body size="md" htmlVariant="span">
              {t("addEditForm.automaticCancellation.sentenceMid")}
            </Body>
            <FormNumberFieldFallbackZero<
              ClassFormValues,
              "auto_discard_hours_before_start"
            >
              fieldName="auto_discard_hours_before_start"
              id={`${fieldIdPrefix}-auto-discard-hours-before-start`}
              aria-label={t(
                "addEditForm.automaticCancellation.hoursBeforeStartAriaLabel",
              )}
              min={0}
              className="w-[48px]"
            />
            <Body size="md" htmlVariant="span">
              {t("addEditForm.automaticCancellation.sentenceEnd")}
            </Body>
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
