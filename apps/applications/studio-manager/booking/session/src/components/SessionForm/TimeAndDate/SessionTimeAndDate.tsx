import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import {
  RecurrenceIntervalType,
  RecurrenceRuleType,
} from "#src/events/constants";
import {
  sessionCreationRecurrenceIntervalEvent,
  sessionCreationRecurrenceRuleSelectedEvent,
  sessionCreationRecurrenceToggleEnabledEvent,
} from "#src/events/session-creation/events";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

import { SessionDuration } from "./SessionDuration";
import { SessionStartDateTime } from "./SessionStartDateTime";
import { AggregatorWarning } from "./aggregator-warning";
import { PastSessionWarning } from "./past-session-warning";
import { SessionRecurrence } from "./recurrence/session-recurrence";

export const SessionTimeAndDate: FC<{
  fieldIdPrefix: string;
  showAggregatorWarning?: boolean;
  trackAnalytics?: boolean;
}> = ({
  fieldIdPrefix,
  showAggregatorWarning = true,
  trackAnalytics = true,
}) => {
  const { t } = useTranslation("sessionCreation");

  const trackRecurrenceToggle = (isRecurring: boolean) => {
    if (!trackAnalytics) return;
    analyticsTrackSafeEvent(sessionCreationRecurrenceToggleEnabledEvent, {
      session_is_recurrent: isRecurring,
    });
  };

  const trackRecurrenceType = (recurrenceType: RecurrenceIntervalType) => {
    if (!trackAnalytics) return;
    analyticsTrackSafeEvent(sessionCreationRecurrenceIntervalEvent, {
      session_recurrence_interval_selected: recurrenceType,
    });
  };

  const trackRecurrenceRule = (recurrenceRule: RecurrenceRuleType) => {
    if (!trackAnalytics) return;
    analyticsTrackSafeEvent(sessionCreationRecurrenceRuleSelectedEvent, {
      session_recurrence_rule: recurrenceRule,
    });
  };

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="stronger">
        {t("addSessionModal.steps.configureSession.timeAndDate.title")}
      </Title>

      <SessionStartDateTime fieldIdPrefix={fieldIdPrefix} />

      <PastSessionWarning />

      <SessionDuration fieldIdPrefix={fieldIdPrefix} />
      <SessionRecurrence
        fieldIdPrefix={fieldIdPrefix}
        trackRecurrenceToggle={trackRecurrenceToggle}
        trackRecurrenceType={trackRecurrenceType}
        trackRecurrenceRule={trackRecurrenceRule}
      />
      {showAggregatorWarning && <AggregatorWarning />}
    </section>
  );
};
