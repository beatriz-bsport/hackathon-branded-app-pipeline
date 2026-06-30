import { Button, Title, cx } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { ThreadListFilter } from "./thread-list-filter";
import { ThreadListSearch } from "./thread-list-search";
import type { ThreadFilter } from "./use-thread-filter";

export type ThreadListHeaderProps = {
  /** Currently active thread filter. */
  filter: ThreadFilter;
  /** Called with the next filter when the user changes it. */
  onFilterChange: (next: ThreadFilter) => void;
  /** Current search field value (raw, un-debounced input). */
  search: string;
  /** Called with the next raw search value on every keystroke. */
  onSearchChange: (next: string) => void;
  /** Called when the search field's clear control is pressed. */
  onSearchClear: () => void;
  className?: string;
};

export function ThreadListHeader({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onSearchClear,
  className,
}: ThreadListHeaderProps) {
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

      <div className="flex w-full items-center gap-2xs">
        <ThreadListFilter value={filter} onChange={onFilterChange} />
        <ThreadListSearch
          value={search}
          onChange={onSearchChange}
          onClear={onSearchClear}
          className="min-w-0 flex-1"
        />
        <Button
          kind="icon-button"
          intent="flat"
          color="default"
          size="md"
          icon="new-message"
          label={t("threadListHeader.composeLabel")}
        />
      </div>
    </header>
  );
}
