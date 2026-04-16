import React, { memo, useMemo } from "react";

import { Table, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { selectAppointmentDisplayedColumns } from "#src/stores/calendar/selectors";
import { useCalendarStore } from "#src/stores/calendar/store";
import type { AppointmentColumn, EnrichedAppointment } from "#src/types";

import { AppointmentCards } from "./AppointmentCards";
import { useAppointmentColumns } from "./appointmentColumns";

type AppointmentTableProps = {
  appointments: EnrichedAppointment[];
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
}) => {
  const displayedColumns = useCalendarStore(selectAppointmentDisplayedColumns);
  const isMobile = !useMatchMedia("lg");
  const columns = useAppointmentColumns();

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as AppointmentColumn),
      ),
    [columns, displayedColumns],
  );

  if (isMobile) {
    return <AppointmentCards columns={filteredColumns} rows={appointments} />;
  }

  return <Table columns={filteredColumns} rowHeight="sm" rows={appointments} />;
};

export default memo(AppointmentTable);
