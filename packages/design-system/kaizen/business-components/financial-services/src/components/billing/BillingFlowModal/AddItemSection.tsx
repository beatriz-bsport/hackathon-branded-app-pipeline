import React from "react";

import {
  Body,
  Button,
  Card,
  Divider,
  TextField,
  Title,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import ItemAutocomplete from "#src/components/billing/ItemAutocomplete";
import ItemTypeSelector, {
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { UseAddItemFormReturn } from "./use-add-item-form";

// Note: Currently routes to legacy backoffice (causes page reload).
// In the future, this will route to the revamp subscription page which may use react-router.
const LEGACY_URL_SUBSCRIPTION = "/subscriptions";

export type AddItemSectionProps = {
  selectedItemType: InvoiceItemKind | null;
  onItemTypeSelect: (type: InvoiceItemKind) => void;
  addItemForm: UseAddItemFormReturn;
};

const AddItemSection: React.FC<AddItemSectionProps> = ({
  selectedItemType,
  onItemTypeSelect,
  addItemForm,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const {
    handleItemSelect,
    handleItemSearchChange,
    quantityFieldId,
    quantityDisplayValue,
    handleQuantityChange,
    priceFieldId,
    priceCts,
    handlePriceChange,
    selectedItemId,
    discountToggleId,
    applyDiscount,
    handleDiscountToggle,
    handleClear,
    quantity,
    handleAddItem,
    canAddItem,
  } = addItemForm;

  const showItemForm =
    selectedItemType !== null && selectedItemType !== "subscription";

  const handleGoToSubscriptions = () => {
    window.open(LEGACY_URL_SUBSCRIPTION, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col flex-1">
      <Title htmlVariant="h4" color="default" weight="strong">
        {t("billingFlowModal.addItem")}
      </Title>
      <div className="mt-md">
        <Card elevated={false} className="h-full">
          <div className="flex flex-col gap-md">
            <ItemTypeSelector
              label={t("itemTypeSelector.label")}
              value={selectedItemType}
              onSelect={onItemTypeSelect}
            />
            {selectedItemType === null ? null : showItemForm ? (
              <ItemAutocomplete
                itemType={selectedItemType}
                textfieldProps={{
                  label: t("billingFlowModal.searchItem"),
                  placeholder: t("billingFlowModal.searchItemPlaceholder"),
                  required: true,
                }}
                onSelect={handleItemSelect}
                onValueChange={handleItemSearchChange}
              />
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
                {selectedItemType !== "giftcard" && (
                  <TextField
                    className="w-[104px]"
                    id={quantityFieldId}
                    label={t("billingFlowModal.quantity")}
                    type="number"
                    value={quantityDisplayValue}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min={1}
                    required
                  />
                )}
                <TextField
                  className="w-[104px]"
                  id={priceFieldId}
                  label={t("billingFlowModal.price")}
                  type="number"
                  value={(priceCts / 100).toFixed(2)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  disabled={!selectedItemId}
                />

                <Toggle
                  id={discountToggleId}
                  label={t("billingFlowModal.applyDiscount")}
                  checked={applyDiscount}
                  onToggleChange={handleDiscountToggle}
                  disabled={true} // TODO: Implement discount logic
                />

                <Divider weight="thin" />

                <div className="flex justify-end gap-sm">
                  <Button
                    kind="default"
                    intent="flat"
                    color="default"
                    size="md"
                    label={t("billingFlowModal.clear")}
                    onClick={handleClear}
                    disabled={!selectedItemId && quantity === 1}
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
                    disabled={!canAddItem}
                    data-testid="billing-flow-add-item-button"
                  />
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddItemSection;
