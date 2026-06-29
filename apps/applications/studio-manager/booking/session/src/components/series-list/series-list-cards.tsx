import { partition } from "lodash";

import {
  Body,
  Card,
  type GenericTableColumn,
  List,
  type PaginationProps,
  type UseEmptyStateProps,
  type UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";

import { type SeriesListRow } from "#src/components/series-list/series-list-columns";
import { type TFunction, useTranslation } from "#src/utils/i18n";

const SERIES_CLASS_COUNT_COLUMN_ID = "classes";

type SeriesListCardsProps = {
  columns: GenericTableColumn<SeriesListRow>[];
  emptyStateProps: UseEmptyStateProps;
  loadingProps: UseLoadingStateProps;
  paginationProps?: PaginationProps;
  rows: SeriesListRow[];
};

export const SeriesListCards = ({
  columns,
  emptyStateProps,
  loadingProps,
  paginationProps,
  rows,
}: SeriesListCardsProps) => {
  const { t } = useTranslation("series");

  return (
    <List<SeriesListCardItemData>
      id="series-mobile-list"
      className="flex flex-col gap-sm p-sm"
      items={rows.map((row) => ({
        columns,
        id: row.id.toString(),
        row,
        t,
      }))}
      ListItem={SeriesListCardItem}
      paginationProps={paginationProps}
      emptyStateProps={emptyStateProps}
      loadingProps={loadingProps}
    />
  );
};

type SeriesListCardItemData = {
  columns: GenericTableColumn<SeriesListRow>[];
  id: string;
  row: SeriesListRow;
  t: TFunction;
};

type SeriesListCardItemProps = SeriesListCardItemData & {
  isCompact?: boolean;
  isSelectable?: boolean;
  onSelect?: () => void;
  selected?: boolean;
};

const SeriesListCardItem = ({ columns, row, t }: SeriesListCardItemProps) => (
  <SeriesListCard columns={columns} row={row} t={t} />
);

type SeriesListCardProps = {
  columns: GenericTableColumn<SeriesListRow>[];
  row: SeriesListRow;
  t: TFunction;
};

const SeriesListCard = ({ columns, row, t }: SeriesListCardProps) => {
  const [[actionColumn], columnsWithoutAction] = partition(
    columns,
    (column) => column.id === "actions",
  );

  if (actionColumn && !("render" in actionColumn)) {
    throw new Error(
      "Mobile version expect the action column to use a render method",
    );
  }

  return (
    <Card
      actionable
      elevated
      selected={row.isActive}
      onClick={row.onRowClick}
      className="flex w-full p-md"
    >
      <div className="flex min-w-0 grow flex-col gap-xs">
        {columnsWithoutAction.map((column) => (
          <div key={column.id}>{renderColumnContent(column, row, t)}</div>
        ))}
      </div>
      {actionColumn ? (
        <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
          {actionColumn.render(row)}
        </div>
      ) : null}
    </Card>
  );
};

const renderColumnContent = (
  column: GenericTableColumn<SeriesListRow>,
  row: SeriesListRow,
  t: TFunction,
) => {
  if ("render" in column) {
    return column.render(row);
  }

  if (column.type === "number" && "keyPath" in column) {
    const value = Number(row[column.keyPath as keyof SeriesListRow]);

    return (
      <Body htmlVariant="p" size="md">
        {column.id === SERIES_CLASS_COUNT_COLUMN_ID
          ? t("seriesTable.mobile.classCount", { count: value })
          : value}
      </Body>
    );
  }

  if (column.type === "string" && "keyPath" in column) {
    return (
      <Body htmlVariant="p" size="md">
        {String(row[column.keyPath as keyof SeriesListRow] ?? "")}
      </Body>
    );
  }

  throw new Error(
    "Unsupported column type for mobile version of the Series list component",
  );
};
