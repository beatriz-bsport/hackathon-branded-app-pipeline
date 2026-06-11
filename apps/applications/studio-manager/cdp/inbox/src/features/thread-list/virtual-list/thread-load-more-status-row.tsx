import { Body, Button, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadLoadMoreStatusRowProps = {
  hasError: boolean;
  /** Re-requests the failed next page. */
  onRetry: () => void;
};

export function ThreadLoadMoreStatusRow({
  hasError,
  onRetry,
}: ThreadLoadMoreStatusRowProps) {
  const { t } = useTranslation("thread-list");

  if (hasError) {
    return (
      <div className="flex h-full items-center justify-center gap-xs px-xs">
        <Body color="weak" size="sm">
          {t("threadList.loadingError")}
        </Body>
        <Button
          kind="default"
          intent="flat"
          color="critical"
          size="sm"
          label={t("threadList.retry")}
          onClick={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center px-xs">
      <Loader size="sm" />
    </div>
  );
}
