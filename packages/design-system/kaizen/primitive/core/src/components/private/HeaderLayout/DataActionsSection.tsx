import React from "react";

import Button from "#src/components/Button";
import ExpandableSearchInput, {
  type ExpandableSearchInputProps,
} from "#src/components/ExpandableSearchInput";
import Filter, { type FilterProps } from "#src/components/Filter";

export type DataActionsSectionProps = {
  filterConfig?: FilterProps;
  onDisplayClick?: () => void;
  searchConfig?: ExpandableSearchInputProps;
};

const DataActionsSection: React.FC<DataActionsSectionProps> = ({
  filterConfig,
  onDisplayClick,
  searchConfig,
}) => {
  if (!filterConfig && !onDisplayClick && !searchConfig) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-start px-md py-xs">
      {filterConfig ? <Filter {...filterConfig} /> : <div />}
      <div className="flex flex-row gap-xs items-stretch h-fit">
        {searchConfig && <ExpandableSearchInput {...searchConfig} />}
        {onDisplayClick && (
          <Button
            color="main"
            iconLeft="settings-04"
            intent="default"
            label="Display"
            size="md"
            onClick={onDisplayClick}
          />
        )}
      </div>
    </div>
  );
};

export default DataActionsSection;
