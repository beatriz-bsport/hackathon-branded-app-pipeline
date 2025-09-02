import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { RefinedNotificationRuleEventData } from "#src/utils/types";

import { useDrawerQueryParam } from "./use-drawer-query-params";

type UseNotificationRuleNavigationProps = {
  refinedNotificationRules: RefinedNotificationRuleEventData[];
  baseNotificationEventId?: number;
};

export const useNotificationRuleNavigation = (
  params?: UseNotificationRuleNavigationProps,
) => {
  const { refinedNotificationRules, baseNotificationEventId } = params || {
    refinedNotificationRules: [],
    baseNotificationEventId: undefined,
  };
  const navigate = useNavigate();
  const [selectedNotificationRule, setSelectedNotificationRule] =
    useState<RefinedNotificationRuleEventData | null>(null);
  const { openDrawer } = useDrawerQueryParam();

  const navigateToNotificationGroupDetails = (notificationRuleId: string) => {
    navigate(`../${notificationRuleId}`);
  };

  const mappedNotificationRulesById = useMemo(
    () =>
      new Map(
        refinedNotificationRules.map((rule) => [
          rule.rule.notification_event,
          rule,
        ]),
      ),
    [refinedNotificationRules],
  );

  // Implement maps to avoid the find() calls
  const navigateNotificationRules = ({
    direction,
  }: {
    direction: "next" | "previous";
  }) => {
    if (refinedNotificationRules?.length === 0) {
      return;
    }
    const circularListOfNotifications = refinedNotificationRules.map(
      (rule) => rule.rule.notification_event,
    );
    const currentIndex = circularListOfNotifications.findIndex(
      (notificationEventId) =>
        notificationEventId ===
        selectedNotificationRule?.rule.notification_event,
    );
    const indexDiff = direction === "next" ? 1 : -1;
    const indexToNavigate =
      (currentIndex + indexDiff + circularListOfNotifications.length) %
      circularListOfNotifications.length;
    const nextNotificationEventId =
      circularListOfNotifications[indexToNavigate];
    const notificationEventToNavigate = mappedNotificationRulesById.get(
      nextNotificationEventId,
    );
    openDrawer(notificationEventToNavigate?.rule?.notification_event || 0);
    setSelectedNotificationRule(notificationEventToNavigate || null);
  };

  useEffect(() => {
    if (selectedNotificationRule) {
      const notificationEventToOpenDetails = mappedNotificationRulesById.get(
        selectedNotificationRule.rule.notification_event,
      );
      setSelectedNotificationRule(notificationEventToOpenDetails || null);
    }
  }, [mappedNotificationRulesById]);

  useEffect(() => {
    if (baseNotificationEventId) {
      const notificationEventToOpenDetails = mappedNotificationRulesById.get(
        baseNotificationEventId,
      );
      setSelectedNotificationRule(notificationEventToOpenDetails || null);
    }
  }, [baseNotificationEventId, mappedNotificationRulesById]);

  const navigateToNextNotificationRule = () => {
    navigateNotificationRules({ direction: "next" });
  };

  const navigateToPreviousNotificationRule = () => {
    navigateNotificationRules({ direction: "previous" });
  };

  return {
    selectedNotificationRule,
    navigateToNotificationGroupDetails,
    setSelectedNotificationRule,
    navigateToNextNotificationRule,
    navigateToPreviousNotificationRule,
  };
};
