import type { ReactElement } from "react";

import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";
import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormIntervalSelectorProps<T> = {
  nbIntervals: number;
  fieldName: T;
  readonly?: boolean;
  className?: string;
};

export const ContractFormIntervalSelector = <
  T extends "interval" | "commitment_period_unit",
>({
  nbIntervals,
  fieldName,
  readonly,
  className,
}: ContractFormIntervalSelectorProps<T>): ReactElement => {
  const { t } = useTranslation("contract-details");

  const intervalUnitsOptions = [
    {
      id: BILLING_INTERVALS.DAY,
      label: t("intervals.day", { count: nbIntervals }),
    },
    {
      id: BILLING_INTERVALS.WEEK,
      label: t("intervals.week", { count: nbIntervals }),
    },
    {
      id: BILLING_INTERVALS.MONTH,
      label: t("intervals.month", { count: nbIntervals }),
    },
    {
      id: BILLING_INTERVALS.YEAR,
      label: t("intervals.year", { count: nbIntervals }),
    },
  ] as const;

  return (
    <FormField<ContractFormData, T, SelectProps>
      name={fieldName}
      mapProps={({ defaultProps, form }) => {
        return {
          ...defaultProps,
          value: defaultProps.value == null ? undefined : defaultProps.value,
          items: intervalUnitsOptions.map((config) => ({
            ...config,
            onClick: () =>
              form.setValue(
                fieldName as "interval" | "commitment_period_unit",
                config.id,
                {
                  shouldDirty: true,
                },
              ),
          })),
        };
      }}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select disabled={!!readonly} className={className ?? ""} />
    </FormField>
  );
};
