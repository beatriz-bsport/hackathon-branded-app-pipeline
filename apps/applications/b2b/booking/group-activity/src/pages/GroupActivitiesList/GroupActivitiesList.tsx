import React, { useEffect, useMemo } from "react";
import {
  ListLayout,
  Button,
  List,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

import type {
  ListItemProps,
  ListItemChipsProps,
  WithTooltip,
} from "@bsport/kaizen-primitive-core";

import { ARCHIVED_GROUP_ACTIVITIES_PATH } from "#src/constants";
import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { compact } from "lodash";

const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

  const {
    currentPage,
    fetchData,
    groupActivities,
    paginationProps,
    rowsPerPage,
    isLoading,
  } = usePaginatedGroupActivities(true);

  const getGroupActivityDetailLink = (groupActivityId: string) =>
    `/activity/${groupActivityId}/general`;

  const { archiveModal, duplicateModal, onClickArchive, onClickDuplicate } =
    useGroupActivityModals({ currentPage, fetchData, rowsPerPage });

  const renderedGroupActivities = useMemo<ListItemProps[]>(
    () =>
      groupActivities.map(
        ({ on_booking_notification, is_broadcast, id, name }) => {
          // Define the notification chip if there are booking notifications
          const notificationChip: WithTooltip<ListItemChipsProps> | undefined =
            on_booking_notification?.length
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
                }
              : undefined;

          // Define the broadcast chip if the activity is a broadcast
          const broadcastChip: WithTooltip<ListItemChipsProps> | undefined =
            is_broadcast
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
                }
              : undefined;

          const chips = compact([
            notificationChip,
            broadcastChip,
          ]) as WithTooltip<
            [ListItemChipsProps] | [ListItemChipsProps, ListItemChipsProps]
          >;

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
    fetchData(currentPage, rowsPerPage);
  }, [fetchData]);

  return (
    <ListLayout>
      <ListLayout.Header
        callToActionButton={
          <div className="flex gap-2xs">
            <a href={ARCHIVED_GROUP_ACTIVITIES_PATH}>
              <Button
                iconLeft="archive"
                intent="default"
                color="main"
                size="md"
              />
            </a>
            <Button
              iconLeft="plus"
              intent="call-to-action"
              color="main"
              size="md"
              label={t("list.header.add")}
            />
          </div>
        }
        pageTitle={t("list.header.groupActivities")}
      />
      {isLoading ? (
        <Loader className="w-full h-full" size="xl" />
      ) : (
        <ListLayout.Content className="hide-scrollbar w-full h-full">
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

export default GroupActivitiesList;
