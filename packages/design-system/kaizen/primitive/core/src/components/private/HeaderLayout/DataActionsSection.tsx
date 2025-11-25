import React, { ReactNode, SetStateAction } from "react";

import Button from "#src/components/Button";
import ExpandableSearchInput, {
  type ExpandableSearchInputWithTooltipProps,
} from "#src/components/ExpandableSearchInput";
import Filter, { type FilterProps } from "#src/components/Filter";
import Popover from "#src/components/Popover";
import { type TooltipProps, withTooltip } from "#src/components/Tooltip";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type DataActionsSectionProps = {
  filterConfig?: FilterProps;
  filterRef?: React.Ref<{ resetFilters: () => void }>;
  onDisplayPopover?: (props: {
    setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isPopoverOpened: boolean;
    contentRef: React.RefObject<HTMLDivElement | null>;
  }) => ReactNode;

  searchConfig?: ExpandableSearchInputWithTooltipProps;
};

const SearchWithTooltip = withTooltip(ExpandableSearchInput);

const DataActionsSection: React.FC<DataActionsSectionProps> = ({
  filterConfig,
  filterRef,
  onDisplayPopover,
  searchConfig,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  if (!filterConfig && !onDisplayPopover && !searchConfig) {
    return null;
  }

  const { tooltipConfig, ...searchProps } = searchConfig ?? {};
  // Define tooltip props with default configuration only when tooltipConfig is defined (even empty)
  const tooltipProps: TooltipProps | undefined = tooltipConfig
    ? {
        label: t("headerLayout.search.tooltip"),
        placement: "bottom-right",
        ...tooltipConfig,
      }
    : undefined;

  return (
    <div className="flex flex-row justify-between items-start px-md py-xs">
      {filterConfig ? <Filter {...filterConfig} ref={filterRef} /> : <div />}
      <div className="flex flex-row gap-xs items-stretch h-fit">
        {searchProps && "id" in searchProps && (
          <SearchWithTooltip tooltipProps={tooltipProps} {...searchProps} />
        )}
        {onDisplayPopover && (
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  color="main"
                  iconLeft="settings-04"
                  intent="default"
                  label={t("headerLayout.display.buttonLabel")}
                  size="md"
                  onClick={() => setIsPopoverOpened(true)}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement="bottom-right">
              {onDisplayPopover}
            </Popover.Content>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default DataActionsSection;
