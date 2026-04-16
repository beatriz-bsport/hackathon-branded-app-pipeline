import { type FC, useMemo } from "react";

import {
  DropdownMultiSelect,
  type DropdownMultiSelectProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useCategoriesQuery } from "./use-categories-query";

export type CategoryRawSelectorProps = {
  companyId: number;
  value: number[];
  onChange: (values: number[]) => void;
} & Omit<
  DropdownMultiSelectProps<{ name: string }>,
  | "value"
  | "onChange"
  | "mapOptionToChip"
  | "isLoading"
  | "anchorLabel"
  | "options"
>;

export const CategoryRawSelector: FC<CategoryRawSelectorProps> = ({
  companyId,
  value,
  onChange,
  statusText,
  label,
  ...dropdownMultiSelectProps
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { data, isLoading } = useCategoriesQuery(companyId);

  const categoriesAsOptions = useMemo(
    () =>
      (data ?? []).map((value) => {
        return {
          id: value.id.toString(),
          // for DropdownMenuItem children
          children: value.name,
          // to pass for Chup renderer
          name: value.name,
        };
      }),
    [data],
  );

  const helperText = statusText || t("categorySelector.helperText");

  const buttonLabel =
    value.length > 0
      ? t("categorySelector.selected", {
          count: value.length,
        })
      : t("categorySelector.placeholder");

  return (
    <DropdownMultiSelect<{ name: string }>
      value={value.map((id) => id.toString())}
      onChange={(values) => onChange(values.map((id) => parseInt(id, 10)))}
      statusText={helperText}
      anchorLabel={buttonLabel}
      options={categoriesAsOptions}
      label={label ?? t("categorySelector.label")}
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
