import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchZoomAppAPI, zoomAppKeys } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const ZOOM_APP_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchZoomApp = fetchZoomAppAPI.bind(null, fetch);

const zoomAppQueryOptions = (companyId?: number) => {
  return queryOptions({
    queryKey: zoomAppKeys.byCompany(companyId!),
    queryFn: () => fetchZoomApp(companyId!),
    enabled: !!companyId,
    staleTime: ZOOM_APP_STALE_TIME,
  });
};

export const useFetchZoomApp = (companyId?: number) => {
  return useQuery({
    ...zoomAppQueryOptions(companyId),
  });
};
