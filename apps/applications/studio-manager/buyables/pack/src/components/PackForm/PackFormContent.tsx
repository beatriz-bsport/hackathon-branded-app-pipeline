import React from "react";

import { Button, DropdownMenu } from "@bsport/kaizen-primitive-core";

import { PackAddItemsModal } from "#src/components/PackAddItemsModal/PackAddItemsModal";
import { useAddItemsModal } from "#src/hooks/useAddItemsModal";
import { ITEM_VARIANTS, type ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

type PackFormContentProps = {
  fieldIdPrefix: string;
};

export const PackFormContent: React.FC<PackFormContentProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  const variantPass = {
    id: ITEM_VARIANTS.pass,
    label: t("formFields.packContent.buttons.addPass"),
    iconLeft: "plus" as const,
  };
  const variantAppointmentPass = {
    id: ITEM_VARIANTS.appointmentPass,
    label: t("formFields.packContent.buttons.addAppointmentPass"),
    iconLeft: "plus" as const,
  };
  const variantWebshopItem = {
    id: ITEM_VARIANTS.webshopItem,
    label: t("formFields.packContent.buttons.addWebshopItem"),
    iconLeft: "plus" as const,
  };
  const variantItems = [
    variantPass,
    variantAppointmentPass,
    variantWebshopItem,
  ];

  const {
    isAddItemsModalOpen,
    selectedVariant,
    setSelectedVariant,
    closeAddItemsModal,
  } = useAddItemsModal();

  return (
    <>
      <DropdownMenu
        items={variantItems}
        onSelectOption={({ id, setIsPopoverOpened }) => {
          setSelectedVariant(id as ItemVariant);
          setIsPopoverOpened(false);
        }}
        placement="bottom-right"
        target={({ setIsPopoverOpened }) => (
          <Button
            id={`${fieldIdPrefix}-pack-content-add-item`}
            intent="default"
            color="main"
            size="md"
            label={t("formFields.packContent.buttons.addItem")}
            onClick={() => setIsPopoverOpened(true)}
            iconLeft="plus"
          />
        )}
      />
      <PackAddItemsModal
        fieldIdPrefix={fieldIdPrefix}
        handleCloseModal={closeAddItemsModal}
        isOpen={isAddItemsModalOpen}
        variant={selectedVariant}
      />
    </>
  );
};
