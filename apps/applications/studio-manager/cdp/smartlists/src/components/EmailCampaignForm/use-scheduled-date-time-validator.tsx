import { useMemo } from "react";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { Alert, Body } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import {
  isCommunicationScheduledInNightTime,
  isCommunicationScheduledInPast,
  isCommunicationScheduledTooSoon,
} from "./utils";

export const MIN_SCHEDULE_MINUTES_FROM_NOW = 5;

export const useScheduledDateTimeValidator = ({
  companyTimezone,
  date,
  time,
}: {
  companyTimezone: string;
  date?: string;
  time?: string;
}) => {
  const { t, i18n } = useTranslation("campaign");
  const now = getLocalNow({ zone: companyTimezone, locale: i18n.language });
  const [hourScheduled, minuteScheduled] =
    time?.trim().split(":")?.map(Number) ?? [];
  const dateTimeScheduled = fromIsoString(date ?? "", {
    zone: companyTimezone,
    locale: i18n.language,
  }).set({
    hour: hourScheduled,
    minute: minuteScheduled,
  });
  const theme = dataAccessLayer.useCompanyTheme();
  const latestHourToSend = theme?.latest_hour_to_send_communications;
  const earliestHourToSend = theme?.earliest_hour_to_send_communications;

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
            {t("email.creation.form.errors.scheduledDateNotInPast")}
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
            {t("email.creation.delivery.warning.nightTimeScheduled")}
          </Body>
        </Alert>,
      );
    }

    if (isScheduledTimeTooEarly) {
      alerts.push(
        <Alert key="tooSoon" status="warning" customIcon="clock">
          <Body size="sm" color="warning" htmlVariant="span">
            {t("email.creation.form.errors.scheduledAtLeast5Minutes")}
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
