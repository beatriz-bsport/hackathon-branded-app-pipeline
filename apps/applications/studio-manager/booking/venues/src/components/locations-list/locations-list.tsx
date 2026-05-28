import { type FC, useMemo } from "react";

import { type EstablishmentGroup } from "@bsport/api-book";
import {
  Button,
  Chip,
  type GenericTableColumn,
  Table,
} from "@bsport/kaizen-primitive-core";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { useVenuesListQuery } from "#src/hooks/api/use-venues-list-query";
import { useTranslation } from "#src/utils/i18n";

type LocationsListProps = {
  searchQuery: string;
  onCreate: () => void;
  onEdit: (location: EstablishmentGroup) => void;
  onDelete: (location: EstablishmentGroup) => void;
};

const LocationsListInner: FC<LocationsListProps> = ({
  searchQuery,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation("venues-list");
  const { data: groupsData } = useEstablishmentGroupsQuery(searchQuery);
  const { data: venuesData } = useVenuesListQuery();
  const hasSearchQuery = searchQuery.trim().length > 0;

  const venueById = useMemo(
    () => new Map(venuesData.results.map((venue) => [venue.id, venue])),
    [venuesData.results],
  );

  const columns: GenericTableColumn<EstablishmentGroup>[] = useMemo(
    () => [
      {
        id: "name",
        header: t("locations.columns.name"),
        type: "string",
        keyPath: "name",
        align: "start",
      },
      {
        id: "establishments",
        header: t("locations.columns.venues"),
        type: "custom",
        align: "start",
        render: (location) => (
          <div className="flex flex-wrap items-center gap-2xs">
            {location.establishment.map((venueId) => {
              const venue = venueById.get(venueId);
              return venue ? (
                <Chip
                  key={venueId}
                  label={venue.title}
                  type="weak"
                  color="default"
                  size="lg"
                  iconLeft="building-02"
                />
              ) : null;
            })}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        type: "custom",
        align: "end",
        render: (location) => (
          <div className="flex items-center gap-xs">
            <Button
              kind="icon-button"
              icon="edit-02"
              intent="flat"
              color="default"
              size="md"
              label={t("locations.actions.edit")}
              onClick={() => onEdit(location)}
            />
            <Button
              kind="icon-button"
              icon="trash-01"
              intent="flat"
              color="critical"
              size="md"
              label={t("locations.actions.delete")}
              onClick={() => onDelete(location)}
            />
          </div>
        ),
      },
    ],
    [t, venueById, onEdit, onDelete],
  );

  return (
    <Table
      columns={columns}
      rows={groupsData.results}
      rowHeight="sm"
      emptyStateProps={{
        isEmpty: groupsData.results.length === 0,
        emptyConfig: hasSearchQuery
          ? { title: t("locations.emptyState.noResults") }
          : {
              title: t("locations.emptyState.title"),
              subtitle: t("locations.emptyState.subtitle"),
              ctaButtonConfig: {
                iconLeft: "plus",
                label: t("locations.emptyState.cta"),
                onClick: onCreate,
              },
            },
      }}
    />
  );
};

export const LocationsList: FC<LocationsListProps> = ({
  searchQuery,
  onCreate,
  onEdit,
  onDelete,
}) => (
  <QueryBoundary loadingFallback={<CardLoader />}>
    <LocationsListInner
      searchQuery={searchQuery}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </QueryBoundary>
);
