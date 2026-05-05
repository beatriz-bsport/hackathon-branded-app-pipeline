import compact from "lodash/compact";

import type { ChipProps, TooltipProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type ClassChip = ChipProps & { tooltipProps: TooltipProps };

// DUPLICATED IN apps/applications/studio-manager/booking/session/src/hooks/useGetActivityChips.tsx
const useGetClassChips = () => {
  const { t } = useTranslation("list");
  const getChips = (hasNotification: boolean, isBroadcast: boolean) => {
    const notificationChip: ClassChip | undefined = hasNotification
      ? {
          color: "default",
          label: "",
          size: "lg",
          type: "weak",
          iconLeft: "bell-ringing-04",
          id: "group-activity-notification-chip",
          tooltipProps: {
            label: t("list.table.item.features.notifications.popoverLabel"),
            placement: "bottom",
          },
        }
      : undefined;

    // Define the broadcast chip if the activity is a broadcast
    const broadcastChip: ClassChip | undefined = isBroadcast
      ? {
          color: "default",
          label: "",
          size: "lg",
          type: "weak",
          iconLeft: "video-recorder",
          id: "group-activity-broadcast-chip",
          tooltipProps: {
            label: t("list.table.item.features.livestream.popoverLabel"),
            placement: "bottom",
          },
        }
      : undefined;

    return compact([notificationChip, broadcastChip]);
  };
  return { getChips };
};

export default useGetClassChips;
