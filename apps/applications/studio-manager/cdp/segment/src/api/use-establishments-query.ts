import { useSuspenseQuery } from "@tanstack/react-query";

import { type Establishment, fetchEstablishments } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

const ESTABLISHMENTS_PAGE_SIZE = 100;

const fetchAllEstablishments = async (): Promise<Establishment[]> => {
  const establishments: Establishment[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetchEstablishments(fetch, {
      page,
      page_size: ESTABLISHMENTS_PAGE_SIZE,
      disabled: false,
    });
    establishments.push(...response.results);
    hasNextPage = Boolean(response.next_page);
    page += 1;
  }

  return establishments;
};

export const useEstablishmentsQuery = () =>
  useSuspenseQuery({
    queryKey: smartlistQueryKeys.establishmentsKeys.all,
    queryFn: fetchAllEstablishments,
    select: (establishments) =>
      establishments
        .map((establishment) => ({
          id: establishment.id,
          name: establishment.title,
        }))
        .sort((leftEstablishment, rightEstablishment) =>
          leftEstablishment.name.localeCompare(rightEstablishment.name),
        ),
  });
