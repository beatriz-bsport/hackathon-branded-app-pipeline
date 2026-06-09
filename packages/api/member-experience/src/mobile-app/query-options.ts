import { queryOptions } from "@tanstack/react-query";

import { Fetch } from "@bsport/store-base";

import { fetchPopupDetailAPI, fetchPopupImageAPI, mobileAppKeys } from "./api";
import { Popup, PopupImageQueryOptionsParams } from "./types";

export const popupDetailQueryOptions = (fetch: Fetch<Popup>, popupId: number) =>
  queryOptions({
    queryKey: mobileAppKeys.popupDetail(popupId),
    queryFn: () => fetchPopupDetailAPI(fetch, popupId),
  });

export const popupImageQueryOptions = (
  fetch: Fetch<Blob>,
  params: PopupImageQueryOptionsParams,
) =>
  queryOptions({
    queryKey: mobileAppKeys.popupImages(params),
    queryFn: () => fetchPopupImageAPI(fetch, params.imageUrl),
  });
