import React, { type Dispatch, type SetStateAction } from "react";

import { Breadcrumbs } from "@bsport/kaizen-primitive-core";

import {
  type Category,
  ITEM_VARIANTS,
  type ItemVariant,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { PackAddItemsCategoryList } from "./PackAddItemsCategoryList";
import { PackAddItemsList } from "./PackAddItemsList";

type PackAddItemsModalContentProps = {
  categories: Category[];
  fieldIdPrefix: string;
  selectedCategory: Category | null;
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>;
  variant: ItemVariant | null;
};

export const PackAddItemsModalContent: React.FC<
  PackAddItemsModalContentProps
> = ({
  categories,
  fieldIdPrefix,
  selectedCategory,
  setSelectedCategory,
  variant,
}) => {
  const { t } = useTranslation("details");

  if (!variant) {
    return null;
  }

  const hasCategories = categories.length > 0;

  /**
   * 3 cases, depending on categories length and selected category
   * 1/ Categories + none selected => Display the CategoryList
   * 2/ Categories + selected category => Display the Items list of this category with breadcrumbs
   * 3/ No categories => display the list directly without breadcrumbs
   */

  if (hasCategories && !selectedCategory) {
    return (
      <>
        <PackAddItemsCategoryList
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          fieldIdPrefix={fieldIdPrefix}
        />
      </>
    );
  }

  if (hasCategories && selectedCategory) {
    const variantCategoryMessageMap: Record<ItemVariant, string> = {
      [ITEM_VARIANTS.appointmentPass]: t(
        "addItemsModal.breadcrumbs.appointmentPassCategories",
      ),
      [ITEM_VARIANTS.pass]: t("addItemsModal.breadcrumbs.passCategories"),
      [ITEM_VARIANTS.webshopItem]: t(
        "addItemsModal.breadcrumbs.webshopItemCategories",
      ),
    };

    const categoryBreadcrumbs = variantCategoryMessageMap[variant] ?? "";

    return (
      <div>
        <Breadcrumbs
          breadcrumbsItems={[
            {
              id: `${fieldIdPrefix}-breadcrumb-category-list`,
              text: categoryBreadcrumbs,
              onClick: () => setSelectedCategory(null),
            },
            {
              id: `${fieldIdPrefix}-breadcrumb-category-${selectedCategory.id}`,
              text: selectedCategory.name,
            },
          ]}
        />
        <PackAddItemsList fieldIdPrefix={fieldIdPrefix} variant={variant} />
      </div>
    );
  }

  return <PackAddItemsList fieldIdPrefix={fieldIdPrefix} variant={variant} />;
};
