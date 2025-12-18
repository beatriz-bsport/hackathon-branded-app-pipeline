import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionDuration } from "./SessionDuration";
import { SessionStartDateTime } from "./SessionStartDateTime";
import { SessionRecurrence } from "./recurrence/session-recurrence";

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

      <SessionDuration fieldIdPrefix={fieldIdPrefix} />
      <SessionRecurrence fieldIdPrefix={fieldIdPrefix} />
      <Divider orientation="horizontal" weight="thin" className="my-md" />
    </section>
  );
};
