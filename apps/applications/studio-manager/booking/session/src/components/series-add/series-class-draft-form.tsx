import { type FC, useId } from "react";

import { ControlledForm, type UseFormControllerOutput } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SessionCapacityField } from "#src/components/SessionForm/Settings/SessionCapacityField";
import { SessionCreditsField } from "#src/components/SessionForm/Settings/SessionCreditField";
import { SessionTimeAndDate } from "#src/components/SessionForm/TimeAndDate/SessionTimeAndDate";
import { SessionTeacherAndEstablishment } from "#src/components/SessionForm/teacher-and-establishment/teacher-and-establishment";
import type {
  SeriesClassDraftFormData,
  SeriesClassDraftFormSchema,
} from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type SeriesClassDraftFormProps = {
  mode: "create" | "edit";
  methods: UseFormControllerOutput<SeriesClassDraftFormSchema>;
  onCancel: () => void;
  onSubmit: (formData: SeriesClassDraftFormData) => void;
};

export const SeriesClassDraftForm: FC<SeriesClassDraftFormProps> = ({
  mode,
  methods,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation("series");
  const formId = `series-class-draft-${useId()}`;
  const isSaveDisabled =
    !methods.formState.isValid || methods.formState.isSubmitting;

  return (
    <Card actionable={false} padding="none" className="flex flex-col">
      <div className="px-lg py-md">
        <Title htmlVariant="h5" weight="stronger">
          {mode === "edit"
            ? t("seriesAddModal.steps.addClasses.form.editTitle")
            : t("seriesAddModal.steps.addClasses.form.title")}
        </Title>
      </div>
      <Divider orientation="horizontal" weight="thin" />
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={onSubmit}
        className="flex w-full flex-col"
      >
        <div className="flex flex-col px-lg py-xl">
          <SessionTimeAndDate
            fieldIdPrefix={formId}
            showAggregatorWarning={false}
            trackAnalytics={false}
          />
          <Divider orientation="horizontal" weight="thin" className="my-xl" />
          <SessionTeacherAndEstablishment
            fieldIdPrefix={formId}
            isWorkshop
            showPayrollOverrideToggle={false}
            showSpiviField={false}
            showWellhubField={false}
          />
          <Divider orientation="horizontal" weight="thin" className="my-xl" />
          <section className="flex flex-col gap-md">
            <Title htmlVariant="h5" weight="stronger">
              {t("seriesAddModal.steps.addClasses.booking.title")}
            </Title>
            <SessionCapacityField
              fieldIdPrefix={formId}
              fieldName="effectif"
              label={t(
                "seriesAddModal.steps.addClasses.booking.totalSpots.label",
              )}
              triggerPartnerCapacityValidation={false}
            />
            <Body color="weak" size="md">
              {t("seriesAddModal.steps.addClasses.booking.waitlistUnavailable")}
            </Body>
            <SessionCreditsField
              fieldIdPrefix={formId}
              idSuffix="series-class"
            />
          </section>
        </div>
        <Divider orientation="horizontal" weight="thin" />
        <div className="flex justify-end gap-sm px-lg py-md">
          <Button
            color="default"
            intent="flat"
            label={t("seriesAddModal.steps.addClasses.form.cancel")}
            onClick={onCancel}
            size="md"
            type="button"
          />
          <Button
            color="main"
            disabled={isSaveDisabled}
            intent="call-to-action"
            label={t("seriesAddModal.steps.addClasses.form.saveClass")}
            size="md"
            type="submit"
          />
        </div>
      </ControlledForm>
    </Card>
  );
};
