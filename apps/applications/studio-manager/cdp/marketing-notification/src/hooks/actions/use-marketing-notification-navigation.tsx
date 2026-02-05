import { useEffect, useMemo, useState } from "react";

import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { MARKETING_NOTIFICATION_LIST_ITEM_ID } from "#src/utils/constants";

type UseMarketingNotificationNavigationProps = {
  marketingNotification: MarketingNotification[];
  baseNotificationEventId?: number;
  onNavigate?: (notificationEventId: number) => void;
};

export const useMarketingNotificationNavigation = (
  params?: UseMarketingNotificationNavigationProps,
) => {
  const { marketingNotification, baseNotificationEventId, onNavigate } =
    params || {
      marketingNotification: [],
    };
  const [selectedMarketingNotification, setSelectedMarketingNotification] =
    useState<MarketingNotification | null>(null);

  const mappedMarketingNotificationsById = useMemo(
    () =>
      new Map(
        marketingNotification.map((notification) => [
          notification.id,
          notification,
        ]),
      ),
    [marketingNotification],
  );

  const scrollScreenIntoNavigatedTag = (tagId: number) => {
    const tagElement = document.getElementById(
      MARKETING_NOTIFICATION_LIST_ITEM_ID(tagId),
    );
    if (tagElement) {
      tagElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Implement maps to avoid the find() calls
  const navigateMarketingNotifications = ({
    direction,
  }: {
    direction: "next" | "previous";
  }) => {
    if (marketingNotification?.length === 0) {
      return;
    }
    const circularListOfNotifications = marketingNotification.map(
      (notification) => notification.id,
    );
    const currentIndex = circularListOfNotifications.findIndex(
      (notificationEventId) =>
        notificationEventId === selectedMarketingNotification?.id,
    );
    const indexDiff = direction === "next" ? 1 : -1;
    const indexToNavigate =
      (currentIndex + indexDiff + circularListOfNotifications.length) %
      circularListOfNotifications.length;
    const nextNotificationEventId =
      circularListOfNotifications[indexToNavigate];
    const notificationEventToNavigate = mappedMarketingNotificationsById.get(
      nextNotificationEventId,
    );
    if (!notificationEventToNavigate) {
      console.warn("Not able to find the next notification to navigate to.");
      return;
    }
    onNavigate?.(notificationEventToNavigate.id);
    scrollScreenIntoNavigatedTag(notificationEventToNavigate.id);
    setSelectedMarketingNotification(notificationEventToNavigate);
  };

  useEffect(() => {
    if (selectedMarketingNotification) {
      const notificationEventToOpenDetails =
        mappedMarketingNotificationsById.get(selectedMarketingNotification.id);
      setSelectedMarketingNotification(notificationEventToOpenDetails || null);
    }
  }, [mappedMarketingNotificationsById]);

  useEffect(() => {
    if (baseNotificationEventId) {
      const notificationEventToOpenDetails =
        mappedMarketingNotificationsById.get(baseNotificationEventId);
      setSelectedMarketingNotification(notificationEventToOpenDetails || null);
    }
  }, [baseNotificationEventId, mappedMarketingNotificationsById]);

  const navigateToNextMarketingNotification = () => {
    navigateMarketingNotifications({ direction: "next" });
  };

  const navigateToPreviousMarketingNotification = () => {
    navigateMarketingNotifications({ direction: "previous" });
  };

  return {
    selectedMarketingNotification,
    setSelectedMarketingNotification,
    navigateToNextMarketingNotification,
    navigateToPreviousMarketingNotification,
  };
};
