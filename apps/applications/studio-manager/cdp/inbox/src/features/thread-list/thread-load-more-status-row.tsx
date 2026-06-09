import { Body, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadLoadMoreStatusRowProps = {
  hasError: boolean;
};

export function ThreadLoadMoreStatusRow({
  hasError,
}: ThreadLoadMoreStatusRowProps) {
  const { t } = useTranslation("thread-list");

  return (
    <div className="flex h-full items-center justify-center px-xs">
      {hasError ? (
        <Body color="weak" size="sm">
          {t("threadList.loadingError")}
        </Body>
      ) : (
        <Loader size="sm" />
      )}
    </div>
  );
}
