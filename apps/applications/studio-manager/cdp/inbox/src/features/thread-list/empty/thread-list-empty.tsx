import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

/**
 * Empty placeholder shown in the thread list when the studio has no
 * conversations at all. Delegates to Kaizen's `useEmptyState`, which renders
 * the `empty` illustration above the message and fills/centers its container.
 * When search/filters land, this is also where the `emptySearch` config goes.
 */
export function ThreadListEmpty() {
  const { t } = useTranslation("thread-list");

  const { EmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: { title: t("threadList.empty") },
  });

  return <EmptyState />;
}
