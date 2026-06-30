import { useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { FC, useEffect, useState } from "react";

import { bookingKeys } from "@bsport/api-book";
import {
  Alert,
  Body,
  Button,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { usePostRollCall } from "#src/hooks/session-api/session-actions/use-post-roll-call";
import {
  type RollCallTimeLeft,
  getRollCallTimeLeft,
} from "#src/utils/get-roll-call-hours-left";
import { Trans, useTranslation } from "#src/utils/i18n";

type AttendanceValidationAlertProps = {
  sessionId: number;
};

const COUNTDOWN_INTERVAL = 60000; // 1 minute

export const AttendanceValidationAlert: FC<AttendanceValidationAlertProps> = ({
  sessionId,
}) => {
  const isMobile = !useMatchMedia("lg");

  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { mutate: postRollCall } = usePostRollCall();
  const queryClient = useQueryClient();

  const isRollCallMandatory = companyTheme?.is_roll_call_mandatory ?? false;
  const noShowHours = companyTheme?.no_show_validated_number_of_hours ?? 0;

  const [timeLeft, setTimeLeft] = useState<RollCallTimeLeft | null>(() => {
    if (!session.date_roll_call_last_modified || noShowHours <= 0) return null;
    return getRollCallTimeLeft(
      session.date_roll_call_last_modified,
      noShowHours,
    );
  });

  useEffect(() => {
    if (!session.date_roll_call_last_modified || noShowHours <= 0) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(
      getRollCallTimeLeft(session.date_roll_call_last_modified, noShowHours),
    );

    const interval = setInterval(() => {
      const remaining = getRollCallTimeLeft(
        session.date_roll_call_last_modified!,
        noShowHours,
      );
      setTimeLeft(remaining);

      if (remaining.totalMinutes <= 0) {
        clearInterval(interval);
        queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      }
    }, COUNTDOWN_INTERVAL);

    return () => clearInterval(interval);
  }, [session.date_roll_call_last_modified, noShowHours, queryClient]);

  if (!isRollCallMandatory) {
    return null;
  }

  // State A: Roll call needs validation — show confirm button
  if (session.roll_call_needs_validation) {
    const isReconfirm = !!session.date_roll_call_last_modified;

    return (
      <Alert status="warning" customIcon="message-alert-square">
        <div
          className={clsx("flex", {
            "flex-col items-start gap-sm": isMobile,
            "flex-row items-center justify-between": !isMobile,
          })}
        >
          <Body htmlVariant="p" size="md" weight="weak" color="inherit">
            {isReconfirm
              ? t("attendanceAlert.reconfirmMessage")
              : t("attendanceAlert.confirmMessage")}
          </Body>
          <Button
            label={t("attendanceAlert.confirmButton")}
            intent="default"
            color="main"
            size="sm"
            onClick={() => postRollCall({ sessionId })}
          />
        </div>
      </Alert>
    );
  }

  // State B: Roll call validated — show countdown if time remaining
  if (timeLeft && timeLeft.totalMinutes > 0) {
    const transProps = {
      components: { strong: <strong /> },
      ns: "sessionManagement",
    };

    const countdownNode =
      timeLeft.hours >= 3 ? (
        <Trans
          // @ts-expect-error it works at runtime
          t={t}
          {...transProps}
          i18nKey="attendanceAlert.countdownMessage"
          values={{ hoursLeft: timeLeft.hours }}
        />
      ) : timeLeft.hours < 1 ? (
        <Trans
          // @ts-expect-error it works at runtime
          t={t}
          {...transProps}
          i18nKey="attendanceAlert.countdownMessageMinutes"
          values={{ minutesLeft: timeLeft.minutes }}
        />
      ) : (
        <Trans
          // @ts-expect-error it works at runtime
          t={t}
          {...transProps}
          i18nKey="attendanceAlert.countdownMessageDetailed"
          values={{ hoursLeft: timeLeft.hours, minutesLeft: timeLeft.minutes }}
        />
      );

    return (
      <Alert status="info" customIcon="hourglass-03">
        <Body color="inherit">{countdownNode}</Body>
      </Alert>
    );
  }

  return null;
};
