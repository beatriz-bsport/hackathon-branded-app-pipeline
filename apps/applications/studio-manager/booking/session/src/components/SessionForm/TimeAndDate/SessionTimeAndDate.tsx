import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { sessionCreationRecurrenceToggleEnabledEvent } from "#src/events/session-creation/events";
import { analyticsClient } from "#src/utils/analytics";
import { useTranslation } from "#src/utils/i18n";

import { SessionDuration } from "./SessionDuration";
import { SessionStartDateTime } from "./SessionStartDateTime";
import { AggregatorWarning } from "./aggregator-warning";
import { SessionRecurrence } from "./recurrence/session-recurrence";

export const SessionTimeAndDate: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const trackRecurrenceToggle = (isRecurring: boolean) => {
    analyticsClient.track(
      sessionCreationRecurrenceToggleEnabledEvent({
        session_is_recurrent: isRecurring,
      }),
    );
  };

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.timeAndDate.title")}
      </Title>

      <SessionStartDateTime fieldIdPrefix={fieldIdPrefix} />

      <SessionDuration fieldIdPrefix={fieldIdPrefix} />
      <SessionRecurrence
        fieldIdPrefix={fieldIdPrefix}
        trackRecurrenceToggle={trackRecurrenceToggle}
      />
      <AggregatorWarning />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
