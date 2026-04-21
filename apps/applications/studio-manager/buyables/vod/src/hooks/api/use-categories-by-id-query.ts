import { useQuery } from "@tanstack/react-query";

import { fetchSportCategoriesQueryOptions } from "@bsport/api-core/categories";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

export const useCategoriesByIdQuery = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  return useQuery({
    ...fetchSportCategoriesQueryOptions(fetch, { company_id: companyId }),
    enabled: Boolean(companyId),
    select: (categories): Map<number, string> =>
      new Map(
        categories.map((category) => [category.id, category.name] as const),
      ),
  });
};
