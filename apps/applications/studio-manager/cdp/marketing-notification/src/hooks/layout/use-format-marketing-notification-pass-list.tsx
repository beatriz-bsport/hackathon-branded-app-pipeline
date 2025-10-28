import type { AppointmentPass } from "@bsport/store-buyables-appointment-pass";
import type { Pass } from "@bsport/store-buyables-pass";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useTranslation } from "#src/utils/i18n";
import { extractEntityId } from "#src/utils/marketingNotificationTriggerCondition";
import {
  checkIfNotificationIncludesAllPasses,
  extractPassListData,
} from "#src/utils/passes";
import type { PassListItemData } from "#src/utils/types";

export type PassListItem = {
  id: string;
  title: string;
  description: string;
};

/**
 * Hook for creating marketing notification passes list items.
 *
 * This hook handles all the logic for creating list items from marketing notification
 * pass data, including formatting prices, extracting pass information, and handling
 * the "all passes included" scenario. It returns formatted list items ready for display.
 *
 * @param passType - Type of passes ("appointment" or "payment")
 * @param notification - The marketing notification containing pass rules
 * @returns Array of formatted list items for display
 */
export const useFormatMarketingNotificationPassList = ({
  passType,
  notification,
}: {
  passType: "appointment" | "payment";
  notification: MarketingNotification;
}) => {
  const { t } = useTranslation("marketingNotificationDetails");
  const passIds = extractEntityId(notification);
  const allPassesIncluded = checkIfNotificationIncludesAllPasses(notification);

  const formatPassesInListItems = ({
    passesById,
    appointmentPassesById,
  }: {
    passesById: Record<number, Pass>;
    appointmentPassesById: Record<number, AppointmentPass>;
  }) => {
    const passesSource =
      passType === "appointment" ? appointmentPassesById : passesById;
    if (allPassesIncluded) {
      return [
        {
          id: "all-passes-valid",
          title: t("drawer.trigger.content.passes.allIncluded.title"),
          description: t(
            "drawer.trigger.content.passes.allIncluded.description",
          ),
        },
      ];
    }

    return passIds
      .map((passId) => {
        const currentPass = passesSource[passId];
        if (!currentPass) {
          return null;
        }

        const passData: PassListItemData = extractPassListData({
          pass: currentPass,
        });

        const passCredits = passData?.credits || 0;
        const passName = passData?.name || t("noData");
        const passPrice = passData?.price;

        return {
          id: `${passType}-pass-${passId}`,
          title: passName,
          // @ts-expect-error plural management
          description: `${t("drawer.trigger.content.passes.credits", { count: passCredits })} - ${passPrice}`,
        };
      })
      .filter((item): item is PassListItem => !!item);
  };

  return { formatPassesInListItems, passIds, allPassesIncluded };
};
