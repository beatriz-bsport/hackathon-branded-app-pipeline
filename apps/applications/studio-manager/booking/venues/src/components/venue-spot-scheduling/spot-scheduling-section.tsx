import { type FC, useMemo, useState } from "react";
import { useParams } from "react-router";

import { type RoomBlueprint } from "@bsport/api-book";
import {
  List,
  type ListItemProps,
  type PaginationProps,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DeleteRoomBlueprintModal } from "#src/components/venue-spot-scheduling/delete-room-blueprint-modal";
import { useCreateRoomBlueprint } from "#src/hooks/api/use-create-room-blueprint";
import { useRoomBlueprints } from "#src/hooks/api/use-room-blueprints";
import { useVenuesSearchQuery } from "#src/hooks/api/use-venues-search-query";
import { LEGACY_URLS } from "#src/urls";
import { type NamespacedTFunction, useTranslation } from "#src/utils/i18n";

const countSpots = (blueprint: RoomBlueprint) =>
  blueprint.canvas?.elements?.filter((element) => element.type === "spot")
    .length ?? 0;

const buildBlueprintItem = ({
  blueprint,
  t,
  onEdit,
  onDelete,
}: {
  blueprint: RoomBlueprint;
  t: NamespacedTFunction<"venues-list">;
  onEdit: (blueprint: RoomBlueprint) => void;
  onDelete: (blueprint: RoomBlueprint) => void;
}): ListItemProps => {
  const spots = countSpots(blueprint);
  const description =
    spots === 0
      ? t("detail.spotScheduling.noSpots")
      : t(
          spots === 1
            ? "detail.spotScheduling.spotCount_one"
            : "detail.spotScheduling.spotCount_other",
          { count: spots },
        );

  return {
    id: `room-blueprint-${blueprint.id}`,
    title: blueprint.name,
    description,
    onItemClick: () => onEdit(blueprint),
    buttons: [
      {
        id: `edit-${blueprint.id}`,
        kind: "default",
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "edit-02",
        label: t("detail.spotScheduling.rowMenu.edit"),
        onClick: () => onEdit(blueprint),
      },
      {
        id: `delete-${blueprint.id}`,
        kind: "default",
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "trash-01",
        label: t("detail.spotScheduling.rowMenu.delete"),
        onClick: () => onDelete(blueprint),
      },
    ],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
  };
};

const SpotSchedulingList: FC = () => {
  const { t } = useTranslation("venues-list");

  const { venueId: venueIdParam } = useParams<{ venueId: string }>();
  const venueId = Number(venueIdParam);

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: "spot-scheduling" });

  const { data } = useRoomBlueprints({
    venueId,
    page: currentPage,
    pageSize: currentPageSize,
  });

  const [blueprintToDelete, setBlueprintToDelete] =
    useState<RoomBlueprint | null>(null);

  const { data: venuesData } = useVenuesSearchQuery();
  const venue = venuesData.results.find((entry) => entry.id === venueId);

  const { mutate: createRoomBlueprint } = useCreateRoomBlueprint();

  const goToLegacyEditor = (blueprint: RoomBlueprint) =>
    window.location.assign(LEGACY_URLS.SPOT_SCHEDULING(blueprint.id));

  const handleCreate = () => {
    if (!venue) return;
    createRoomBlueprint({
      name: t("detail.spotScheduling.untitledBlueprint"),
      company: venue.related_company,
      establishment: venueId,
    });
  };

  const blueprints = data.results;
  const totalItems = data.count ?? 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      totalItems,
      onPageSettingsChange: (page, pageSize) => {
        if (pageSize !== currentPageSize) {
          setPageSettings(DEFAULT_PAGE, pageSize);
        } else {
          setPageSettings(page, pageSize);
        }
      },
    }),
    [currentPage, currentPageSize, totalItems, setPageSettings],
  );

  return (
    <>
      <List
        id="spot-scheduling-list"
        header={{
          id: "spot-scheduling-list-header",
          title: t("detail.spotScheduling.title"),
          description: t("detail.spotScheduling.subtitle"),
          buttons: [
            {
              id: "spot-scheduling-create",
              kind: "default",
              intent: "flat",
              color: "default",
              size: "md",
              iconLeft: "plus",
              label: t("detail.spotScheduling.createCta"),
              onClick: handleCreate,
            },
          ],
        }}
        items={blueprints.map((blueprint) =>
          buildBlueprintItem({
            blueprint,
            t,
            onEdit: goToLegacyEditor,
            onDelete: (blueprint) => setBlueprintToDelete(blueprint),
          }),
        )}
        paginationProps={paginationProps}
        emptyStateProps={{
          isEmpty: totalItems === 0,
          emptyConfig: {
            title: t("detail.spotScheduling.empty"),
          },
        }}
      />
      {blueprintToDelete && (
        <DeleteRoomBlueprintModal
          blueprint={blueprintToDelete}
          onClose={() => setBlueprintToDelete(null)}
        />
      )}
    </>
  );
};

export const SpotSchedulingSection: FC = () => (
  <section className="flex flex-col gap-md">
    <QueryBoundary loadingFallback={<CardLoader />}>
      <SpotSchedulingList />
    </QueryBoundary>
  </section>
);
