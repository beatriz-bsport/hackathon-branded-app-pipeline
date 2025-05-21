import capitalize from "lodash/capitalize";
import React, { useEffect } from "react";
import { Link } from "react-router";

import {
  Avatar,
  Breadcrumbs,
  Button,
  Chip,
  ListLayout,
  Loader,
  Table,
  toast,
} from "@bsport/kaizen-primitive-core";
import {
  MetaActivity,
  archiveGroupActivityAction,
  unarchiveGroupActivityAction,
} from "@bsport/store-booking-group-activity";

import useGetActivityChips from "#src/hooks/useGetActivityChips";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import { ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const ArchivedGroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");
  const { getChips } = useGetActivityChips();

  const {
    fetchGroupActivitiesPage,
    groupActivities,
    paginationProps,
    isLoading,
  } = usePaginatedGroupActivities(false);

  const revertUnarchiveGroupActivity = (groupActivityId: number) => () => {
    archiveGroupActivityAction(fetch, groupActivityId.toString()).then(
      (response) => {
        response.fold(fetchGroupActivitiesPage, (error) =>
          console.error(error),
        );
      },
    );
  };

  const handleUnarchiveGroupActivity = (groupActivityId: number) => () => {
    if (!groupActivityId) return;
    unarchiveGroupActivityAction(fetch, groupActivityId.toString()).then(
      (response) => {
        response.fold(
          ({ name }) => {
            toast({
              status: "default",
              icon: "unarchive",
              description: t("list.toasts.unarchive", {
                groupActivityName: name,
              }),
              duration: 5000,
              buttonLabel: t("list.toasts.undo"),
              onButtonClick: revertUnarchiveGroupActivity(groupActivityId),
            });
            fetchGroupActivitiesPage();
          },
          (error) => console.error(error),
        );
      },
    );
  };

  const renderedArchivedGroupActivities = groupActivities;

  useEffect(() => {
    fetchGroupActivitiesPage();
  }, [fetchGroupActivitiesPage]);

  return (
    <ListLayout>
      <ListLayout.Header
        BreadcrumbsItems={[
          <Link key="to-active-group-activities" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              text={t("list.header.groupActivities")}
              id="breadcrumb-item-group-activities"
            />
          </Link>,
        ]}
        pageTitle={t("list.header.archivedGroupActivities")}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content>
          <Table<MetaActivity>
            id="enabled-group-activities-list"
            columns={[
              {
                header: t("list.columns.name"),
                id: "name",
                keyPath: "name",
                type: "custom",
                render: (item) => {
                  return (
                    <div className="flex flex-row items-center gap-sm">
                      <Avatar
                        alt={item.alt_cover_main}
                        shape="squared"
                        size="md"
                        src={item.cover_main}
                      >
                        empty
                      </Avatar>
                      <div>{capitalize(item.name)}</div>
                    </div>
                  );
                },
              },
              {
                header: t("list.columns.category"),
                id: "category",
                keyPath: "category",
                type: "string",
              },
              {
                header: t("list.columns.upcomingSession"),
                id: "upcomingSession",
                keyPath: "next_slot",
                type: "datetime",
              },
              {
                header: t("list.columns.features"),
                id: "features",
                keyPath: "features",
                type: "custom",
                render: (item) => {
                  const chips = getChips(
                    item.on_booking_notification?.length > 0,
                    item.is_broadcast,
                  );
                  return (
                    <div className="flex flex-row gap-sm">
                      {chips.map((chip) => (
                        <div key={chip.id} className="flex">
                          <Chip {...chip} />
                        </div>
                      ))}
                    </div>
                  );
                },
              },
              {
                header: "",
                id: "actions",
                keyPath: "actions",
                type: "custom",
                render: (item) => {
                  return (
                    <div className="flex flex-row gap-sm">
                      <Button
                        iconLeft="unarchive"
                        intent="default"
                        color="main"
                        size="md"
                        onClick={handleUnarchiveGroupActivity(item.id)}
                      />
                    </div>
                  );
                },
              },
            ]}
            emptyStateProps={{
              isEmpty: !paginationProps.totalItems,
              emptyConfig: {
                title: t("list.enabled.emptyState.title"),
              },
            }}
            paginationProps={paginationProps}
            rows={renderedArchivedGroupActivities}
          />
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};
