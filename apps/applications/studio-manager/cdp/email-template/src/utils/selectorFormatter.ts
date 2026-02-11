import { SelectProps } from "@bsport/kaizen-primitive-core";
import { EmailTemplateCategory } from "@bsport/store-cdp-email-template";

export function formatCategoriesForSelector(
  categories: EmailTemplateCategory[],
): SelectProps["items"] {
  return categories.map((category) => ({
    id: category.id.toString(),
    label: category.name,
    value: category.id.toString(),
  }));
}

export function getSelectedCategoryId(
  categories: EmailTemplateCategory[],
  selectedCategory: string | null,
): number | null {
  if (!selectedCategory) return null;
  const category = categories.find((cat) => cat.name === selectedCategory);
  return category ? category.id : null;
}
