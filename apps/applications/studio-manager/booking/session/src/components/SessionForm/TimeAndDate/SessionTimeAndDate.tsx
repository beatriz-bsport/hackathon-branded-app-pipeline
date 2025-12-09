import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionStartDateTime } from "./SessionStartDateTime";

export const SessionTimeAndDate: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.timeAndDate.title")}
      </Title>

      <SessionStartDateTime fieldIdPrefix={fieldIdPrefix} />

      {/* TODO: Add Duration field */}
      {/* TODO: Add Recurrence toggle */}
      {/* TODO: Add Recurrence options (interval, days, end date) */}

      <Divider orientation="horizontal" weight="thin" className="my-md" />
    </section>
  );
};
