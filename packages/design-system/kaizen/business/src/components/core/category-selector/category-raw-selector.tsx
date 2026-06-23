import { type FC, useId } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useCategoriesQuery } from "./use-categories-query";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<CategoryRawSelectorProps> = {
  popoverPlacement: "bottom-right",
  searchMode: "local",
  fullWidth: true,
  multiSelect: true,
  withChips: true,
  withSelectedInBase: true,
  className: "max-w-component-select",
  menuProps: { className: "max-h-component-select overflow-y-auto" },
  required: false,
};

export type CategoryRawSelectorProps = {
  fetch: Fetch;
  companyId: number;
  value: number[];
  onChange: (values: number[]) => void;
} & Partial<
  Omit<
    AutocompleteControlledProps,
    "value" | "onChange" | "items" | "loadingProps"
  >
> &
  Pick<
    TextFieldProps,
    "status" | "statusText" | "placeholder" | "label" | "required"
  >;

export const CategoryRawSelector: FC<CategoryRawSelectorProps> = ({
  fetch,
  companyId,
  value,
  onChange,
  textfieldProps,
  status,
  statusText,
  label,
  placeholder,
  required,
  ...autocompleteProps
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const generatedId = useId();
  const { data, isLoading } = useCategoriesQuery(fetch, companyId);

  return (
    <AutocompleteControlled
      {...DEFAULT_PROPS}
      value={value.map((id) => id.toString())}
      onChange={(next) => onChange(next.map((id) => parseInt(id, 10)))}
      items={data ?? []}
      loadingProps={{
        isLoading,
        message: t("categorySelector.loadingMessage"),
      }}
      {...autocompleteProps}
      textfieldProps={{
        id: `${generatedId}-textfield`,
        placeholder: placeholder ?? t("categorySelector.placeholder"),
        label: label ?? t("categorySelector.label"),
        iconRight: "chevron-down",
        required,
        status,
        statusText: statusText ?? t("categorySelector.helperText"),
        ...textfieldProps,
      }}
    />
  );
};

CategoryRawSelector.displayName = "KaizenCategoryRawSelector";
