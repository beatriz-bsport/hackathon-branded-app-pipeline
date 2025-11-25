import compact from "lodash/compact";

import type { ChipProps, WithTooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

// DUPLICATED IN apps/applications/studio-manager/booking/session/src/hooks/useGetActivityChips.tsx
const useGetActivityChips = () => {
  const { t } = useTranslation();
  const getChips = (hasNotification: boolean, isBroadcast: boolean) => {
    const notificationChip: WithTooltip<ChipProps> | undefined = hasNotification
      ? {
          color: "default",
          label: "",
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
    const broadcastChip: WithTooltip<ChipProps> | undefined = isBroadcast
      ? {
          color: "default",
          label: "",
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

    return compact([notificationChip, broadcastChip]) as Array<
      WithTooltip<ChipProps>
    >;
  };
  return { getChips };
};

export default useGetActivityChips;
