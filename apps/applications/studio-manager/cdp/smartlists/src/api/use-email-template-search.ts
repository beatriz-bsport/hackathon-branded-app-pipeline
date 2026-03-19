import { useQuery } from "@tanstack/react-query";

import { emailTemplateSearchQueryOptions } from "./api";

/**
 * Hook to power BackendSelector with email template search.
 * Holds search results in state; searchFn updates state so the selector re-renders with new data.
 * @param searchInput - The search input to search for
 * @param id__in - The id__in to search for
 * @returns The search results and the loading state
 */
export function useEmailTemplateSearch({
  searchInput,
  id__in,
}: {
  searchInput: string;
  id__in?: string;
}) {
  const { data: queryData, isLoading } = useQuery(
    emailTemplateSearchQueryOptions({ searchInput, id__in }),
  );
  const data = queryData?.results ?? [];
  return { data, isLoading };
}
