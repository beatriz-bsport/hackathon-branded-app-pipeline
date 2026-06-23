import { useMemo } from "react";

import {
  List,
  type ListItemProps,
  type ListProps,
} from "@bsport/kaizen-primitive-core";

import type {
  ServiceSelectionLabels,
  ServiceSelectionRow,
} from "#src/components/service-selection/service-selection-types";

type ServiceSelectionListProps = {
  emptyStateProps: ListProps["emptyStateProps"];
  id: string;
  isLoading: boolean;
  labels: ServiceSelectionLabels;
  paginationProps: ListProps["paginationProps"];
  rows: ServiceSelectionRow[];
};

export const ServiceSelectionList = ({
  emptyStateProps,
  id,
  isLoading,
  labels,
  paginationProps,
  rows,
}: ServiceSelectionListProps) => {
  const items = useMemo<ListItemProps[]>(
    () =>
      rows.map((service) => ({
        chips: service.is_broadcast
          ? ([
              {
                color: "default",
                iconLeft: "video-recorder",
                label: "",
                size: "lg",
                tooltipProps: {
                  label: labels.livestreamTooltip,
                  placement: "bottom",
                },
                type: "weak",
              },
            ] satisfies ListItemProps["chips"])
          : undefined,
        color: service.color,
        id: service.id.toString(),
        isActive: service.isActive,
        onItemClick: service.onRowClick,
        avatar: {
          alt: service.alt_cover_main,
          src: service.cover_main,
          shape: "squared",
          size: "lg",
        },
        title: service.serviceName,
      })),
    [labels.livestreamTooltip, rows],
  );

  return (
    <List
      id={id}
      items={items}
      loadingProps={{
        isLoading,
        message: labels.loading,
      }}
      emptyStateProps={emptyStateProps}
      paginationProps={paginationProps}
    />
  );
};
