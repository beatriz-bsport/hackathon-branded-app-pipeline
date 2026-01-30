import { useEffect, useId, useState } from "react";

import { type ItemAutocompleteItem } from "#src/components/billing/ItemAutocomplete";
import { useSearchItems } from "#src/components/billing/ItemAutocomplete/use-search-items";
import {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type AddedItem = {
  type: InvoiceItemKind;
  buyableItemId: number;
  quantity: number;
  priceCts: number;
  discountPercent: number;
  discountAmountCts: number;
  activationDate: null;
  billingDetail: null;
  itemName: string;
  // Tax information (as percentage, e.g., 20.4 means 20.4%)
  taxPercent?: number;
  // Pass-specific fields
  credits?: number | null;
  durationDays?: number | null;
  durationMonths?: number | null;
  durationYears?: number | null;
  validityDateRange?: { lower: string; upper: string } | null;
};

export type UseAddItemFormReturn = {
  // State
  selectedItemId: string | null;
  quantity: number | null; // null when field is empty
  quantityDisplayValue: string; // String value for the input field
  priceCts: number;
  applyDiscount: boolean;
  itemSearchValue: string;
  searchItems: ItemAutocompleteItem[];

  // Field IDs
  quantityFieldId: string;
  priceFieldId: string;
  discountToggleId: string;

  // Handlers
  handleItemSelect: (itemId: string) => void;
  handleItemSearchChange: (value: string) => void;
  handleQuantityChange: (value: string) => void;
  handlePriceChange: (value: string) => void;
  handleDiscountToggle: (checked: boolean) => void;
  handleClear: () => void;
  handleAddItem: () => void;
  resetForm: () => void;

  // Computed
  canAddItem: boolean;
};

export const useAddItemForm = ({
  selectedItemType,
  onItemTypeReset,
  onItemAdded,
}: {
  selectedItemType: InvoiceItemKind | null;
  onItemTypeReset?: () => void;
  onItemAdded?: (item: AddedItem) => void;
}): UseAddItemFormReturn => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemPriceCts, setSelectedItemPriceCts] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [quantityDisplayValue, setQuantityDisplayValue] = useState<string>("1");
  const [priceCts, setPriceCts] = useState<number>(0);
  const [applyDiscount, setApplyDiscount] = useState<boolean>(false);
  const [itemSearchValue, setItemSearchValue] = useState<string>("");

  // Get items from search to access price information
  // Only search when an item type is selected (not null)
  const { data: searchItems = [] } = useSearchItems({
    itemType:
      selectedItemType === null || selectedItemType === "subscription"
        ? "pass" // Fallback, won't be used when null or subscription
        : selectedItemType,
    searchInput: itemSearchValue,
  });

  const quantityFieldId = `quantity-${useId()}`;
  const priceFieldId = `price-${useId()}`;
  const discountToggleId = `discount-${useId()}`;

  const resetForm = () => {
    setSelectedItemId(null);
    setSelectedItemPriceCts(0);
    setQuantity(1);
    setQuantityDisplayValue("1");
    setPriceCts(0);
    setApplyDiscount(false);
    setItemSearchValue("");
  };

  // Update price display when quantity or selected item changes
  // priceCts stores the unit price, not the total
  useEffect(() => {
    if (selectedItemId && selectedItemPriceCts > 0) {
      setPriceCts(selectedItemPriceCts);
    } else {
      setPriceCts(0);
    }
  }, [selectedItemId, selectedItemPriceCts]);

  // Handle item selection from ItemAutocomplete
  const handleItemSelect = (itemId: string) => {
    // Find the selected item in search results to get its price
    const selectedItem = searchItems.find(
      (item: ItemAutocompleteItem) => item.id === itemId,
    );
    let itemPriceCts = 0;
    if (selectedItem?.priceLabel) {
      // Extract price from priceLabel (format: "€XX.XX" or "XX.XX €" depending on currency)
      // TODO: Get price_cts directly from item data structure instead of parsing formatted string
      // This is a temporary solution for phase 5 - should be improved to get price_cts from API response
      // The priceLabel format varies by currency (€XX.XX vs XX.XX €), so we extract the numeric part
      const normalized = selectedItem.priceLabel
        .replace(/[^\d.,-]/g, "")
        .replace(/\s/g, "");
      const normalizedNumber =
        normalized.includes(",") && !normalized.includes(".")
          ? normalized.replace(",", ".")
          : normalized.replace(/,/g, "");
      const priceValue = Number.parseFloat(normalizedNumber);
      if (Number.isFinite(priceValue)) {
        itemPriceCts = Math.round(priceValue * 100);
      }
    }
    setSelectedItemId(itemId);
    setSelectedItemPriceCts(itemPriceCts);
  };

  // Handle search value change to update search results
  const handleItemSearchChange = (value: string) => {
    setItemSearchValue(value);
  };

  const handleQuantityChange = (value: string) => {
    // Filter out invalid characters (e, E, +, -, ., ,)
    // Only allow digits
    const filteredValue = value.replace(/[^0-9]/g, "");

    // Update display value with filtered value
    setQuantityDisplayValue(filteredValue);

    // Parse the value
    const trimmedValue = filteredValue.trim();
    if (trimmedValue === "") {
      // Allow empty value - set quantity to null
      setQuantity(null);
    } else {
      const numValue = parseInt(trimmedValue, 10);
      if (!isNaN(numValue) && numValue >= 1) {
        setQuantity(numValue);
      } else {
        // Invalid number - keep display value but set quantity to null
        setQuantity(null);
      }
    }
  };

  const handlePriceChange = (value: string) => {
    const normalized = value.trim().replace(/,/g, ".");
    if (normalized === "") {
      setPriceCts(0);
      return;
    }
    const parsedValue = parseFloat(normalized);
    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      setPriceCts(0);
      return;
    }
    setPriceCts(Math.round(parsedValue * 100));
  };

  const handleDiscountToggle = (checked: boolean) => {
    // TODO: Implement discount toggle logic
    setApplyDiscount(checked);
  };

  const handleClear = () => {
    setSelectedItemId(null);
    setSelectedItemPriceCts(0);
    setQuantity(1);
    setQuantityDisplayValue("1");
    setPriceCts(0);
    setApplyDiscount(false);
    setItemSearchValue("");
  };

  const handleAddItem = () => {
    // TODO: Add item to form items array
    if (selectedItemId && quantity !== null && quantity > 0 && priceCts >= 0) {
      const selectedItem = searchItems.find(
        (item: ItemAutocompleteItem) => item.id === selectedItemId,
      );

      // This will be implemented in a later phase
      const itemData: AddedItem = {
        type:
          selectedItemType === null
            ? INVOICE_ITEMS_KINDS.pass
            : selectedItemType,
        buyableItemId: parseInt(selectedItemId, 10),
        quantity,
        priceCts,
        discountPercent: applyDiscount ? 0 : 0, // TODO: Calculate discount
        discountAmountCts: 0, // TODO: Calculate discount
        activationDate: null,
        billingDetail: null,
        itemName:
          selectedItem?.title ||
          t("billingFlowModal.itemNameFallback", { id: selectedItemId }),
        taxPercent: selectedItem?.taxPercent ?? 0,
        credits: selectedItem?.credits ?? null,
        durationDays: selectedItem?.durationDays ?? null,
        durationMonths: selectedItem?.durationMonths ?? null,
        durationYears: selectedItem?.durationYears ?? null,
        validityDateRange: selectedItem?.validityDateRange ?? null,
      };

      // Reset the form and item type after successfully adding
      handleClear();
      onItemTypeReset?.();

      // Notify parent component about the added item
      onItemAdded?.(itemData);
    }
  };

  const canAddItem =
    selectedItemId !== null &&
    quantity !== null &&
    quantity > 0 &&
    priceCts >= 0;

  return {
    // State
    selectedItemId,
    quantity,
    quantityDisplayValue,
    priceCts,
    applyDiscount,
    itemSearchValue,
    searchItems,

    // Field IDs
    quantityFieldId,
    priceFieldId,
    discountToggleId,

    // Handlers
    handleItemSelect,
    handleItemSearchChange,
    handleQuantityChange,
    handlePriceChange,
    handleDiscountToggle,
    handleClear,
    handleAddItem,
    resetForm,

    // Computed
    canAddItem,
  };
};
