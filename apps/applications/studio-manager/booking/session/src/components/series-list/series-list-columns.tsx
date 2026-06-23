import {
  Body,
  Button,
  Chip,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { CancelledSessionName } from "#src/components/SessionList/CancelledSessionName";
import { SeriesActionsMenuButton } from "#src/components/series-actions/series-actions-menu-button";
import {
  SeriesListBookingRuleInfoPopoverContent,
  SeriesListHeaderWithInfo,
} from "#src/components/series-list/series-list-header-info-popover";
import { SeriesColumn } from "#src/types";
import {
  SERIES_BOOKING_RULE_CHIP_COLORS,
  type SeriesBookingRule,
} from "#src/utils/series-booking-rule";

export type SeriesListRow = {
  available: boolean;
  bookingRule: SeriesBookingRule;
  classesCount: number;
  color?: string;
  dates: string;
  editPath: string;
  id: number;
  isActive?: boolean;
  name: string;
  onOpenCancel?: () => void;
  onOpenDuplicate: () => void;
  onOpenDetails: () => void;
  onRowClick: () => void;
};

export type SeriesListColumnLabels = {
  actions: {
    cancel: string;
    duplicate: string;
    edit: string;
    menu: string;
  };
  bookingRule: string;
  bookingRuleInfo: {
    description: string;
    fullSeriesDescription: string;
    openSeriesDescription: string;
    singleClassDescription: string;
    title: string;
  };
  cancelled: string;
  classes: string;
  details: string;
  fullSeries: string;
  name: string;
  openSeries: string;
  singleClass: string;
  dates: string;
};

type BuildSeriesListColumnsParams = {
  displayedColumns: SeriesColumn[];
  labels: SeriesListColumnLabels;
};

export const buildSeriesListColumns = ({
  displayedColumns,
  labels,
}: BuildSeriesListColumnsParams): GenericTableColumn<SeriesListRow>[] => {
  const columns: GenericTableColumn<SeriesListRow>[] = [];

  if (displayedColumns.includes(SeriesColumn.DATES)) {
    columns.push({
      header: labels.dates,
      id: "dates",
      type: "custom",
      render: (row) =>
        row.available ? (
          <Body htmlVariant="span" size="md" className="truncate">
            {row.dates}
          </Body>
        ) : (
          <Chip
            label={labels.cancelled}
            color="critical"
            type="weak"
            size="lg"
          />
        ),
    });
  }

  columns.push({
    header: labels.name,
    id: "name",
    type: "custom",
    render: (row) =>
      row.available ? (
        <Body htmlVariant="span" size="md" className="truncate">
          {row.name}
        </Body>
      ) : (
        <CancelledSessionName
          name={row.name}
          size="md"
          className="min-w-0 truncate"
        />
      ),
  });

  if (displayedColumns.includes(SeriesColumn.BOOKING_RULE)) {
    columns.push({
      header: (
        <SeriesListHeaderWithInfo
          label={labels.bookingRule}
          tooltipContent={
            <SeriesListBookingRuleInfoPopoverContent
              labels={{
                ...labels.bookingRuleInfo,
                fullSeries: labels.fullSeries,
                openSeries: labels.openSeries,
                singleClass: labels.singleClass,
              }}
            />
          }
        />
      ),
      id: "booking-rule",
      type: "custom",
      align: "center",
      render: (row) => (
        <Chip
          label={labels[row.bookingRule]}
          color={SERIES_BOOKING_RULE_CHIP_COLORS[row.bookingRule]}
          type="weak"
          size="lg"
        />
      ),
    });
  }

  if (displayedColumns.includes(SeriesColumn.CLASSES)) {
    columns.push({
      header: labels.classes,
      id: "classes",
      type: "number",
      keyPath: "classesCount",
      align: "center",
    });
  }

  columns.push(
    {
      header: null,
      id: "details",
      type: "custom",
      align: "end",
      render: (row) => (
        <Button
          label={labels.details}
          iconLeft="list-play"
          size="md"
          intent="default"
          color="main"
          onClick={(event) => {
            event.stopPropagation();
            row.onOpenDetails();
          }}
        />
      ),
    },
    {
      header: null,
      id: "actions",
      type: "custom",
      align: "end",
      render: (row) => (
        <SeriesActionsMenuButton
          editPath={row.editPath}
          labels={labels.actions}
          onCancel={row.onOpenCancel}
          onDuplicate={row.onOpenDuplicate}
        />
      ),
    },
  );

  return columns;
};
