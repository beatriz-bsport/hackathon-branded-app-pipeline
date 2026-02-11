import { useEffect, useMemo, useState } from "react";

import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

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
    onNavigate?.(notificationEventToNavigate?.id || 0);
    setSelectedMarketingNotification(notificationEventToNavigate || null);
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
