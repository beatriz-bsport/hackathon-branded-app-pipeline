import { useEffect, useRef } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type UseNextPageErrorToastParams = {
  hasFetchNextPageError: boolean;
  isFetchingNextPage: boolean;
};

/**
 * Surfaces a next-page load failure as a critical toast with a close button.
 * The toast renders into a global host on `document.body`, *outside* the React
 * tree, so it's also given the default auto-dismiss: a persistent
 * (`duration: 0`) one would outlive this list and leak across route changes.
 * Retry lives on the trailing load-more row, so this toast is just the
 * foreground alert (notify + dismiss).
 *
 * Keyed to the *settling* of a next-page fetch (fetching → not fetching) rather
 * than a one-shot flag: it fires once per attempt and, crucially, again each
 * time a retry fails — while never re-firing on unrelated re-renders.
 */
export function useNextPageErrorToast({
  hasFetchNextPageError,
  isFetchingNextPage,
}: UseNextPageErrorToastParams) {
  const { t, i18n } = useTranslation("thread-list");

  const wasFetchingRef = useRef(false);

  useEffect(() => {
    const justSettled = wasFetchingRef.current && !isFetchingNextPage;
    wasFetchingRef.current = isFetchingNextPage;

    if (justSettled && hasFetchNextPageError) {
      toast({
        status: "critical",
        title: t("threadList.loadingError"),
        buttonIcon: "x-close",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFetchNextPageError, isFetchingNextPage, i18n.language]);
}
