import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadListErrorProps = {
  /** Re-runs the failed initial load. */
  onRetry: () => void;
};

/**
 * Error placeholder shown in the thread list when the *initial* page fails to
 * load (so there are no conversations to fall back on). Reuses Kaizen's
 * `ErrorFallback` — the same placeholder `QueryBoundary` renders — with the
 * generic subtitle/description suppressed so only our concise message and a
 * retry button show. Next-page failures are handled separately (toast + the
 * trailing load-more row), since those keep the loaded list on screen.
 */
export function ThreadListError({ onRetry }: ThreadListErrorProps) {
  const { t } = useTranslation("thread-list");

  return (
    <div className="flex h-full items-center justify-center p-md">
      <ErrorFallback
        title={t("threadList.loadingError")}
        subtitle=""
        description=""
        actionProps={{ label: t("threadList.retry"), onClick: onRetry }}
      />
    </div>
  );
}
