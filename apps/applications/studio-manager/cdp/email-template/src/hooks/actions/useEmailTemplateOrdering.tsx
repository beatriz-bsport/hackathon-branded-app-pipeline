import type { Sortable } from "@bsport/kaizen-primitive-core";
import type { TemplateOrderingData } from "@bsport/store-cdp-email-template";

import { useOrderTemplate } from "#src/hooks/api/use-order-template";
import { reorderEmailTemplateSortableArray } from "#src/utils/ordering";

type OrderingHookParams<T> = {
  onSuccess?: (result: T[]) => void;
  onFailure?: () => void;
};

export const useEmailTemplateOrdering = (
  props?: OrderingHookParams<TemplateOrderingData>,
) => {
  const { orderTemplate } = useOrderTemplate({
    onSuccess: props?.onSuccess,
    onFailure: props?.onFailure,
  });

  const reorderEmailTemplates = (newOrder: Sortable[]): void => {
    const reorderedArray = reorderEmailTemplateSortableArray(newOrder);
    orderTemplate(reorderedArray);
  };

  return {
    reorderEmailTemplates,
  };
};
