import { queryOptions, useQuery } from "@tanstack/react-query";
import first from "lodash/first";

import {
  Establishment,
  FetchEstablishmentParams,
  establishmentKeys,
  fetchEstablishments,
} from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

type FetchAllEstablishmentsParams = {
  enabled?: boolean;
  page?: number | undefined;
  page_size?: number | undefined;
  id__in?: number[] | undefined;
  disabled_establishments?: boolean;
  company?: number;
};

const fetchAllEstablishments = async ({
  company,
  page_size,
  disabled,
}: FetchEstablishmentParams): Promise<Establishment[]> => {
  // `buildUrlParams` calls `.toString()` on every value, so undefined params
  // would throw — only include the ones that are set.
  const { results } = await fetchEstablishments(fetch, {
    ...(company !== undefined && { company }),
    ...(page_size !== undefined && { page_size }),
    ...(disabled !== undefined && { disabled }),
  });
  return results;
};

export const allEstablishmentsQueryOptions = ({
  company,
  page_size,
  disabled_establishments,
  enabled,
}: FetchAllEstablishmentsParams) => {
  const params = {
    ...(company !== undefined && { company }),
    ...(page_size !== undefined && { page_size }),
    ...(disabled_establishments !== undefined && {
      disabled: disabled_establishments,
    }),
  };
  return queryOptions({
    queryKey: establishmentKeys.list(params),
    queryFn: () => fetchAllEstablishments(params),
    enabled: enabled && !!company,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

/**
 * Hook to fetch all establishments for a given company.
 * We set a high page_size to retrieve all establishments in one request and to avoid retrieving the whole database...
 * @param company - The company ID to fetch establishments for.
 * @param page_size - The number of establishments to fetch per page (default is 1000).
 * @param disabled - Filter establishments by their disabled status.
 */
export const useFetchAllEstablishments = ({
  company,
  page_size = 1000,
  disabled_establishments,
  enabled = true,
}: FetchAllEstablishmentsParams) => {
  return useQuery({
    ...allEstablishmentsQueryOptions({
      company,
      page_size,
      disabled_establishments,
      enabled,
    }),
  });
};

const establishmentQueryOptions = (id?: number) => {
  const params = { id__in: id ? [id] : [] };
  return queryOptions({
    queryKey: establishmentKeys.list(params),
    queryFn: () => fetchEstablishments(fetch, params),
    enabled: Boolean(id),
    staleTime: ESTABLISHMENTS_STALE_TIME,
    select: (establishment) => first(establishment.results),
  });
};

export const useFetchEstablishment = (id?: number) => {
  return useQuery({
    ...establishmentQueryOptions(id),
  });
};
