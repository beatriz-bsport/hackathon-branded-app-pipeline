import React, { memo, useMemo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { selectAppointmentDisplayedColumns } from "#src/stores/calendar/selectors";
import { useCalendarStore } from "#src/stores/calendar/store";
import type { AppointmentColumn, EnrichedAppointment } from "#src/types";

import { useAppointmentColumns } from "./appointmentColumns";

type AppointmentTableProps = {
  appointments: EnrichedAppointment[];
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
}) => {
  const displayedColumns = useCalendarStore(selectAppointmentDisplayedColumns);
  const columns = useAppointmentColumns();

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as AppointmentColumn),
      ),
    [columns, displayedColumns],
  );

  return <Table columns={filteredColumns} rowHeight="sm" rows={appointments} />;
};

export default memo(AppointmentTable);
