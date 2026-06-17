import { Body, Button, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type MessageLoadMoreStatusRowProps = {
  hasError: boolean;
  /** Re-requests the failed page (older or newer, depending on the row). */
  onRetry: () => void;
};

/**
 * The loader / error+retry row shown at either end of the feed while another
 * page is being fetched. Direction-agnostic — the virtual list mounts one at
 * the top (older history) and/or one at the bottom (newer messages).
 */
export function MessageLoadMoreStatusRow({
  hasError,
  onRetry,
}: MessageLoadMoreStatusRowProps) {
  const { t } = useTranslation("thread-messages");

  if (hasError) {
    return (
      <div className="flex items-center justify-center gap-xs px-xs py-sm">
        <Body color="weak" size="sm">
          {t("messageFeed.loadingError")}
        </Body>
        <Button
          kind="default"
          intent="flat"
          color="critical"
          size="sm"
          label={t("messageFeed.retry")}
          onClick={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-xs py-sm">
      <Loader size="sm" />
    </div>
  );
}
