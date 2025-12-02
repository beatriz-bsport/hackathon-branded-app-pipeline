import { useEffect } from "react";

import {
  fetchEmailTemplateCategoriesAction,
  selectAllCategoriesMappedById,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchEmailTemplateCategories = fetchEmailTemplateCategoriesAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching email template categories from the system.
 *
 * This hook retrieves all available email template categories. It manages the loading
 * state and automatically fetches the categories on mount.
 *
 * @returns Object containing loading state, fetch function, and email template categories from the store
 */
export function useFetchEmailTemplateCategories() {
  const [{ isLoading }, fetchEmailTemplateCategories] = useAsync<
    typeof _fetchEmailTemplateCategories
  >({
    asyncFn: _fetchEmailTemplateCategories,
  });

  const emailTemplateCategoriesMappedById = useEmailTemplateStore((state) =>
    selectAllCategoriesMappedById(state),
  );

  useEffect(() => {
    fetchEmailTemplateCategories({
      page: 1,
    });
  }, [fetchEmailTemplateCategories]);

  return {
    isLoading,
    emailTemplateCategoriesMappedById,
    fetchEmailTemplateCategories,
  };
}
