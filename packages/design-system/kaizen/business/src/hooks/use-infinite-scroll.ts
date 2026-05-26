import { type UIEvent, useCallback, useRef } from "react";

type UseInfiniteScrollOptions = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  threshold?: number;
};

/**
 * Triggers `fetchNextPage` when a scrollable container approaches its bottom.
 *
 * `onScroll` is meant to be attached to the element that owns the scroll
 * (e.g. an Autocomplete `menuProps.onScroll`). A ref guard prevents
 * double-fetches between successive scroll events while a page is in flight.
 */
export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 50,
}: UseInfiniteScrollOptions) => {
  const isFetchingRef = useRef(false);

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

      if (
        isNearBottom &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true;
        void fetchNextPage()
          .catch(() => undefined)
          .finally(() => {
            isFetchingRef.current = false;
          });
      }
    },
    [hasNextPage, fetchNextPage, isFetchingNextPage, threshold],
  );

  return { onScroll };
};
