import React, { useEffect, useState } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useFetchItemsCategories } from "#src/hooks/useFetchItemsCategories";
import { useSearchItems } from "#src/hooks/useSearchItems";
import { ITEM_VARIANTS, type ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { useCategories, useCategoriesCount } from "#src/utils/stores-interface";

import { PackAddItemsModalContent } from "./PackAddItemsModalContent";
import { PackAddItemsSearchSection } from "./PackAddItemsSearchSection";
import { PackAddItemsSelection } from "./PackAddItemsSelection";

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
  const {
    passes,
    webshopItems,
    appointmentPasses,
    setVariantItems,
    setPreselectedItems,
    preselectedItems,
  } = useSelectedItemsContext();

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { isSearching, queryString, setQueryString } = useSearchItems({
    variant: variant,
  });

  const paginationParams = useFetchItemsCategories({
    variant,
  });
  const categoriesByVariant = useCategories();
  const categoriesCountByVariant = useCategoriesCount();

  const onClose = () => {
    handleCloseModal();
    setPreselectedItems([]);
    setQueryString("");
    setTimeout(() => setSelectedCategory(null), 100);
  };

  const onSave = () => {
    if (variant) {
      setVariantItems({
        ids: preselectedItems.map((id) => parseInt(id)).filter(Boolean),
        variant,
      });
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      switch (variant) {
        case ITEM_VARIANTS.pass:
          setPreselectedItems(passes.map((id) => String(id)));
          return;
        case ITEM_VARIANTS.appointmentPass:
          setPreselectedItems(appointmentPasses.map((id) => String(id)));
          return;
        case ITEM_VARIANTS.webshopItem:
          setPreselectedItems(webshopItems.map((id) => String(id)));
          return;
        default:
          return;
      }
    }
  }, [
    isOpen,
    variant,
    passes,
    webshopItems,
    appointmentPasses,
    setPreselectedItems,
  ]);

  if (!variant) return null;

  const categories = categoriesByVariant[variant];
  const categoriesCount = categoriesCountByVariant[variant];
  const categoriesPagination = {
    ...paginationParams,
    count: categoriesCount,
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
        onClick: onSave,
      }}
      cancelButton={{
        label: t("addItemsModal.buttons.cancel"),
        onClick: onClose,
      }}
    >
      <PackAddItemsSelection variant={variant} />

      {
        /**
         * On the CategoryList view only, show a Search TextField.
         */
        categories.length > 0 && !selectedCategory ? (
          <PackAddItemsSearchSection
            fieldIdPrefix={fieldIdPrefix}
            searchQuery={queryString}
            setSearchQuery={setQueryString}
            variant={variant}
            isSearching={isSearching}
          />
        ) : null
      }

      {
        /**
         * When a query string is defined, the SearchSection handle the
         * display of a List of items. In other cases, the ModalContent
         * handles categories and items per categories.
         */
        !queryString && (
          <PackAddItemsModalContent
            categories={categories}
            categoriesPagination={categoriesPagination}
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
