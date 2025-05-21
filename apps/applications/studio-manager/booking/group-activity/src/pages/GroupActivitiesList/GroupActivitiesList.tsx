import capitalize from "lodash/capitalize";
import React, { useEffect } from "react";
import { Link } from "react-router";

import {
  Avatar,
  Button,
  Chip,
  ListLayout,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";
import { MetaActivity } from "@bsport/store-booking-group-activity";

import useGetActivityChips from "#src/hooks/useGetActivityChips";
import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");
  const { getChips } = useGetActivityChips();
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
          id: "group-activity-expandable-search",
        }}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content className="flex flex-col gap-sm">
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
                        iconLeft="copy-03"
                        intent="default"
                        color="main"
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
