import type {
  Sortable,
  SortableListProps,
} from "@bsport/kaizen-primitive-core";
import type {
  CategoryOrderingData,
  TemplateOrderingData,
} from "@bsport/store-cdp-email-template";

export function reorderEmailTemplateSortableArray(
  emailTemplates: Sortable[],
): TemplateOrderingData[] {
  return emailTemplates.map((item, index) => {
    // Email template IDs are formatted to be in the following format "email-template-<templateId>"
    // That is why we split the ID by "-" and take the third part as the numeric ID.
    const idParts = item.id.split("-");
    if (idParts.length < 3) {
      throw new Error(`Invalid sortable ID format: ${item.id}`);
    }
    const itemId = parseInt(idParts[2]);
    if (isNaN(itemId)) {
      throw new Error(`Invalid numeric ID in sortable item: ${item.id}`);
    }

    return {
      id: itemId,
      ordering_in_category: index + 1,
    };
  });
}

export function reorderCategorySortableArray(
  categories: SortableListProps[],
): CategoryOrderingData[] {
  return categories.map((item, index) => {
    // Categories IDs are formatted to be in the following format "custom-email-template-list-<templateId>"
    // That is why we split the ID by "-" and take the third part as the numeric ID.
    const idParts = item.id.split("-");
    if (idParts.length < 5) {
      throw new Error(`Invalid sortable ID format: ${item.id}`);
    }
    const itemId = parseInt(idParts[4]);
    if (isNaN(itemId)) {
      throw new Error(`Invalid numeric ID in sortable item: ${item.id}`);
    }

    return {
      id: itemId,
      category_ordering: index + 1,
    };
  });
}
