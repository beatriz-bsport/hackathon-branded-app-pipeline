import { Button, DropdownMenu } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { THREAD_FILTERS, type ThreadFilter } from "./use-thread-filter";

export type ThreadListFilterProps = {
  /** Currently active filter. */
  value: ThreadFilter;
  /** Called with the next filter when the user picks an option. */
  onChange: (next: ThreadFilter) => void;
  className?: string;
};

const MENU_MIN_WIDTH_PX = 240;

/**
 * Funnel icon-button that opens a single-select "Filter for:" menu (All messages
 * / Unread). The active option renders in its selected state (highlighted box);
 * a non-`"all"` filter highlights the funnel (flat/main) so the active state reads
 * at a glance. Presentational — state lives in the caller (see {@link useThreadFilter}).
 */
export function ThreadListFilter({
  value,
  onChange,
  className,
}: ThreadListFilterProps) {
  const { t } = useTranslation("thread-list");

  const isActive = value !== "all";

  return (
    <DropdownMenu
      placement="bottom-left"
      minWidthPx={MENU_MIN_WIDTH_PX}
      selectedValues={[value]}
      items={[
        { type: "title", label: t("threadListHeader.filterTitle") },
        ...THREAD_FILTERS.map((option) => ({
          id: option,
          label: t(`threadListHeader.filter.${option}`),
        })),
      ]}
      onSelectOption={({ id, setIsPopoverOpened }) => {
        onChange(id as ThreadFilter);
        setIsPopoverOpened(false);
      }}
      target={({ setIsPopoverOpened }) => (
        <Button
          kind="icon-button"
          intent="flat"
          color={isActive ? "main" : "default"}
          size="md"
          icon="filter-lines"
          label={t("threadListHeader.filterLabel")}
          className={className}
          onClick={() => setIsPopoverOpened(true)}
        />
      )}
    />
  );
}
