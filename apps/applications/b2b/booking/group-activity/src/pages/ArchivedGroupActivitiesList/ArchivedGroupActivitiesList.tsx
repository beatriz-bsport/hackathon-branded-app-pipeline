import React, { useEffect, useMemo } from "react";
import { ListLayout, List, Title, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

import type { ListItemProps } from "@bsport/kaizen-primitive-core/dist/components/List/Item";

import { GROUP_ACTIVITIES_PATH } from "#src/constants";
import EmptyIllustration from "#src/components/EmptyIllustration";
import { unarchiveGroupActivity } from "@bsport/store-booking-group-activity";

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

  const handleUnarchiveGroupActivity = (groupActivityId: number) => () => {
    if (!groupActivityId) return;
    unarchiveGroupActivity(fetch, groupActivityId.toString()).then(() => {
      fetchData(currentPage, rowsPerPage);
    });
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
    <ListLayout className="w-full">
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
          {renderedArchivedGroupActivities.length ? (
            <List
              id="archived-group-activities-list"
              items={renderedArchivedGroupActivities}
              className="w-full"
              paginationProps={paginationProps}
            />
          ) : (
            <div className="flex flex-col gap-sm w-full items-center justify-center">
              <EmptyIllustration />
              <Title
                htmlVariant="h3"
                color="weak"
                weight="strong"
                className="max-w-[16rem] text-center"
              >
                {t("list.archived.emptyState.title")}
              </Title>
            </div>
          )}
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};

export default ArchivedGroupActivitiesList;
