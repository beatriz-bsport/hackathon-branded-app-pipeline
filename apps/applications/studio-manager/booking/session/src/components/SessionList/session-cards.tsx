import React from "react";

import { Body, Card } from "@bsport/kaizen-primitive-core";

import { Columns, type EnrichedSession, type TableColumn } from "#src/types";

type SessionCardsProps = {
  columns: TableColumn[];
  rows: EnrichedSession[];
};

type SessionCardProps = {
  columns: TableColumn[];
  row: EnrichedSession;
};

export const SessionCards: React.FC<SessionCardsProps> = ({
  columns,
  rows,
}) => {
  return (
    <div className="flex flex-col gap-sm px-sm">
      {rows.map((row) => (
        <SessionCard key={row.id} columns={columns} row={row} />
      ))}
    </div>
  );
};

const SessionCard: React.FC<SessionCardProps> = ({ columns, row }) => {
  const actionColumn = columns.find((column) => column.id === Columns.ACTIONS);
  const columnsWithoutAction = columns.filter(
    (column) => column.id !== Columns.ACTIONS,
  );

  if (actionColumn && !("render" in actionColumn)) {
    throw new Error(
      "Mobile version expect the action column to use a render method",
    );
  }

  return (
    <Card className="flex w-full p-md">
      <div className="flex flex-col gap-xs grow">
        {columnsWithoutAction.map((column) => (
          <div key={column.id}>{renderColumnContent(column, row)}</div>
        ))}
      </div>
      {actionColumn && (
        <div className="shrink-0">{actionColumn.render(row)}</div>
      )}
    </Card>
  );
};

const renderColumnContent = (column: TableColumn, row: EnrichedSession) => {
  if ("render" in column) {
    return column.render(row);
  }
  if ("keyPath" in column) {
    return (
      <Body htmlVariant="p" size="md">
        {row[column.keyPath as keyof EnrichedSession]}
      </Body>
    );
  }

  throw new Error(
    "Unsupported column type for mobile version of the Session list component",
  );
};
