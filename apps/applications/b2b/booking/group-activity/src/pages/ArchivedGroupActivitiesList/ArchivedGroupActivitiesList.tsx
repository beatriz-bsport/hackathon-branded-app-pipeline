import React, { useEffect, useMemo } from "react";
import { ListLayout, List, Loader, toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

import type { ListItemProps } from "@bsport/kaizen-primitive-core/dist/components/List/Item";

import { GROUP_ACTIVITIES_PATH } from "#src/constants";
import {
  unarchiveGroupActivity,
  archiveGroupActivity,
} from "@bsport/store-booking-group-activity";

import fetch from "#src/utils/fetch";

const ArchivedGroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

  const {
    currentPage,
    fetchData,
    groupActivities,
    paginationProps,
    rowsPerPage,
    isLoading,
  } = usePaginatedGroupActivities(false);

  const revertUnarchiveGroupActivity = (groupActivityId: number) => () => {
    archiveGroupActivity(fetch, groupActivityId.toString()).then((response) => {
      response.fold(
        () => fetchData(currentPage, rowsPerPage),
        (error) => console.error(error),
      );
    });
  };

  const handleUnarchiveGroupActivity = (groupActivityId: number) => () => {
    if (!groupActivityId) return;
    unarchiveGroupActivity(fetch, groupActivityId.toString()).then(
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
            fetchData(currentPage, rowsPerPage);
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
    fetchData(currentPage, rowsPerPage);
  }, [fetchData]);

  return (
    <ListLayout>
      <ListLayout.Header
        breadcrumbsItems={[
          {
            id: "breadcrumb-item-group-activities",
            text: t("list.header.groupActivities"),
            href: GROUP_ACTIVITIES_PATH,
          },
        ]}
        pageTitle={t("list.header.archivedGroupActivities")}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content className="hide-scrollbar w-full h-full">
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
