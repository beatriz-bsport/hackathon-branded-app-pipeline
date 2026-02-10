import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { popupDetailQueryOptions, popupImageQueryOptions } from "./api";

export const useFetchPopupDetailSuspenseQuery = (popupId: number) => {
  return useSuspenseQuery(popupDetailQueryOptions(popupId));
};

export const usePrefetchPopupDetail = () => {
  const queryClient = useQueryClient();

  return (popupId: number) => {
    queryClient.prefetchQuery(popupDetailQueryOptions(popupId));
  };
};

export const usePopupImageFileSuspenseQuery = (
  popupId: number,
  imageUrl: string,
) => {
  return useSuspenseQuery(popupImageQueryOptions(popupId, imageUrl));
};

export const usePrefetchPopupImageFile = () => {
  const queryClient = useQueryClient();

  return (popupId: number, imageUrl: string) => {
    queryClient.prefetchQuery(popupImageQueryOptions(popupId, imageUrl));
  };
};
