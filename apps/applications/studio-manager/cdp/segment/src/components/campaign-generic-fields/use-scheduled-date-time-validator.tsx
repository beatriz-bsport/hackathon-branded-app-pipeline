import { useMemo } from "react";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { Alert, Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MIN_SCHEDULE_MINUTES_FROM_NOW } from "./campaign-delivery-mode.constants";
import {
  isCommunicationScheduledInNightTime,
  isCommunicationScheduledInPast,
  isCommunicationScheduledTooSoon,
} from "./campaign-delivery-mode.utils";

export const useScheduledDateTimeValidator = ({
  companyTimezone,
  locale,
  date,
  time,
  earliestHourToSend,
  latestHourToSend,
}: {
  companyTimezone: string;
  locale: string;
  date?: string;
  time?: string;
  earliestHourToSend?: number;
  latestHourToSend?: number;
}) => {
  const { t, i18n } = useTranslation("campaign");
  const now = getLocalNow({ zone: companyTimezone, locale });
  const [hourScheduled, minuteScheduled] =
    time?.trim().split(":")?.map(Number) ?? [];
  const dateTimeScheduled = fromIsoString(date ?? "", {
    zone: companyTimezone,
    locale,
  }).set({
    hour: hourScheduled,
    minute: minuteScheduled,
  });

  const isScheduledInPast = useMemo(
    () =>
      Boolean(
        dateTimeScheduled && isCommunicationScheduledInPast(dateTimeScheduled),
      ),
    [dateTimeScheduled],
  );

  const isScheduledInNightTime = useMemo(
    () =>
      Boolean(
        earliestHourToSend &&
          latestHourToSend &&
          hourScheduled !== undefined &&
          !Number.isNaN(hourScheduled) &&
          isCommunicationScheduledInNightTime(
            hourScheduled,
            earliestHourToSend,
            latestHourToSend,
          ),
      ),
    [hourScheduled, earliestHourToSend, latestHourToSend],
  );

  const isScheduledTimeTooEarly = useMemo(
    () =>
      Boolean(
        dateTimeScheduled &&
          isCommunicationScheduledTooSoon(
            dateTimeScheduled,
            now,
            MIN_SCHEDULE_MINUTES_FROM_NOW,
          ),
      ),
    [dateTimeScheduled, now],
  );

  const validationAlerts = useMemo(() => {
    const alerts: React.ReactNode[] = [];

    if (isScheduledInPast) {
      alerts.push(
        <Alert key="past" status="critical" customIcon="clock">
          <Body size="sm" color="critical" htmlVariant="span">
            {t("generic.creation.form.errors.scheduledDateNotInPast")}
          </Body>
        </Alert>,
      );
    }

    if (isScheduledInNightTime) {
      alerts.push(
        <Alert
          key="nightTime"
          status="default"
          type="weak"
          customIcon="alert-circle"
        >
          <Body size="sm" htmlVariant="span">
            {t("generic.creation.delivery.warning.nightTimeScheduled")}
          </Body>
        </Alert>,
      );
    }

    if (isScheduledTimeTooEarly) {
      alerts.push(
        <Alert key="tooSoon" status="warning" customIcon="clock">
          <Body size="sm" color="warning" htmlVariant="span">
            {t("generic.creation.form.errors.scheduledAtLeast5Minutes")}
          </Body>
        </Alert>,
      );
    }

    return alerts;
  }, [
    isScheduledInPast,
    isScheduledInNightTime,
    isScheduledTimeTooEarly,
    i18n.language,
  ]);

  return validationAlerts;
};
