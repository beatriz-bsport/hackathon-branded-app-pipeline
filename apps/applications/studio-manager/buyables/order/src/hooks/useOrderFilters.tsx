import { useCallback, useRef, useState } from "react";

import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_ONSITEDELIVERY,
  ORDER_STATE_PAID,
  ORDER_STATE_SENT,
} from "@bsport/common/lib/master-data/order-states";
import type { FilterProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is" as const;

const statuses = [
  ORDER_STATE_PAID.id,
  ORDER_STATE_CANCELLED.id,
  ORDER_STATE_ONSITEDELIVERY.id,
  ORDER_STATE_SENT.id,
] as Array<700 | 1100 | 1200 | 9000>;

type Statuses = (typeof statuses)[number];

export const useOrderFilters = () => {
  const { t } = useTranslation(["common", "list"]);

  const [activeFilters, setActiveFilters] = useState<{
    status: Statuses | undefined;
  }>({
    status: undefined,
  });

  // ----- Filter configuration -----
  const ref = useRef<{ resetFilters: () => void }>(null);

  const filters = [
    { id: FILTER_IS, label: t("header.filters.operators.is", { ns: "list" }) },
  ];

  const fields = {
    "order-status": {
      id: "order-status",
      label: t("status.label", { ns: "common" }),
      availableFilters: [FILTER_IS],
      values: statuses.map((orderStatus) => {
        return {
          id: `${orderStatus}`,
          label: t(`status.values.${orderStatus}`, { ns: "common" }),
        };
      }),
      multiSelect: false,
    },
  };

  const filterConfig: FilterProps = {
    fields,
    filters,
    selectFieldLabel: t("status.label", { ns: "common" }),
    onFilterChange: (filters) => {
      const nonEmptyFilterField = filters.filter((value) => !!value.field);
      const nextStatus =
        nonEmptyFilterField.length > 0
          ? (Number(nonEmptyFilterField[0].valueIds[0]) as Statuses)
          : undefined;
      setActiveFilters({
        status: nextStatus,
      });
    },
    ref,
    singleField: true, // If a field is already selected, then it's not possible to add another filter
  };

  // ----- Handlers -----

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ status: undefined });
    ref.current?.resetFilters?.();
  }, []);

  return {
    filterConfig,
    handleClearFilters,
    activeFilters,
  };
};
