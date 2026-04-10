import React, { memo } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import { Title } from "@bsport/kaizen-primitive-core";

import CalendarDay from "#src/components/shared/CalendarDay";
import type { EnrichedAppointment } from "#src/types";

import AppointmentTable from "./AppointmentTable";

type AppointmentDayProps = {
  date: string;
  appointments: EnrichedAppointment[];
  locale: string;
};

const AppointmentDay: React.FC<AppointmentDayProps> = ({
  date,
  appointments,
  locale,
}) => {
  const localizedDate = fromIsoString(date, { locale });
  const dateTitle = formatDateTimeFromDate(
    localizedDate,
    DATETIME_FORMATS.HUGE_DATE,
  );

  return (
    <CalendarDay date={date}>
      <div className="mb-sm flex items-center gap-xs px-md">
        <Title htmlVariant="h2" weight="strong">
          {dateTitle}
        </Title>
      </div>
      <AppointmentTable appointments={appointments} />
    </CalendarDay>
  );
};

export default memo(AppointmentDay);
