import React from 'react';
import chroma from 'chroma-js';
import BooleanChip from '#src/components/chip/BooleanChip.component';
import CustomChip from '#src/components/chip/CustomChip.component';
import ReportStatusChip from '#src/libs/reporting/common/components/ReportChips/ReportStatusChip.component';
import ReportConditionChip from '#src/libs/reporting/common/components/ReportChips/ReportConditionChip.component';
import { isColumnChipsable } from '#src/libs/reporting/common/utils';

type ReportCellRendererProps = {
  reportCategory: string;
  value: number | string | boolean;
  columnName: string;
  extra_data?: { [key: string]: number | string };
  row_extra_data?: { [key: string]: number | string };
  formattedValue: string | number;
  chipClass?: string;
  onDelete?: () => void;
};

const ReportCellRenderer: React.FC<ReportCellRendererProps> = ({
  reportCategory,
  value,
  columnName,
  extra_data,
  row_extra_data,
  formattedValue,
  chipClass,
  onDelete,
}) => {
  const displayedValue = formattedValue?.toString();

  const {
    isStatusChip,
    isBooleanGreenGreyChip,
    isBooleanRedGreenChip,
    isBooleanRedGreenInvertedChip,
    isConditionChip,
    isTagChip,
    isChipsable,
  } = isColumnChipsable(columnName, reportCategory);

  let tagColor = null;
  if (isTagChip && extra_data?.color) {
    tagColor = extra_data.color.toString();
    if (chroma(tagColor).luminance() > 0.6) {
      tagColor = chroma(tagColor).luminance(0.4).hex();
    }
  }

  return (
    // there are type checks here to avoid typescript errors:
    // typescript didn't accept that this component's prop "value" (string | number | boolean)...
    // ...was passed to the components below that accept only one or two of the three types as their "value"
    <div>
      {!isChipsable && displayedValue}
      {isStatusChip &&
        (typeof value === 'string' || typeof value === 'number') && (
          <ReportStatusChip
            chipClass={chipClass}
            columnName={columnName}
            extra_data={extra_data}
            onDelete={onDelete}
            row_extra_data={row_extra_data}
            translation={displayedValue}
            value={value}
          />
        )}
      {isBooleanGreenGreyChip && value !== undefined && (
        <BooleanChip
          chipClass={chipClass}
          colorBlacklist="red"
          translation={displayedValue}
          value={!!value}
        />
      )}
      {isBooleanRedGreenChip && value !== undefined && (
        <BooleanChip
          chipClass={chipClass}
          colorBlacklist="grey"
          translation={displayedValue}
          value={!!value}
        />
      )}
      {isBooleanRedGreenInvertedChip && value !== undefined && (
        <BooleanChip
          colorsInverted
          chipClass={chipClass}
          colorBlacklist="grey"
          translation={displayedValue}
          value={!!value}
        />
      )}
      {isConditionChip && typeof value === 'number' && (
        <ReportConditionChip
          chipClass={chipClass}
          columnName={columnName}
          row_extra_data={row_extra_data}
          translation={displayedValue}
          value={value}
        />
      )}
      {isTagChip && extra_data?.color && (
        <CustomChip
          chipClass={chipClass}
          displayedValue={displayedValue}
          icon={extra_data?.icon.toString()}
          mainColor={tagColor}
        />
      )}
    </div>
  );
};

export default React.memo(ReportCellRenderer);
