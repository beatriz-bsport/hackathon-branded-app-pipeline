import React from "react";

import {
  calculateDiffDuration,
  fromSeconds,
  toLocaleString,
} from "@bsport/datetime-manipulation";
import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type AttendanceScheduleProps = {
  clockInTime?: number;
  clockOutTime?: number;
};

export const AttendanceSchedule: React.FC<AttendanceScheduleProps> = ({
  clockInTime,
  clockOutTime,
}) => {
  const { t, i18n } = useTranslation("features");

  const clockInDatetime =
    clockInTime &&
    toLocaleString({
      datetime: fromSeconds(clockInTime),
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
      overrideOptions: { locale: i18n.language },
    });

  const clockOutDatetime =
    clockOutTime &&
    toLocaleString({
      datetime: fromSeconds(clockOutTime),
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
      overrideOptions: { locale: i18n.language },
    });

  const duration =
    clockInTime &&
    clockOutTime &&
    calculateDiffDuration({
      upperDatetime: fromSeconds(clockOutTime),
      lowerDatetime: fromSeconds(clockInTime),
      units: ["hours"],
    }).toObject();

  return (
    <div className="grid grid-cols-2 gap-sm w-full">
      {clockInDatetime && (
        <>
          <Body size="md" weight="strong">
            {t("attendance.schedule.arrivalTime")}
          </Body>
          <Body size="md" weight="weak">
            {clockInDatetime}
          </Body>
          <Divider
            orientation="horizontal"
            weight="thin"
            className="col-span-2"
          />
        </>
      )}
      {clockOutDatetime && (
        <>
          <Body size="md" weight="strong">
            {t("attendance.schedule.departureTime")}
          </Body>
          <Body size="md" weight="weak">
            {clockOutDatetime}
          </Body>
          <Divider
            orientation="horizontal"
            weight="thin"
            className="col-span-2"
          />
        </>
      )}
      {duration && (
        <>
          <Body size="md" weight="strong">
            {t("attendance.schedule.hoursWorked")}
          </Body>
          <Body size="md" weight="weak">
            {duration.hours?.toFixed(2)}
          </Body>
        </>
      )}
    </div>
  );
};
