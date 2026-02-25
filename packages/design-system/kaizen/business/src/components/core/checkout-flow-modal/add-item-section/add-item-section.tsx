import React from "react";

import type { Fetch } from "@bsport/fetch";
import { useFormContext } from "@bsport/form";
import { Body, Button, Card, Divider, cx } from "@bsport/kaizen-primitive-core";

import type { ItemAutocompleteItem } from "#src/components/buyables/item-autocomplete";
import { useSearchItems } from "#src/components/buyables/item-autocomplete/use-search-items";
import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { useAddItemSection } from "#src/components/core/checkout-flow-modal/use-add-item-section";
import {
  getSearchItemType,
  isAddItemFormAllowedType,
} from "#src/components/core/checkout-flow-modal/utils";
import { i18nInstance, useTranslation } from "#src/i18n";

import { AddProductDiscount } from "./add-product-discount";
import { GiftcardDetails } from "./giftcard-details";
import { ItemAutocompleteField } from "./item-autocomplete-field";
import { ItemTypeSelectorField } from "./item-type-selector-field";
import { PriceField } from "./price-field";
import { QuantityField } from "./quantity-field";

// Note: Currently routes to legacy backoffice (causes page reload).
const LEGACY_URL_SUBSCRIPTION = "/subscriptions";

type AddItemSectionProps = {
  companyId: number;
  fetch: Fetch;
  onOpenSummarySection?: () => void;
};

export const AddItemSection: React.FC<AddItemSectionProps> = ({
  companyId,
  fetch,
  onOpenSummarySection,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch } = useFormContext<CheckoutFlowFormState>();

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const quantity = watch("addItemQuantity");
  const priceCts = watch("addItemPriceCts");
  const itemSearchValue = watch("addItemSearchValue");

  const { data: searchItems = [] } = useSearchItems({
    fetch,
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
            <ItemAutocompleteField fetch={fetch} />
          ) : (
            <div className="flex flex-col justify-center items-center text-center self-stretch py-xl gap-xs">
              <Body color="weak" className="max-w-[323px]">
                {t("checkoutFlowModal.subscriptionMessage")}
              </Body>
              <Button
                iconRight="share-03"
                label={t("checkoutFlowModal.goToSubscriptions")}
                size="md"
                color="main"
                intent="call-to-action"
                onClick={handleGoToSubscriptions}
                data-testid="checkout-flow-go-to-subscriptions-button"
              />
            </div>
          )}

          {showItemForm && (
            <>
              {selectedItemType !== "giftcard" && <QuantityField />}
              <PriceField />
              <AddProductDiscount />

              {selectedItemType === "giftcard" && selectedItemId && (
                <>
                  <Divider orientation="horizontal" weight="thin" />
                  <GiftcardDetails companyId={companyId} fetch={fetch} />
                </>
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
                label={t("checkoutFlowModal.clear")}
                onClick={handleClear}
                disabled={
                  !selectedItemId &&
                  quantity === 1 &&
                  (priceCts === 0 || priceCts === null)
                }
                data-testid="checkout-flow-clear-button"
              />
              <Button
                kind="default"
                intent="call-to-action"
                color="main"
                size="md"
                iconLeft="plus"
                label={t("checkoutFlowModal.addItemButton")}
                onClick={() => {
                  handleAddItem();
                  onOpenSummarySection?.();
                }}
                disabled={itemToAdd == null}
                data-testid="checkout-flow-add-item-button"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
