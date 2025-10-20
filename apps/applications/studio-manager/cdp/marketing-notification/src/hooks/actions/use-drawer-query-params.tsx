import { useSearchParams } from "react-router";

import { deletePaginationQueryParams } from "@bsport/use-pagination-query-params";

export function useDrawerQueryParam(paramName = "notificationId") {
  const [searchParams, setSearchParams] = useSearchParams();

  const openId = searchParams.get(paramName);

  const openDrawer = (id: number) => {
    const locationSearchParams = window.location.search;
    const next = new URLSearchParams(locationSearchParams);
    next.set(paramName, String(id));
    setSearchParams(next, { replace: false });
  };

  const closeDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(paramName);
    setSearchParams(next, { replace: false });

    deletePaginationQueryParams(setSearchParams);
  };

  return { openId, openDrawer, closeDrawer };
}
