import React, { type Dispatch, type SetStateAction } from "react";

import { List } from "@bsport/kaizen-primitive-core";
import { DEFAULT_PAGE } from "@bsport/use-pagination-query-params";

import { type Category, NO_CATEGORY_ID } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

export type PackAddItemsCategoryListProps = {
  categories: Array<Category>;
  fieldIdPrefix: string;
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>;
  categoriesPagination: {
    page: number;
    pageSize: number;
    setPage: (nextPage: number) => void;
    setPageSize: (nextPageSize: number) => void;
    isLoading: boolean;
    count: number;
  };
};

export const PackAddItemsCategoryList: React.FC<
  PackAddItemsCategoryListProps
> = ({
  categories,
  fieldIdPrefix,
  setSelectedCategory,
  categoriesPagination,
}) => {
  const { t } = useTranslation("details");
  const listId = `${fieldIdPrefix}-add-items-category-list`;

  /** Add a "No Category" category on top of the 1st page of the list */
  const noCategoryItem = {
    id: NO_CATEGORY_ID,
    category_ordering: -10000,
    name: t("addItemsModal.noCategories"),
  };

  const displayedCategories =
    categoriesPagination.page === DEFAULT_PAGE
      ? [noCategoryItem, ...categories]
      : categories;

  const orderedCategories = displayedCategories.slice().sort((cat1, cat2) => {
    const ordering1 = cat1.category_ordering;
    const ordering2 = cat2.category_ordering;
    if (typeof ordering1 === "number" && typeof ordering2 === "number")
      return ordering1 - ordering2;
    if (typeof ordering1 === "number") return -1;
    if (typeof ordering2 === "number") return 1;
    return cat1.name.localeCompare(cat2.name);
  });

  return (
    <List
      id={listId}
      loadingProps={{
        isLoading: categoriesPagination.isLoading,
      }}
      paginationProps={{
        currentPage: categoriesPagination.page,
        rowsPerPage: categoriesPagination.pageSize,
        totalItems: categoriesPagination.count,
        onPageChange: categoriesPagination.setPage,
        onRowsPerPageChange: categoriesPagination.setPageSize,
      }}
      items={orderedCategories.map((category) => {
        const { id, name } = category;
        return {
          id: `${listId}-${id}`,
          title: name,
          onClick: () => setSelectedCategory({ id, name }),
          className: "hover:cursor-pointer text-ellipsis",
          buttons: [
            {
              id: `${listId}-${id}-arrow-button`,
              iconLeft: "arrow-right",
              color: "default",
              intent: "flat",
              size: "md",
            },
          ],
        };
      })}
    />
  );
};
