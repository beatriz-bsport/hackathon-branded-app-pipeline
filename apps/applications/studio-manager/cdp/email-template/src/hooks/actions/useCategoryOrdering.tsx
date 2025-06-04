import type { SortableListProps } from "@bsport/kaizen-primitive-core";
import type { CategoryOrderingData } from "@bsport/store-cdp-email-template";

import { useOrderCategory } from "#src/hooks/api/use-order-category";
import { reorderCategorySortableArray } from "#src/utils/ordering";
import type { OrderingHookParams } from "#src/utils/types";

export const useCategoryOrdering = (
  params?: OrderingHookParams<CategoryOrderingData>,
) => {
  const { orderCategory } = useOrderCategory({
    onSuccess: params?.onSuccess,
    onFailure: params?.onFailure,
  });

  const reorderCategories = (newOrder: SortableListProps[]): void => {
    const reorderedArray = reorderCategorySortableArray(newOrder);
    orderCategory(reorderedArray);
  };

  return {
    reorderCategories,
  };
};
