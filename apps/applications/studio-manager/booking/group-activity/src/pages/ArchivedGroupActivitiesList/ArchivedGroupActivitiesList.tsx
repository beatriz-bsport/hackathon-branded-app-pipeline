import React, { useEffect, useMemo } from "react";
import { Link } from "react-router";

import {
  Breadcrumbs,
  List,
  ListLayout,
  Loader,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { ListItemProps } from "@bsport/kaizen-primitive-core";
import {
  archiveGroupActivityAction,
  unarchiveGroupActivityAction,
} from "@bsport/store-booking-group-activity";

import { GROUP_ACTIVITIES_PATH } from "#src/constants";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";
import fetch from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const ArchivedGroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

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

  const renderedArchivedGroupActivities: ListItemProps[] = useMemo(
    () =>
      groupActivities.map(({ id, name }) => ({
        id: id.toString(),
        title: name,
        buttons: [
          {
            color: "default",
            intent: "flat",
            size: "md",
            iconLeft: "unarchive",
            tooltipProps: {
              label: t("list.archived.unarchive"),
              placement: "bottom-right",
            },
            onClick: handleUnarchiveGroupActivity(id),
          },
        ],
      })),
    [groupActivities],
  );

  useEffect(() => {
    fetchGroupActivitiesPage();
  }, [fetchGroupActivitiesPage]);

  return (
    <ListLayout>
      <ListLayout.Header
        BreadcrumbsItems={[
          <Link key="to-active-group-activities" to={GROUP_ACTIVITIES_PATH}>
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
          <List
            id="archived-group-activities-list"
            items={renderedArchivedGroupActivities}
            className="w-full"
            paginationProps={paginationProps}
            emptyStateProps={{
              isEmpty: !paginationProps.totalItems,
              emptyConfig: {
                title: t("list.archived.emptyState.title"),
              },
            }}
          />
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};

export default ArchivedGroupActivitiesList;
