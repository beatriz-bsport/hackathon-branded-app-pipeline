import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadListEmptyProps = {
  /**
   * Whether an active search produced the empty list. When true, the
   * search-specific "no matches" state (no-results illustration + message) is
   * shown instead of the generic "no conversations yet" placeholder.
   */
  isSearching?: boolean;
};

/**
 * Empty placeholder shown in the thread list. With no active search it renders
 * the generic "no conversations" state; while searching it renders the
 * search-specific "no matches" state. Delegates to Kaizen's `useEmptyState`,
 * whose `isEmptySearch` branch swaps in the `no-results-found` variant and
 * takes precedence over the plain empty state.
 */
export function ThreadListEmpty({ isSearching = false }: ThreadListEmptyProps) {
  const { t } = useTranslation("thread-list");

  const { EmptyState } = useEmptyState({
    isEmpty: !isSearching,
    emptyConfig: { title: t("threadList.empty") },
    isEmptySearch: isSearching,
    emptySearchConfig: { title: t("threadList.emptySearch") },
  });

  return <EmptyState />;
}
