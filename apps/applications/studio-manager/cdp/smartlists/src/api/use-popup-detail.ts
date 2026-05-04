import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
  popupDetailQueryOptions,
  popupImageQueryOptions,
} from "@bsport/api-member-experience";

import { fetch } from "#src/utils/fetch";

export const useFetchPopupDetailSuspenseQuery = (popupId: number) => {
  return useSuspenseQuery(popupDetailQueryOptions(fetch, popupId));
};

export const usePrefetchPopupDetail = () => {
  const queryClient = useQueryClient();

  return (popupId: number) => {
    queryClient.prefetchQuery(popupDetailQueryOptions(fetch, popupId));
  };
};

export const usePopupImageFileSuspenseQuery = (
  popupId: number,
  imageUrl: string,
) => {
  return useSuspenseQuery(popupImageQueryOptions(fetch, { popupId, imageUrl }));
};

export const usePrefetchPopupImageFile = () => {
  const queryClient = useQueryClient();

  return (popupId: number, imageUrl: string) => {
    queryClient.prefetchQuery(
      popupImageQueryOptions(fetch, { popupId, imageUrl }),
    );
  };
};
