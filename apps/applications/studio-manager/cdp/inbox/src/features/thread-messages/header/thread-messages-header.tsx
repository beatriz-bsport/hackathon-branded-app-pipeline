import { Button, Title, cx } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadMessagesHeaderProps = {
  /** Conversation title — the member name. */
  title: string;
  /** Optional handler for the filter icon button. */
  onFilter?: () => void;
  /** Optional handler for the more-actions (kebab) icon button. */
  onMoreActions?: () => void;
  className?: string;
};

export function ThreadMessagesHeader({
  title,
  onFilter,
  onMoreActions,
  className,
}: ThreadMessagesHeaderProps) {
  const { t } = useTranslation("thread-messages");

  return (
    <header
      className={cx(
        "flex flex-col items-start justify-center gap-2xs border-b-stroke-thin border-b-stroke-divider bg-surface-default px-sm py-xs",
        className,
      )}
    >
      <div className="flex w-full items-center gap-sm">
        <Title
          htmlVariant="h2"
          weight="strong"
          color="default"
          className="min-w-px flex-1 break-words"
        >
          {title}
        </Title>
        <div className="flex items-center gap-2xs">
          <Button
            kind="icon-button"
            intent="flat"
            color="default"
            size="md"
            icon="filter-lines"
            label={t("threadMessagesHeader.filterLabel")}
            onClick={onFilter}
          />
          <Button
            kind="icon-button"
            intent="flat"
            color="default"
            size="md"
            icon="dots-vertical"
            label={t("threadMessagesHeader.moreActionsLabel")}
            onClick={onMoreActions}
          />
        </div>
      </div>
    </header>
  );
}
