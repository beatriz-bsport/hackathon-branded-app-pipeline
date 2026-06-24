import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Content-area placeholder shown on `/threads` while no thread is selected.
 * Delegates to Kaizen's `useEmptyState`, which renders the `empty` illustration
 * above the message and fills/centers its container — so it covers the rest of
 * the inbox space next to the thread list. Matches Figma node 819-162223.
 */
export function ThreadPlaceholder() {
  const { t } = useTranslation("thread-placeholder");

  const { EmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: { title: t("noThreadSelected") },
  });

  return <EmptyState />;
}
