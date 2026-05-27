import type { FC } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useActivitySelectorQueries } from "./use-activities-queries";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<ActivityRawSelectorProps> = {
  popoverPlacement: "bottom-right",
  searchMode: "remote",
  fullWidth: true,
  multiSelect: false,
  withChips: true,
  withSelectedInBase: true,
  className: "max-w-component-select",
  required: false,
};

export type ActivityRawSelectorProps = {
  id: string;
  fetch: Fetch;
  /**
   * Selected activity ids. Always an array — in single-select mode, only the
   * first element is used and the array is rewritten to `[id]` on change.
   */
  value: number[];
  onChange: (next: number[]) => void;
  /** When defined, restricts results to workshops (true) or group activities (false). */
  isWorkshop?: boolean;
  /** When false, includes archived activities. Defaults to true. */
  customerEnabled?: boolean;
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

export const ActivityRawSelector: FC<ActivityRawSelectorProps> = ({
  id,
  fetch,
  value,
  onChange,
  isWorkshop,
  customerEnabled,
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
  const { t } = useTranslation("booking", { i18n: i18nInstance });

  const { items, isLoading, onValueChange, onClear, onScroll } =
    useActivitySelectorQueries({
      fetch,
      selectedIds: value,
      isWorkshop,
      customerEnabled,
    });

  return (
    <AutocompleteControlled
      {...DEFAULT_PROPS}
      value={value.map((id) => id.toString())}
      onChange={(next) => onChange(next.map((id) => parseInt(id, 10)))}
      items={items}
      loadingProps={{
        isLoading,
        message: t("activitySelector.loadingMessage"),
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
        placeholder: placeholder ?? t("activitySelector.placeholder"),
        label: label ?? t("activitySelector.label"),
        iconRight: "chevron-down",
        required,
        status,
        statusText,
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

ActivityRawSelector.displayName = "KaizenActivityRawSelector";
