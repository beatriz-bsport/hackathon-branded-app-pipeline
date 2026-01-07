import { useRef, useState } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is" as const;
const FILTER_IS_NOT = "isNot" as const;

export type FilterParams = {
  notification_type_included: string[]; // Union of selected notification type
  notification_type_excluded: string[]; // Union of excluded notification type
};

const notificationTypeFilters = [
  "groupActivity",
  "workshop",
  "location",
  "establishment",
  "subscription",
  "paymentPack",
  "privatePass",
  "privateService",
  "birthday",
];

export const useFilterNotificationType = () => {
  const { t } = useTranslation("marketingNotificationList");

  const [activeTagGroupIdFilters, setActiveTagGroupIdFilters] =
    useState<FilterParams>({
      notification_type_included: [],
      notification_type_excluded: [],
    });

  // ----- Handlers -----

  const handleClearFilters = () => {
    setActiveTagGroupIdFilters({
      notification_type_included: [],
      notification_type_excluded: [],
    });
    filterRef.current?.resetFilters?.();
  };

  // ----- Filter configuration -----

  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const filters = [
    { id: FILTER_IS, label: t("page.filters.operators.is") },
    { id: FILTER_IS_NOT, label: t("page.filters.operators.isNot") },
  ];

  const notificationTypeFields = {
    notificationType: {
      id: "notificationType",
      label: t("page.filters.label"),
      availableFilters: [FILTER_IS, FILTER_IS_NOT],
      values: notificationTypeFilters.map((notificationType) => ({
        id: notificationType,
        label: String(
          t(
            // @ts-expect-error: bad dynamic key management
            `page.filters.notificationTypeLabel.${notificationType}`,
          ),
        ),
      })),
      multiSelect: true,
    },
  };

  const onFilterChange = (filters: FilterElementState[]) => {
    const includedNotificationType = new Set<string>();
    const excludedNotificationType = new Set<string>();

    // Process each filter in the array
    for (const filter of filters) {
      if (filter.field === "notificationType" && filter.valueIds.length > 0) {
        // Convert tag names to IDs
        filter.valueIds.forEach((notificationType) => {
          if (filter.filter === FILTER_IS) {
            includedNotificationType.add(notificationType);
          } else if (filter.filter === FILTER_IS_NOT) {
            excludedNotificationType.add(notificationType);
          }
        });
      }
    }

    const uniqueIncluded = Array.from(includedNotificationType);
    const uniqueExcluded = Array.from(excludedNotificationType);

    setActiveTagGroupIdFilters({
      notification_type_included: uniqueIncluded,
      notification_type_excluded: uniqueExcluded,
    });
  };

  const filterConfig: FilterProps = {
    fields: notificationTypeFields,
    filters: filters,
    onFilterChange,
    selectFieldLabel: t("page.filters.label"),
  };

  return {
    handleClearFilters,
    filterConfig,
    activeFilters: activeTagGroupIdFilters,
    filterRef,
  };
};
