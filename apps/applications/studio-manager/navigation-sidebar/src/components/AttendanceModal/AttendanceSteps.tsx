import React from "react";

import { Body, Illustration } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { AttendanceSchedule } from "./AttendanceSchedule";
import { ATTENDANCE_STEPS, getAttendanceStep } from "./utils";

type AttendanceStepsProps = {
  clockInTime?: number;
  clockOutTime?: number;
  userName: string;
};

export const AttendanceSteps: React.FC<AttendanceStepsProps> = ({
  clockInTime,
  clockOutTime,
  userName,
}) => {
  const { t } = useTranslation("features");

  const step = getAttendanceStep({ clockInTime, clockOutTime });

  if (step === ATTENDANCE_STEPS.INITIAL) {
    return (
      <>
        <Body size="md" weight="weak">
          {t("attendance.initial.welcome", { name: userName })}
        </Body>
        <Body size="md" weight="weak">
          {t("attendance.initial.clockInCTA")}
        </Body>
      </>
    );
  }

  if (step === ATTENDANCE_STEPS.CLOCKED_IN) {
    return (
      <>
        <Body size="md" weight="weak">
          {t("attendance.clockedIn.successfulClockIn")}
        </Body>
        <AttendanceSchedule clockInTime={clockInTime} />
        <Body size="sm" weight="weak" color="weak">
          {t("attendance.clockedIn.clockOutCTA")}
        </Body>
      </>
    );
  }

  if (step === ATTENDANCE_STEPS.CLOCKED_OUT) {
    return (
      <>
        <Illustration name="success" className="self-center" size="xl" />
        <Body size="md" weight="weak">
          {t("attendance.clockedOut.successfulClockOut")}
        </Body>
        <AttendanceSchedule
          clockInTime={clockInTime}
          clockOutTime={clockOutTime}
        />
        <Body size="sm" weight="weak" color="weak">
          {t("attendance.clockedOut.nextIterationCTA")}
        </Body>
      </>
    );
  }

  return null;
};
