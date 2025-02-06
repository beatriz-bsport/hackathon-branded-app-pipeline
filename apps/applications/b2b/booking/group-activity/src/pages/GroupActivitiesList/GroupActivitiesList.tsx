import React, { useEffect, useMemo } from "react";
import {
  ListLayout,
  Button,
  List,
  Title,
  Body,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

import EmptyIllustration from "#src/components/EmptyIllustration";

import type { ListItemProps } from "@bsport/kaizen-primitive-core/dist/components/List/Item";
import type { ListItemChipsProps } from "@bsport/kaizen-primitive-core/dist/components/List";
import type { WithTooltip } from "@bsport/kaizen-primitive-core/dist/components/Tooltip";

import { ARCHIVED_GROUP_ACTIVITIES_PATH } from "#src/constants";

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

  const renderedGroupActivities: ListItemProps[] = useMemo(
    () =>
      groupActivities.map(
        ({ on_booking_notification, is_broadcast, id, name }) => {
          // Define the notification chip if there are booking notifications
          const notificationChip = on_booking_notification?.length
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
          const broadcastChip = is_broadcast
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

          // Determine the chips array based on the presence of notification and broadcast chips
          const chips = (() => {
            if (notificationChip && broadcastChip) {
              return [notificationChip, broadcastChip];
            }
            if (notificationChip) return [notificationChip];
            if (broadcastChip) return [broadcastChip];
            return [];
          })() as WithTooltip<
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
    <ListLayout className="w-full">
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
          {renderedGroupActivities.length ? (
            <List
              id="enabled-group-activities-list"
              items={renderedGroupActivities}
              className="w-full"
              paginationProps={paginationProps}
            />
          ) : (
            <div className="flex flex-col gap-sm w-full items-center justify-center">
              <div className="flex flex-col gap-xs items-center">
                <EmptyIllustration />
                <Title htmlVariant="h3" color="weak" weight="strong">
                  {t("list.enabled.emptyState.title")}
                </Title>
                <Body
                  htmlVariant="p"
                  weight="weak"
                  color="weak"
                  size="lg"
                  className="max-w-xs text-center"
                >
                  {t("list.enabled.emptyState.body")}
                </Body>
              </div>
              <Button
                iconLeft="plus"
                intent="call-to-action"
                color="main"
                size="md"
                label={t("list.header.add")}
              />
            </div>
          )}
        </ListLayout.Content>
      )}
    </ListLayout>
  );
};

export default GroupActivitiesList;
