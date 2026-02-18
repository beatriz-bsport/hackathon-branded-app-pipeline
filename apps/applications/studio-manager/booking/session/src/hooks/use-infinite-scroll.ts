import { useCallback, useRef } from "react";

type UseInfiniteScrollOptions = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  threshold?: number;
};

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 50,
}: UseInfiniteScrollOptions) => {
  const isFetchingRef = useRef(false);

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

      if (
        isNearBottom &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;
        fetchNextPage().finally(() => {
          isFetchingRef.current = false;
        });
      }
    },
    [hasNextPage, fetchNextPage, isFetchingNextPage, threshold],
  );

  return { onScroll };
};
