import { Button, Title, cx } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadListHeaderProps = {
  className?: string;
};

export function ThreadListHeader({ className }: ThreadListHeaderProps) {
  const { t } = useTranslation("thread-list");

  return (
    <header
      className={cx(
        "flex flex-col items-start justify-center gap-2xs border-b-stroke-thin border-b-stroke-divider bg-surface-default p-xs",
        className,
      )}
    >
      <div className="flex w-full items-center gap-sm">
        <Title
          htmlVariant="h1"
          weight="strong"
          color="default"
          className="min-w-px flex-1 break-words"
        >
          {t("title")}
        </Title>
        <Button
          kind="icon-button"
          intent="flat"
          color="default"
          size="md"
          icon="settings-01"
          label={t("threadListHeader.settingsLabel")}
        />
      </div>
    </header>
  );
}
