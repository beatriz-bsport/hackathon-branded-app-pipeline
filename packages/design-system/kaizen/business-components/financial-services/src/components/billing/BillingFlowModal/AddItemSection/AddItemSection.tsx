import { cx } from "class-variance-authority";
import React from "react";

import { useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import {
  getSearchItemType,
  isAddItemFormAllowedType,
} from "#src/components/billing/BillingFlowModal/utils";
import type { ItemAutocompleteItem } from "#src/components/billing/ItemAutocomplete";
import { useSearchItems } from "#src/components/billing/ItemAutocomplete/use-search-items";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { AddProductDiscount } from "./AddProductDiscount";
import { GiftCardDetails } from "./GiftCardDetails";
import { ItemAutocompleteField } from "./ItemAutocompleteField";
import { ItemTypeSelectorField } from "./ItemTypeSelectorField";
import { PriceField } from "./PriceField";
import { QuantityField } from "./QuantityField";
import { useAddItemSection } from "./useAddItemSection";

// Note: Currently routes to legacy backoffice (causes page reload).
const LEGACY_URL_SUBSCRIPTION = "/subscriptions";

/**
 * Add-item section: composes field components and section-level actions.
 * Must be rendered inside the billing flow ControlledForm.
 */
export const AddItemSection: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const quantity = watch("addItemQuantity");
  const priceCts = watch("addItemPriceCts");
  const itemSearchValue = watch("addItemSearchValue");

  const { data: searchItems = [] } = useSearchItems({
    itemType: getSearchItemType(selectedItemType),
    searchInput: itemSearchValue,
  });

  const selectedItem = searchItems.find(
    (item: ItemAutocompleteItem) => item.id === selectedItemId,
  );

  const { itemToAdd, handleAddItem, handleClear } = useAddItemSection({
    selectedItem,
  });

  const showItemForm = isAddItemFormAllowedType(selectedItemType);

  const handleGoToSubscriptions = () => {
    window.open(LEGACY_URL_SUBSCRIPTION, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col flex-1 gap-md">
      <Title htmlVariant="h4" color="default" weight="strong">
        {t("billingFlowModal.addItem")}
      </Title>
      <Card
        elevated={false}
        className={cx(
          "flex flex-col gap-md justify-between",
          selectedItemType && "h-full",
        )}
      >
        <div className="flex flex-col gap-md">
          <ItemTypeSelectorField />
          {selectedItemType === null ? null : showItemForm ? (
            <ItemAutocompleteField />
          ) : (
            <div className="flex flex-col justify-center items-center text-center self-stretch py-xl gap-xs">
              <Body color="weak" className="max-w-[323px]">
                {t("billingFlowModal.subscriptionMessage")}
              </Body>
              <Button
                iconRight="share-03"
                label={t("billingFlowModal.goToSubscriptions")}
                size="md"
                color="main"
                intent="call-to-action"
                onClick={handleGoToSubscriptions}
                data-testid="billing-flow-go-to-subscriptions-button"
              />
            </div>
          )}

          {showItemForm && (
            <>
              {selectedItemType !== "giftcard" && <QuantityField />}
              <PriceField />
              <AddProductDiscount />

              {selectedItemType === "giftcard" && selectedItemId && (
                <GiftCardDetails />
              )}
            </>
          )}
        </div>
        {showItemForm && (
          <div className="flex flex-col gap-md">
            <Divider weight="thin" />

            <div className="flex justify-end gap-sm">
              <Button
                kind="default"
                intent="flat"
                color="default"
                size="md"
                label={t("billingFlowModal.clear")}
                onClick={handleClear}
                disabled={
                  !selectedItemId &&
                  quantity === 1 &&
                  (priceCts === 0 || priceCts === null)
                }
                data-testid="billing-flow-clear-button"
              />
              <Button
                kind="default"
                intent="call-to-action"
                color="main"
                size="md"
                iconLeft="plus"
                label={t("billingFlowModal.addItemButton")}
                onClick={handleAddItem}
                disabled={itemToAdd == null}
                data-testid="billing-flow-add-item-button"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
