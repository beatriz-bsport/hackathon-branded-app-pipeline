import { useMemo } from "react";

import {
  Avatar,
  Body,
  Chip,
  type GenericTableColumn,
  Table,
  type TableProps,
} from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import type {
  ServiceSelectionLabels,
  ServiceSelectionRow,
} from "#src/components/service-selection/service-selection-types";

type ServiceSelectionTableProps = {
  emptyStateProps: TableProps<ServiceSelectionRow>["emptyStateProps"];
  id: string;
  isLoading: boolean;
  labels: ServiceSelectionLabels;
  paginationProps: TableProps<ServiceSelectionRow>["paginationProps"];
  rows: ServiceSelectionRow[];
};

export const ServiceSelectionTable = ({
  emptyStateProps,
  id,
  isLoading,
  labels,
  paginationProps,
  rows,
}: ServiceSelectionTableProps) => {
  const columns = useMemo<GenericTableColumn<ServiceSelectionRow>[]>(() => {
    const serviceColumns: GenericTableColumn<ServiceSelectionRow>[] = [
      {
        header: labels.serviceColumn,
        id: "service",
        keyPath: "service",
        type: "custom",
        render: (item) => (
          <div className="flex min-w-0 flex-row items-center gap-sm">
            <Avatar
              alt={item.alt_cover_main}
              shape="squared"
              size="lg"
              src={item.cover_main}
            />
            <Body htmlVariant="p" title={item.serviceName} className="truncate">
              {item.serviceName}
            </Body>
          </div>
        ),
      },
    ];

    if (labels.serviceTypeColumn) {
      serviceColumns.push({
        header: labels.serviceTypeColumn,
        id: "serviceType",
        keyPath: "serviceType",
        type: "string",
      });
    }

    serviceColumns.push({
      header: "",
      id: "features",
      keyPath: "features",
      type: "custom",
      align: "end",
      render: (item) =>
        item.is_broadcast ? (
          <ResponsiveTooltip
            label={labels.livestreamTooltip}
            placement="bottom-right"
          >
            <Chip
              color="default"
              size="lg"
              type="weak"
              iconLeft="video-recorder"
            />
          </ResponsiveTooltip>
        ) : null,
    });

    return serviceColumns;
  }, [
    labels.livestreamTooltip,
    labels.serviceColumn,
    labels.serviceTypeColumn,
  ]);

  return (
    <Table<ServiceSelectionRow>
      id={id}
      rowHeight="lg"
      hideHeader
      loadingProps={{
        isLoading,
        message: labels.loading,
      }}
      columns={columns}
      emptyStateProps={emptyStateProps}
      paginationProps={paginationProps}
      rows={rows}
    />
  );
};
