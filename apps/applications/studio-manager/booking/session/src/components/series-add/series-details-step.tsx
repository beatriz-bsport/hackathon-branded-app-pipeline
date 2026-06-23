import { type FC, useId } from "react";

import { ControlledForm, type UseFormControllerOutput } from "@bsport/form";
import { Accordion, Body, Divider, Title } from "@bsport/kaizen-primitive-core";

import {
  SeriesDetailsBookingRuleField,
  SeriesDetailsGuestBookingUnavailableInfo,
  SeriesDetailsLevelField,
  SeriesDetailsNameField,
  SeriesDetailsTagsSection,
  SeriesDetailsVisibilitySection,
} from "#src/components/series-details-form/series-details-fields";
import { useTranslation } from "#src/utils/i18n";
import type { SeriesDetailsFormSchema } from "#src/utils/series-details-form";

type SeriesDetailsStepProps = {
  methods: UseFormControllerOutput<SeriesDetailsFormSchema>;
};

export const SeriesDetailsStep: FC<SeriesDetailsStepProps> = ({ methods }) => {
  const { t } = useTranslation("series");
  const formId = `series-add-details-${useId()}`;

  return (
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={() => undefined}
      className="w-full"
    >
      <div className="flex w-full flex-col gap-xl">
        <Body size="lg">{t("seriesAddModal.steps.seriesDetails.heading")}</Body>

        <section className="flex flex-col gap-sm">
          <Title htmlVariant="h4" weight="strong">
            {t("seriesAddModal.steps.seriesDetails.basics.title")}
          </Title>
          <div className="flex flex-col gap-md">
            <SeriesDetailsNameField disabled={false} fieldIdPrefix={formId} />
            <SeriesDetailsLevelField disabled={false} fieldIdPrefix={formId} />
          </div>
        </section>

        <section className="flex flex-col gap-sm">
          <Title htmlVariant="h4" weight="strong">
            {t("seriesAddModal.steps.seriesDetails.bookingVisibility.title")}
          </Title>
          <div className="flex flex-col gap-lg">
            <SeriesDetailsBookingRuleField
              disabled={false}
              fieldIdPrefix={formId}
            />
            <SeriesDetailsGuestBookingUnavailableInfo />
            <SeriesDetailsVisibilitySection
              disabled={false}
              fieldIdPrefix={formId}
            />
          </div>
        </section>

        <Divider orientation="horizontal" weight="thin" />

        <Accordion>
          <Accordion.Item
            ariaLabel={t("seriesAddModal.steps.seriesDetails.tags.title")}
            header={
              <Title htmlVariant="h4" weight="strong">
                {t("seriesAddModal.steps.seriesDetails.tags.title")}
              </Title>
            }
          >
            <div className="flex flex-col gap-md pt-md">
              <Body color="weak" size="md">
                {t("seriesAddModal.steps.seriesDetails.tags.description")}
              </Body>
              <SeriesDetailsTagsSection
                disabled={false}
                fieldIdPrefix={formId}
                showHeader={false}
              />
            </div>
          </Accordion.Item>
        </Accordion>
      </div>
    </ControlledForm>
  );
};
