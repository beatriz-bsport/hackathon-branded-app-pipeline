import clsx from "clsx";
import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { SessionDuration } from "#src/components/SessionForm/TimeAndDate/SessionDuration";
import { SessionStartDateTime } from "#src/components/SessionForm/TimeAndDate/SessionStartDateTime";
import { AggregatorWarning } from "#src/components/SessionForm/TimeAndDate/aggregator-warning";
import { useTranslation } from "#src/utils/i18n";

export const TimeAndDateSection: FC<{
  fieldIdPrefix: string;
  isEditMode?: boolean;
}> = ({ fieldIdPrefix, isEditMode = false }) => {
  const { t } = useTranslation("sessionCreation");

  return (
    <section className={clsx("flex flex-col gap-md", { "pb-md": isEditMode })}>
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.timeAndDate.title")}
      </Title>

      <SessionStartDateTime fieldIdPrefix={fieldIdPrefix} />

      <SessionDuration fieldIdPrefix={fieldIdPrefix} />
      <AggregatorWarning />
    </section>
  );
};
