import React, { useEffect, useMemo } from "react";
import { ListLayout, List } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

import type { ListItemProps } from "@bsport/kaizen-primitive-core/dist/components/List/Item";

import { GROUP_ACTIVITIES_PATH } from "#src/constants";

const ArchivedGroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

  const {
    currentPage,
    fetchData,
    groupActivities,
    paginationProps,
    rowsPerPage,
  } = usePaginatedGroupActivities(false);

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
      <ListLayout.Content className="hide-scrollbar w-full">
        <List
          id="archived-group-activities-list"
          items={renderedArchivedGroupActivities}
          className="w-full"
          paginationProps={paginationProps}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ArchivedGroupActivitiesList;
