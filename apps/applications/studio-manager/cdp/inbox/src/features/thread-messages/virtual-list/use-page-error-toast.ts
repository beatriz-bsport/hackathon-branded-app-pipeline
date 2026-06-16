import { useEffect, useRef } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type UsePageErrorToastParams = {
  hasError: boolean;
  isFetching: boolean;
};

/**
 * Surfaces a page-load failure (older or newer) as a critical toast. Keyed to
 * the *settling* of a fetch (fetching → not fetching) so it fires once per
 * attempt — and again on each failed retry — without re-firing on unrelated
 * re-renders. The toast auto-dismisses; retry lives on the loader row.
 *
 * Mirrors the thread-list `useNextPageErrorToast`; call once per direction.
 */
export function usePageErrorToast({
  hasError,
  isFetching,
}: UsePageErrorToastParams) {
  const { t, i18n } = useTranslation("thread-messages");

  const wasFetchingRef = useRef(false);

  useEffect(() => {
    const justSettled = wasFetchingRef.current && !isFetching;
    wasFetchingRef.current = isFetching;

    if (justSettled && hasError) {
      toast({
        status: "critical",
        title: t("messageFeed.loadingError"),
        buttonIcon: "x-close",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError, isFetching, i18n.language]);
}
