import type { Sortable } from "@bsport/kaizen-primitive-core";
import type { TemplateOrderingData } from "@bsport/store-cdp-email-template";

import { useOrderTemplate } from "#src/hooks/api/use-order-template";
import { reorderEmailTemplateSortableArray } from "#src/utils/ordering";
import type { OrderingHookParams } from "#src/utils/types";

export const useEmailTemplateOrdering = (
  params?: OrderingHookParams<TemplateOrderingData>,
) => {
  const { orderTemplate } = useOrderTemplate({
    onSuccess: params?.onSuccess,
    onFailure: params?.onFailure,
  });

  const reorderEmailTemplates = (newOrder: Sortable[]): void => {
    const reorderedArray = reorderEmailTemplateSortableArray(newOrder);
    orderTemplate(reorderedArray);
  };

  return {
    reorderEmailTemplates,
  };
};
