import { clsx } from "clsx";
import { type FC, useId } from "react";

import {
  Body,
  Button,
  Card,
  DropdownMenu,
  Title,
} from "@bsport/kaizen-primitive-core";

import { PackAddItemsModal } from "#src/components/PackAddItemsModal";
import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useAddItemsModal } from "#src/hooks/useAddItemsModal";
import { ITEM_VARIANTS, type ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type { FormattedData } from "#src/utils/stores-interface";

import { PackFormContentItems } from "./PackFormContentItems";

type PackFormContentProps = {
  fieldIdPrefix: string;
  onItemClick?: (formattedData: FormattedData) => void;
  clickedItem?: FormattedData | null;
};

export const PackFormContent: FC<PackFormContentProps> = ({
  fieldIdPrefix,
  onItemClick,
  clickedItem,
}) => {
  const { t } = useTranslation("details");
  const { removeVariantItem, passes, webshopItems, appointmentPasses } =
    useSelectedItemsContext();

  const menuId = useId();

  const variantPass = {
    id: `${menuId}-${ITEM_VARIANTS.pass}`,
    label: t("formFields.packContent.buttons.addPass"),
    iconLeft: "plus" as const,
  };
  const variantAppointmentPass = {
    id: `${menuId}-${ITEM_VARIANTS.appointmentPass}`,
    label: t("formFields.packContent.buttons.addAppointmentPass"),
    iconLeft: "plus" as const,
  };
  const variantWebshopItem = {
    id: `${menuId}-${ITEM_VARIANTS.webshopItem}`,
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

  const hasSelectedItems =
    passes.length + appointmentPasses.length + webshopItems.length > 0;

  return (
    <section>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="mb-sm">
          <Title htmlVariant="h4" weight="strong" className="mb-2xs">
            {t("formFields.packContent.title")}
          </Title>
          <Body color="weak">{t("formFields.packContent.description")}</Body>
        </div>
        <DropdownMenu
          items={variantItems}
          onSelectOption={({ id, setIsPopoverOpened }) => {
            const parsedId = id.slice(menuId.length + 1);
            setSelectedVariant(parsedId as ItemVariant);
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
      </div>
      <Card
        padding="none"
        className={clsx({
          "border-onsurface-status-critical-weak border-stroke-regular":
            !hasSelectedItems,
        })}
      >
        <PackFormContentItems
          appointmentPasses={appointmentPasses}
          passes={passes}
          removeVariantItem={removeVariantItem}
          webshopItems={webshopItems}
          onItemClick={onItemClick}
          clickedItem={clickedItem}
        />
      </Card>
      <PackAddItemsModal
        fieldIdPrefix={fieldIdPrefix}
        handleCloseModal={closeAddItemsModal}
        isOpen={isAddItemsModalOpen}
        variant={selectedVariant}
      />
    </section>
  );
};
