import React, { useEffect, useMemo } from "react";
import { ListLayout, Button, List } from "@bsport/kaizen-primitive-core";
import { useTranslation } from "#src/utils/i18n";

import type { ListItemProps } from "@bsport/kaizen-primitive-core/dist/components/List/Item";
import type { ListItemChipsProps } from "@bsport/kaizen-primitive-core/dist/components/List";
import type { WithTooltip } from "@bsport/kaizen-primitive-core/dist/components/Tooltip";
import usePaginatedGroupActivities from "#src/hooks/usePaginatedGroupActivities";

const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");

  const {
    currentPage,
    fetchData,
    groupActivities,
    paginationProps,
    rowsPerPage,
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
        breadcrumbsItems={[
          {
            text: "Back to home",
            href: "/",
            id: "back-to-home",
          },
        ]}
        callToActionButton={
          <Button
            iconLeft="bell-03"
            intent="call-to-action"
            color="main"
            size="md"
            label="CTA Button"
          />
        }
        pageTabs={{
          tabs: [
            {
              label: "Some tab",
              icon: "user-edit",
            },
          ],
          orientation: "horizontal",
        }}
        pageTitle="Offer list example"
      />
      <ListLayout.Content className="hide-scrollbar w-full">
        <List
          id="enabled-group-activities-list"
          items={renderedGroupActivities}
          className="w-full"
          paginationProps={paginationProps}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default GroupActivitiesList;
