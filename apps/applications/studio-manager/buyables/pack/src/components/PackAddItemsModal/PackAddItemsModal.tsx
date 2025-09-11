import React, { useState } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import type { ItemVariant } from "#src/hooks/useAddItemsModal";
import { useTranslation } from "#src/utils/i18n";

import { PackAddItemsModalContent } from "./PackAddItemsModalContent";
import { PackAddItemsSearchSection } from "./PackAddItemsSearchSection";
import { FIXTURES_CATEGORIES } from "./constants";

type PackAddItemsModalProps = {
  fieldIdPrefix: string;
  handleCloseModal: () => void;
  isOpen: boolean;
  variant: ItemVariant | null;
};

export const PackAddItemsModal: React.FC<PackAddItemsModalProps> = ({
  fieldIdPrefix,
  handleCloseModal,
  isOpen,
  variant,
}) => {
  const { t } = useTranslation("details");

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const categories = variant ? FIXTURES_CATEGORIES[variant] : [];

  const onClose = () => {
    handleCloseModal();
    setTimeout(() => setSelectedCategory(null), 100);
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("addItemsModal.title")}
      onClose={onClose}
      confirmButton={{
        color: "main",
        label: t("addItemsModal.buttons.save"),
        disabled: false,
      }}
      cancelButton={{
        label: t("addItemsModal.buttons.cancel"),
        onClick: onClose,
      }}
    >
      {
        /**
         * On the CategoryList view only, show a Search TextField.
         */
        categories.length > 0 && !selectedCategory ? (
          <PackAddItemsSearchSection
            fieldIdPrefix={fieldIdPrefix}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : null
      }

      {
        /**
         * When a query string is defined, the SearchSection handle the
         * display of a List of items. In other cases, the ModalContent
         * handles categories and items per categories.
         */
        !searchQuery && (
          <PackAddItemsModalContent
            categories={categories}
            fieldIdPrefix={fieldIdPrefix}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            variant={variant}
          />
        )
      }
    </Modal>
  );
};
