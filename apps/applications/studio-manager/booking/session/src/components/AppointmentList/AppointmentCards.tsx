import { partition } from "lodash";
import React, { useMemo } from "react";

import { Body, Card } from "@bsport/kaizen-primitive-core";

import {
  AppointmentColumn,
  type AppointmentTableColumn,
  type EnrichedAppointment,
} from "#src/types";

type AppointmentCardsProps = {
  columns: AppointmentTableColumn[];
  rows: EnrichedAppointment[];
};

type AppointmentCardProps = {
  actionColumn: AppointmentTableColumn | undefined;
  contentColumns: AppointmentTableColumn[];
  row: EnrichedAppointment;
};

export const AppointmentCards: React.FC<AppointmentCardsProps> = ({
  columns,
  rows,
}) => {
  const [actionColumn, contentColumns] = useMemo(() => {
    const [[action], rest] = partition(
      columns,
      (column) => column.id === AppointmentColumn.ACTIONS,
    );
    return [action, rest] as const;
  }, [columns]);

  return (
    <div className="flex flex-col gap-sm px-sm">
      {rows.map((row) => (
        <AppointmentCard
          key={row.id}
          actionColumn={actionColumn}
          contentColumns={contentColumns}
          row={row}
        />
      ))}
    </div>
  );
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  actionColumn,
  contentColumns,
  row,
}) => {
  return (
    <Card className="flex w-full p-md" elevated>
      <div className="flex flex-col gap-xs grow">
        {contentColumns.map((column) => (
          <div key={column.id}>{renderColumnContent(column, row)}</div>
        ))}
      </div>
      {actionColumn && "render" in actionColumn && (
        <div className="shrink-0">{actionColumn.render(row)}</div>
      )}
    </Card>
  );
};

const renderColumnContent = (
  column: AppointmentTableColumn,
  row: EnrichedAppointment,
) => {
  if ("render" in column) {
    return column.render(row);
  }
  if ("keyPath" in column) {
    return (
      <Body htmlVariant="p" size="md">
        {row[column.keyPath as keyof EnrichedAppointment] as string}
      </Body>
    );
  }
};
