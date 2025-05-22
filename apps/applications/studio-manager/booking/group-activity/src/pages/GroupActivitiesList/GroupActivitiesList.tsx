import React, { useEffect } from "react";
import { Link } from "react-router";

import {
  Button,
  ListLayout,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";
import type { MetaActivity } from "@bsport/store-booking-group-activity";

import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import useTableColumns from "#src/hooks/useTableColumns";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Row = MetaActivity & {
  link: string;
  color: string;
};

export const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");
  const columns = useTableColumns<Row>();
  const {
    fetchGroupActivitiesPage,
    groupActivities,
    paginationProps,
    isLoading,
  } = usePaginatedGroupActivities(true);

  const getGroupActivityDetailLink = (groupActivityId: string) =>
    `/activity/${groupActivityId}/general`;

  const renderedGroupActivities = groupActivities.map((item) => ({
    ...item,
    link: getGroupActivityDetailLink(item.id.toString()),
    color: item.color,
  }));

  const { archiveModal, duplicateModal, onClickArchive, onClickDuplicate } =
    useGroupActivityModals({ fetchGroupActivitiesPage });

  useEffect(() => {
    fetchGroupActivitiesPage();
  }, [fetchGroupActivitiesPage]);

  return (
    <ListLayout>
      <ListLayout.Header
        endGroupActions={[
          <Link key="link-to-archive" to={ROUTES.ARCHIVED}>
            <Button
              iconLeft="archive"
              intent="default"
              color="main"
              size="md"
            />
          </Link>,
        ]}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("list.header.add")}
          />
        }
        pageTitle={t("list.header.groupActivities")}
        filterConfig={{
          // No working at the moment, will be using SCTs in the coming days
          fields: {
            category: {
              availableFilters: ["is", "is-not"],
              id: "category",
              label: t("list.enabled.filter.category"),
              multiSelect: false,
              values: [
                {
                  id: "yoga",
                  label: "Yoga",
                },
                {
                  id: "pilates",
                  label: "Pilates",
                },
                {
                  id: "zumba",
                  label: "Zumba",
                },
              ],
            },
          },
          filters: [
            {
              id: "is",
              label: "is",
            },
            {
              id: "is-not",
              label: "is not",
            },
          ],
          onFilterChange: function Ki() {},
          selectFieldLabel: t("list.enabled.filter.title"),
        }}
        searchConfig={{
          // No working at the moment, will be implemented in the coming days
          id: "group-activity-expandable-search",
        }}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content className="flex flex-col gap-sm">
          <Table<Row>
            id="enabled-group-activities-list"
            columns={[
              ...columns,
              {
                header: "",
                id: "actions",
                keyPath: "actions",
                type: "custom",
                render: (item) => {
                  return (
                    <div className="flex flex-row gap-sm">
                      <Button
                        iconLeft="copy-03"
                        intent="default"
                        color="main"
                        label={t("list.actions.duplicate")}
                        size="md"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickDuplicate(item.id, item.name);
                        }}
                      />
                      <Button
                        iconLeft="archive"
                        intent="default"
                        color="main"
                        label={t("list.actions.archive")}
                        size="md"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickArchive(item.id, item.name);
                        }}
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
            rows={renderedGroupActivities}
          />
          {archiveModal}
          {duplicateModal}
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};
