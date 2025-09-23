import React, { type Dispatch, type SetStateAction } from "react";

import { List } from "@bsport/kaizen-primitive-core";

import type { Category } from "#src/utils/constants";

type PackAddItemsCategoryListProps = {
  categories: Array<Category>;
  fieldIdPrefix: string;
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>;
};

export const PackAddItemsCategoryList: React.FC<
  PackAddItemsCategoryListProps
> = ({ categories, fieldIdPrefix, setSelectedCategory }) => {
  const listId = `${fieldIdPrefix}-add-items-category-list`;

  if (categories.length === 0) return null;

  const orderedCategories = categories.slice().sort((cat1, cat2) => {
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
        isLoading: false,
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
