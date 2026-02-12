import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import {
  RecurrenceIntervalType,
  RecurrenceRuleType,
} from "#src/events/constants";
import {
  sessionCreationRecurrenceIntervalEvent,
  sessionCreationRecurrenceRuleSelectedEvent,
  sessionCreationRecurrenceToggleEnabledEvent,
} from "#src/events/session-creation/events";
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

  const trackRecurrenceType = (recurrenceType: RecurrenceIntervalType) => {
    analyticsClient.track(
      sessionCreationRecurrenceIntervalEvent({
        session_recurrence_interval_selected: recurrenceType,
      }),
    );
  };

  const trackRecurrenceRule = (recurrenceRule: RecurrenceRuleType) => {
    analyticsClient.track(
      sessionCreationRecurrenceRuleSelectedEvent({
        session_recurrence_rule: recurrenceRule,
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
        trackRecurrenceType={trackRecurrenceType}
        trackRecurrenceRule={trackRecurrenceRule}
      />
      <AggregatorWarning />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
