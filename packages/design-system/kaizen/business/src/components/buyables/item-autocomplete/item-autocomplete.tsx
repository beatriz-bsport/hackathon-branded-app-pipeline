import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import type { Fetch } from "@bsport/fetch";
import {
  Autocomplete,
  type AutocompleteProps,
  Button,
  type VariantProps,
  cva,
} from "@bsport/kaizen-primitive-core";

import { INVOICE_ITEMS_KINDS } from "#src/components/buyables/item-type-selector";
import { i18nInstance, useTranslation } from "#src/i18n";

import { getItemUrl } from "./get-item-url";
import { useAutocompleteItems } from "./use-autocomplete-items";

// Exclude subscription type from ItemAutocomplete - TODO in a next iteration

const { subscription: _, ...ITEM_AUTOCOMPLETE_ITEM_KINDS } =
  INVOICE_ITEMS_KINDS;
export { ITEM_AUTOCOMPLETE_ITEM_KINDS };

export type ItemAutocompleteItemKind =
  keyof typeof ITEM_AUTOCOMPLETE_ITEM_KINDS;

const defaultClasses = ["flex", "flex-col", "gap-sm"] as const;

const variants = {
  fullWidth: {
    true: ["w-full"],
    false: [],
  },
} as const;

const itemAutocomplete = cva(defaultClasses, { variants }) as (props?: {
  className?: string;
  fullWidth?: boolean;
}) => string;

export type ItemAutocompleteItem = {
  id: string;
  title: string;
  description?: string;
  priceLabel?: string;
  imageUrl?: string;
  taxPercent?: number;

  // TODO: Move to separate type when we know about all the item types.
  // Pass-specific fields.
  credits?: number | null;
  durationDays?: number | null;
  durationMonths?: number | null;
  durationYears?: number | null;
  validityDateRange?: { lower: string; upper: string } | null;
  startDateMethod?: number;
  // Giftcard specific fields.
  hiddenFromMemberArea?: boolean;
  expirationDays?: number | null;
  /** Custom amount giftcard: min/max in cents. */
  minAmountCts?: number | null;
  maxAmountCts?: number | null;
};

type ItemAutocompleteTextfieldProps = Omit<
  AutocompleteProps["textfieldProps"],
  "id"
> & {
  id?: string;
};

export type ItemAutocompleteProps = VariantProps<typeof itemAutocomplete> & {
  className?: string;
  fetch: Fetch;
  itemType: ItemAutocompleteItemKind;
  textfieldProps?: ItemAutocompleteTextfieldProps;
  selectedItemId?: string | null;
  onSelect?: (itemId: string) => void;
  onValueChange?: (value: string) => void;
} & Omit<
    AutocompleteProps,
    | "items"
    | "textfieldProps"
    | "multiSelect"
    | "onSelect"
    | "onValueChange"
    | "onClear"
  >;

export const ItemAutocomplete: React.FC<ItemAutocompleteProps> = ({
  className,
  fetch,
  itemType,
  textfieldProps,
  fullWidth = true,
  selectedItemId: selectedItemIdProp,
  onSelect: onSelectProp,
  onValueChange: onValueChangeProp,
  ...restAutocompleteProps
}: ItemAutocompleteProps) => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  const textFieldId = useId();
  const [searchValue, setSearchValue] = useState("");
  const [resetCounter, setResetCounter] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
    undefined,
  );
  const previousSelectedItemIdRef = useRef<string | undefined>(undefined);

  const { items: autocompleteItems, isLoading } = useAutocompleteItems({
    fetch,
    itemType,
    searchInput: searchValue,
  });

  const defaultSelectedIds = useMemo(
    () => (selectedItemId ? [selectedItemId] : []),
    [selectedItemId],
  );

  // Keep local selection synced with external form state.
  useEffect(() => {
    const nextSelectedItemId = selectedItemIdProp ?? undefined;
    setSelectedItemId(nextSelectedItemId);

    if (!nextSelectedItemId) {
      setSearchValue("");
    }

    if (previousSelectedItemIdRef.current && !nextSelectedItemId) {
      setResetCounter((prev) => prev + 1);
    }

    previousSelectedItemIdRef.current = nextSelectedItemId;
  }, [selectedItemIdProp]);

  // Clear selection when itemType changes
  useEffect(() => {
    setSelectedItemId(undefined);
    setSearchValue("");
  }, [itemType]);

  const showLoading = isLoading && autocompleteItems.length === 0;

  const handleClear = () => {
    setSelectedItemId(undefined);
    setSearchValue("");
    onSelectProp?.("");
    onValueChangeProp?.("");
  };

  const handleSelect = (selectedValue: string) => {
    setSelectedItemId(selectedValue);
    onSelectProp?.(selectedValue);
  };

  const handleValueChange = (value: string) => {
    setSearchValue(value);
    if (value.trim() && selectedItemId) {
      setSelectedItemId(undefined);
    }
    onValueChangeProp?.(value);
  };

  const handleOpenInNewTab = () => {
    if (selectedItemId) {
      const url = getItemUrl(itemType, selectedItemId);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={itemAutocomplete({ className, fullWidth })}>
      <div className="flex items-end gap-xs">
        <Autocomplete
          key={`${itemType}-${resetCounter}`}
          {...{
            ...restAutocompleteProps,
            items: autocompleteItems,
            textfieldProps: {
              id: textfieldProps?.id ?? textFieldId,
              ...textfieldProps,
            },
            fullWidth,
            multiSelect: false,
            searchMode: "remote",
            defaultSelectedIds,
            onValueChange: handleValueChange,
            onSelect: handleSelect,
            onClear: handleClear,
            loadingProps: { isLoading: showLoading },
          }}
        />
        {selectedItemId && (
          <Button
            kind="icon-button"
            icon="share-03"
            size="md"
            intent="default"
            color="main"
            label={t("itemAutocomplete.openItemInNewTab")}
            onClick={handleOpenInNewTab}
          />
        )}
      </div>
    </div>
  );
};

ItemAutocomplete.displayName = "KaizenItemAutocomplete";
