import { compact } from "lodash";
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router";

import {
  Button,
  List,
  ListLayout,
  Loader,
} from "@bsport/kaizen-primitive-core";
import type {
  ListItemChipsProps,
  ListItemProps,
  WithTooltip,
} from "@bsport/kaizen-primitive-core";

import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import { ROUTES } from "#src/urls";
import { TFunction, useTranslation } from "#src/utils/i18n";

const getChips = (
  hasNotification: boolean,
  isBroadcast: boolean,
  t: TFunction,
) => {
  const notificationChip: WithTooltip<ListItemChipsProps> | undefined =
    hasNotification
      ? {
          color: "default",
          label: t("list.enabled.item.notifications.title"),
          size: "lg", // Explicitly set size to "lg"
          type: "weak",
          iconLeft: "bell-ringing-04",
          tooltipProps: {
            label: t("list.enabled.item.notifications.popoverLabel"),
            placement: "bottom",
          },
          id: "group-activity-notification-chip",
        }
      : undefined;

  // Define the broadcast chip if the activity is a broadcast
  const broadcastChip: WithTooltip<ListItemChipsProps> | undefined = isBroadcast
    ? {
        color: "default",
        label: t("list.enabled.item.livestream.title"),
        size: "lg", // Explicitly set size to "lg"
        type: "weak",
        iconLeft: "video-recorder",
        tooltipProps: {
          label: t("list.enabled.item.livestream.popoverLabel"),
          placement: "bottom",
        },
        id: "group-activity-broadcast-chip",
      }
    : undefined;

  return compact([notificationChip, broadcastChip]) as WithTooltip<
    [ListItemChipsProps] | [ListItemChipsProps, ListItemChipsProps]
  >;
};

export const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

  const {
    fetchGroupActivitiesPage,
    groupActivities,
    paginationProps,
    isLoading,
  } = usePaginatedGroupActivities(true);

  const getGroupActivityDetailLink = (groupActivityId: string) =>
    `/activity/${groupActivityId}/general`;

  const { archiveModal, duplicateModal, onClickArchive, onClickDuplicate } =
    useGroupActivityModals({ fetchGroupActivitiesPage });

  const renderedGroupActivities = useMemo<ListItemProps[]>(
    () =>
      groupActivities.map(
        ({ on_booking_notification, is_broadcast, id, name }) => {
          const chips = getChips(
            on_booking_notification?.length > 0,
            is_broadcast,
            t,
          );

          return {
            id: id.toString(),
            title: name,
            chips,
            chipsDirection: "end",
            buttons: [
              {
                color: "default",
                intent: "flat",
                size: "md",
                iconLeft: "copy-03",
                tooltipProps: {
                  label: t("list.enabled.duplicate.title"),
                  placement: "bottom",
                },
                id: "group-activity-duplicate-button",
                onClick: onClickDuplicate(id, name),
              },
              {
                color: "default",
                intent: "flat",
                size: "md",
                iconLeft: "archive",
                tooltipProps: {
                  label: t("list.enabled.archive.title"),
                  placement: "bottom-right",
                },
                id: "group-activity-archive-button",
                onClick: onClickArchive(id, name),
              },
            ],
            link: getGroupActivityDetailLink(id.toString()),
          };
        },
      ),
    [groupActivities],
  );

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
        <ListLayout.Content>
          <List
            id="enabled-group-activities-list"
            items={renderedGroupActivities}
            className="w-full"
            paginationProps={paginationProps}
            emptyStateProps={{
              isEmpty: !paginationProps.totalItems,
              emptyConfig: {
                title: t("list.enabled.emptyState.title"),
              },
            }}
          />
          {archiveModal}
          {duplicateModal}
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};
