import type { FC } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useEstablishmentSelectorQueries } from "./use-establishments-queries";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<EstablishmentRawSelectorProps> = {
  popoverPlacement: "bottom-right",
  searchMode: "remote",
  fullWidth: true,
  multiSelect: true,
  withChips: true,
  withSelectedInBase: true,
  className: "max-w-component-select",
  required: false,
};

export type EstablishmentRawSelectorProps = {
  id: string;
  fetch: Fetch;
  companyId: number;
  /** Selected establishment ids. */
  value: number[];
  onChange: (next: number[]) => void;
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

export const EstablishmentRawSelector: FC<EstablishmentRawSelectorProps> = ({
  id,
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
  menuProps,
  onValueChange: consumerOnValueChange,
  onClear: consumerOnClear,
  ...autocompleteProps
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });

  const { items, isLoading, onValueChange, onClear, onScroll } =
    useEstablishmentSelectorQueries({
      fetch,
      companyId,
      selectedIds: value,
    });

  return (
    <AutocompleteControlled
      {...DEFAULT_PROPS}
      value={value.map((id) => id.toString())}
      onChange={(next) => onChange(next.map((id) => parseInt(id, 10)))}
      items={items}
      loadingProps={{
        isLoading,
        message: t("establishmentSelector.loadingMessage"),
      }}
      onValueChange={(searchValue) => {
        onValueChange(searchValue);
        consumerOnValueChange?.(searchValue);
      }}
      onClear={() => {
        onClear();
        consumerOnClear?.();
      }}
      {...autocompleteProps}
      textfieldProps={{
        id: `${id}-textfield`,
        placeholder: placeholder ?? t("establishmentSelector.placeholder"),
        label: label ?? t("establishmentSelector.label"),
        iconRight: "chevron-down",
        required,
        status,
        statusText: statusText ?? t("establishmentSelector.helperText"),
        ...textfieldProps,
      }}
      menuProps={{
        className: "max-h-component-select overflow-y-auto",
        onScroll,
        ...menuProps,
      }}
    />
  );
};

EstablishmentRawSelector.displayName = "KaizenEstablishmentRawSelector";
