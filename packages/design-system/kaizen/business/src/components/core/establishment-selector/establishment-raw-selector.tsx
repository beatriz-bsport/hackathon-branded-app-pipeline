import { type FC, useMemo } from "react";

import type { Establishment } from "@bsport/api-book";
import {
  DropdownMultiSelect,
  type DropdownMultiSelectProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useEstablishmentsInfiniteQuery } from "./use-establishments-infinite-query";

type OptionProps = { name: string };

export type EstablishmentRawSelectorProps = {
  companyId: number;
  value: number[];
  onChange: (values: number[]) => void;
} & Omit<
  DropdownMultiSelectProps<OptionProps>,
  | "value"
  | "onChange"
  | "mapOptionToChip"
  | "isLoading"
  | "anchorLabel"
  | "options"
>;

type FinalOption = DropdownMultiSelectProps<OptionProps>["options"][number];

function groupEstablishmentsByAddress(establishments: Establishment[]) {
  if (!establishments.length) {
    return [];
  }

  const grouped = new Map<
    string,
    Array<{ id: string; children: string; name: string }>
  >();

  establishments.forEach((establishment) => {
    const address = establishment.location.address;
    const option = {
      id: establishment.id.toString(),
      children: establishment.title,
      name: establishment.title,
    };

    const existing = grouped.get(address);
    if (existing) {
      existing.push(option);
    } else {
      grouped.set(address, [option]);
    }
  });

  return Array.from(grouped.entries()).flatMap(([address, options], index) => {
    const groupOptions: Array<FinalOption> = [
      {
        type: "title" as const,
        id: `title-${address}`,
        children: address,
      },
      ...options.map((option) => ({ type: "item" as const, ...option })),
    ];
    if (index < grouped.size - 1) {
      groupOptions.push({
        type: "divider",
        id: `divider-${address}`,
      });
    }
    return groupOptions;
  }) satisfies DropdownMultiSelectProps<OptionProps>["options"];
}

export const EstablishmentRawSelector: FC<EstablishmentRawSelectorProps> = ({
  companyId,
  value,
  onChange,
  statusText,
  label,
  ...dropdownMultiSelectProps
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { data, isLoading } = useEstablishmentsInfiniteQuery(companyId);

  const establishmentsAsOptions = useMemo(
    () => groupEstablishmentsByAddress(data),
    [data],
  );

  const helperText = statusText || t("establishmentSelector.helperText");

  const buttonLabel =
    value.length > 0
      ? t("establishmentSelector.selected", {
          count: value.length,
        })
      : t("establishmentSelector.placeholder");

  return (
    <DropdownMultiSelect<OptionProps>
      value={value.map((id) => id.toString())}
      onChange={(values) => onChange(values.map((id) => parseInt(id, 10)))}
      statusText={helperText}
      anchorLabel={buttonLabel}
      options={establishmentsAsOptions}
      label={label ?? t("establishmentSelector.label")}
      mapOptionToChip={(option) => ({
        id: option.id,
        color: "default",
        type: "weak",
        size: "lg",
        label: option.name,
      })}
      isLoading={isLoading}
      {...dropdownMultiSelectProps}
    />
  );
};
