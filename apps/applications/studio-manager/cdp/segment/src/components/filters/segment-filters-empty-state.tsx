import { Body, Card, Icon } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES,
  type SmartlistFiltersManagerFilterType,
} from "./shared/types-guards";

const TOP_FILTER_SHORTCUT_TYPES = [
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.passes,
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.tags,
  SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalBookingNumber,
] as const satisfies readonly SmartlistFiltersManagerFilterType[];

type SegmentFiltersEmptyStateHeaderProps = {
  className?: string;
};

/**
 * Empty-state header shown when a smartlist has no filters yet.
 */
export const SegmentFiltersEmptyStateHeader = ({
  className,
}: SegmentFiltersEmptyStateHeaderProps) => {
  const { t } = useTranslation("filters");

  return (
    <div
      className={`flex flex-col items-center gap-xs text-center ${className ?? ""}`}
    >
      <Icon icon="filter-lines" size="md" className="text-onsurface-weak" />
      <Body htmlVariant="p" weight="stronger" size="md">
        {t("emptyState.title")}
      </Body>
      <Body htmlVariant="p" color="weak" size="sm">
        {t("emptyState.description")}
      </Body>
    </div>
  );
};

type SegmentFiltersTopFilterShortcutsProps = {
  onSelectShortcut: (filterType: SmartlistFiltersManagerFilterType) => void;
};

const KEYBOARD_SHORTCUT_KEYS = {
  ENTER: "Enter",
  SPACE: " ",
} as const;

/**
 * Shortcut cards for the most common smartlist filters.
 */
export const SegmentFiltersTopFilterShortcuts = ({
  onSelectShortcut,
}: SegmentFiltersTopFilterShortcutsProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <Body htmlVariant="p" color="weak" size="sm">
        {t("emptyState.topFiltersLabel")}
      </Body>
      <div className="flex flex-col gap-xs">
        {TOP_FILTER_SHORTCUT_TYPES.map((filterType) => (
          <Card
            key={filterType}
            actionable
            elevated
            role="button"
            tabIndex={0}
            className="outline-none focus-visible:bg-surface-action-default-elevated-hovered"
            onClick={() => onSelectShortcut(filterType)}
            onKeyDown={(event) => {
              if (
                event.key === KEYBOARD_SHORTCUT_KEYS.ENTER ||
                event.key === KEYBOARD_SHORTCUT_KEYS.SPACE
              ) {
                event.preventDefault();
                onSelectShortcut(filterType);
              }
            }}
          >
            <div className="flex flex-col gap-2xs">
              <Body htmlVariant="p" weight="stronger" size="sm">
                {t(`emptyState.shortcuts.${filterType}.title`)}
              </Body>
              <Body htmlVariant="p" color="weak" size="sm">
                {t(`emptyState.shortcuts.${filterType}.description`)}
              </Body>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
