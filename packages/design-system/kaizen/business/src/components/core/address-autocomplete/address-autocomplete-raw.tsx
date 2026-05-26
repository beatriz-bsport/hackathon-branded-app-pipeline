import { type FC, useId, useState } from "react";

import type { AddressSuggestion } from "@bsport/api-core";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { useAddressSuggestions } from "./use-address-suggestions";

type AddressAutocompleteTextfieldProps = Omit<
  AutocompleteControlledProps["textfieldProps"],
  "id"
> & {
  id?: string;
};

export type AddressAutocompleteRawProps = {
  /** Google Maps Geocoding API key. In Studio Manager use `getRuntimeGoogleMapsApiKey()` from `@bsport/fetch`. */
  apiKey: string;
  /** Controlled selected address. Pass `null` to clear the field. */
  value?: AddressSuggestion | null;
  /** Called with the full `AddressSuggestion` on selection, or `null` when the field is cleared. */
  onChange: (address: AddressSuggestion | null) => void;
  /** Props forwarded to the inner text field (label, placeholder, required, status, …). */
  textfieldProps?: AddressAutocompleteTextfieldProps;
} & Omit<
  AutocompleteControlledProps,
  | "value"
  | "onChange"
  | "items"
  | "multiSelect"
  | "onValueChange"
  | "searchMode"
  | "textfieldProps"
>;

export const AddressAutocompleteRaw: FC<AddressAutocompleteRawProps> = ({
  apiKey,
  value,
  onChange,
  textfieldProps,
  ...restAutocompleteProps
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const textFieldId = useId();
  const [searchText, setSearchText] = useState(value?.generated_address ?? "");

  const { items, isLoading, getSuggestion } = useAddressSuggestions({
    searchText,
    apiKey,
  });

  const selectedIds = value ? [value.place_id] : [];

  const hasInput = searchText.trim().length > 0;
  const autoStatus = value ? "positive" : hasInput ? "error" : "default";
  const autoStatusText = value
    ? t("addressAutocomplete.validText")
    : hasInput
      ? t("addressAutocomplete.invalidText")
      : undefined;

  const handleChange: AutocompleteControlledProps["onChange"] = (next) => {
    if (next.length === 0) {
      onChange(null);
      return;
    }
    const suggestion = getSuggestion(next[0]);
    if (suggestion) {
      onChange(suggestion);
    }
  };

  // Editing the input after a valid selection must invalidate it: the displayed
  // text no longer matches the selected address, so clear `value`.
  const handleValueChange = (next: string) => {
    setSearchText(next);
    if (value && next !== value.generated_address) {
      onChange(null);
    }
  };

  return (
    <AutocompleteControlled
      {...restAutocompleteProps}
      value={selectedIds}
      onChange={handleChange}
      items={items}
      multiSelect={false}
      searchMode="remote"
      textfieldProps={{
        ...textfieldProps,
        id: textfieldProps?.id ?? textFieldId,
        label: textfieldProps?.label ?? t("addressAutocomplete.label"),
        placeholder:
          textfieldProps?.placeholder ?? t("addressAutocomplete.placeholder"),
        value: textfieldProps?.value ?? value?.generated_address ?? "",
        status: textfieldProps?.status ?? autoStatus,
        statusText: textfieldProps?.statusText ?? autoStatusText,
      }}
      onValueChange={handleValueChange}
      loadingProps={{ isLoading }}
    />
  );
};

AddressAutocompleteRaw.displayName = "KaizenAddressAutocomplete";
