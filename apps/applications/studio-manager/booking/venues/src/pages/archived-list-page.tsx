import type { FC } from "react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";

import {
  Breadcrumbs,
  List,
  ListLayout,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { buildArchivedVenueListItem } from "#src/components/venues-list/archived-venue-row";
import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { useUnarchiveVenue } from "#src/hooks/api/use-unarchive-venue";
import { useVenuesListQuery } from "#src/hooks/api/use-venues-list-query";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { buildVenueGroupMap } from "#src/utils/group-venues";
import { useTranslation } from "#src/utils/i18n";

const ArchivedVenuesList: FC = () => {
  const { t } = useTranslation("venues-list");
  const { data: venuesData } = useVenuesListQuery({ archived: true });
  const { data: groupsData } = useEstablishmentGroupsQuery();
  const { mutate: unarchiveVenue } = useUnarchiveVenue();
  const navigate = useNavigate();

  const multiLoc =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

  const venues = venuesData.results;
  const groups = groupsData.results;

  const groupMap = useMemo(() => buildVenueGroupMap(groups), [groups]);

  const emptyConfig = useMemo(
    () => ({
      title: t("archived.emptyState.title"),
      subtitle: t("archived.emptyState.subtitle"),
    }),
    [t],
  );

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: venues.length === 0,
    emptyConfig,
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <List
      id="archived-venues-list"
      header={{
        id: "archived-venues-list-header",
        title: t("archived.sectionHeader", { count: venues.length }),
      }}
      items={venues.map((venue) =>
        buildArchivedVenueListItem(venue, {
          groupName: groupMap.get(venue.id)?.name,
          multiLoc,
          unarchiveLabel: t("archived.venueRow.unarchive"),
          onUnarchive: (unarchiveTarget) =>
            unarchiveVenue(unarchiveTarget.id, {
              onSuccess: () => navigate(ABSOLUTE_ROUTES.ACTIVE),
            }),
        }),
      )}
    />
  );
};

export const ArchivedListPage: FC = () => {
  const { t } = useTranslation("venues-list");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("archived.pageTitle")}
        BreadcrumbsItems={[
          <Link key="to-venues" to={ABSOLUTE_ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              text={t("archived.breadcrumbs.venues")}
              id="breadcrumb-item-venues"
            />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary loadingFallback={<CardLoader />}>
          <ArchivedVenuesList />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ArchivedListPage;
