import type { FC } from "react";

import { Breadcrumbs } from "@bsport/kaizen-primitive-core";

import { useFetchItems } from "#src/hooks/useFetchItems";
import {
  type Category,
  ITEM_VARIANTS,
  type ItemVariant,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import {
  type VariantAndData,
  useItems,
  useItemsCount,
} from "#src/utils/stores-interface";

import {
  PackAddItemsCategoryList,
  type PackAddItemsCategoryListProps,
} from "./PackAddItemsCategoryList";
import { PackAddItemsList } from "./PackAddItemsList";

type PackAddItemsModalContentProps = {
  fieldIdPrefix: string;
  selectedCategory: Category | null;
  variant: ItemVariant;
} & Pick<
  PackAddItemsCategoryListProps,
  "categories" | "categoriesPagination" | "setSelectedCategory"
>;
export const PackAddItemsModalContent: FC<PackAddItemsModalContentProps> = ({
  categories,
  categoriesPagination,
  fieldIdPrefix,
  selectedCategory,
  setSelectedCategory,
  variant,
}) => {
  const { t } = useTranslation("details");

  const { isLoading, ...itemsPagination } = useFetchItems({
    variant,
    categoryId: selectedCategory?.id,
  });

  const itemsByVariant = useItems();
  const itemsCountByVariant = useItemsCount();

  const hasCategories = categories.length > 0;
  const params = { data: itemsByVariant[variant], variant } as VariantAndData;
  const listConfig = {
    ...itemsPagination,
    isLoading: itemsByVariant[variant].length === 0 && isLoading,
    total: itemsCountByVariant[variant],
  };

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
          categoriesPagination={categoriesPagination}
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
        <PackAddItemsList
          fieldIdPrefix={fieldIdPrefix}
          listConfig={listConfig}
          {...params}
        />
      </div>
    );
  }

  return (
    <PackAddItemsList
      fieldIdPrefix={fieldIdPrefix}
      listConfig={listConfig}
      {...params}
    />
  );
};
