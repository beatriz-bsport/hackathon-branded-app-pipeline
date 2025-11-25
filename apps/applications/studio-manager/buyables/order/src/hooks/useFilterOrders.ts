import { useCallback, useMemo, useRef, useState } from "react";

import { ORDER_STATE_INITIALIZED } from "@bsport/common/lib/master-data/order-states";
import type { FilterProps } from "@bsport/kaizen-primitive-core";

import {
  ORDER_STATUSES,
  ORDER_STATUS_TO_I18N_KEY,
  type OrderStatus,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is" as const;

export const useFilterOrders = ({
  onFilterChange,
}: {
  onFilterChange: () => void;
}) => {
  const { t } = useTranslation(["list", "common"]);
  const [activeFilters, setActiveFilters] = useState<OrderStatus | undefined>(
    undefined,
  );

  // ----- Filter configuration -----
  const ref = useRef<{ resetFilters: () => void }>(null);

  const filterConfig: FilterProps = useMemo(() => {
    const fields = {
      "order-status": {
        id: "order-status",
        label: t("status.label", { ns: "common" }),
        availableFilters: [FILTER_IS],
        values: ORDER_STATUSES.filter(
          (orderStatus) => orderStatus !== ORDER_STATE_INITIALIZED.id,
        ).map((orderStatus) => {
          return {
            id: `${orderStatus}`,
            label: t(`status.values.${ORDER_STATUS_TO_I18N_KEY[orderStatus]}`, {
              ns: "common",
            }),
          };
        }),
        multiSelect: false,
      },
    };

    const filters = [
      {
        id: FILTER_IS,
        label: t("header.filters.operators.is", { ns: "list" }),
      },
    ];

    return {
      fields,
      filters,
      selectFieldLabel: t("status.label", { ns: "common" }),
      onFilterChange: (filters) => {
        const nonEmptyFilterField = filters.filter((value) => !!value.field);
        const nextStatus =
          nonEmptyFilterField.length > 0
            ? (Number(nonEmptyFilterField[0].valueIds[0]) as OrderStatus)
            : undefined;
        setActiveFilters(nextStatus);
        onFilterChange();
      },
      singleField: true, // If a field is already selected, then it's not possible to add another filter
    };
  }, [t, onFilterChange]);

  // ----- Handlers -----

  const handleClearFilters = useCallback(() => {
    ref.current?.resetFilters?.();
  }, []);

  return {
    filterConfig,
    filterRef: ref,
    handleClearFilters,
    activeFilters,
  };
};
