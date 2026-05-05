import { useQuery } from "@tanstack/react-query";

import { emailTemplateCategoriesQueryOptions } from "@bsport/api-cdp/email-template";

import { fetch } from "#src/utils/fetch";

export function useEmailTemplateCategories() {
  const query = useQuery(emailTemplateCategoriesQueryOptions(fetch));
  const categories = query.data?.results ?? [];
  const categoriesById = Object.fromEntries(
    categories.map((category) => [category.id, category]),
  ) as Record<number, (typeof categories)[number]>;

  return {
    categories,
    categoriesById,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
