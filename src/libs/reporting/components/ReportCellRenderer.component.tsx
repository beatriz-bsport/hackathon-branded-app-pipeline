import React from 'react';
import chroma from 'chroma-js';
import BooleanChip from '#components/chip/BooleanChip.component';
import ReportStatusChip from './ReportChips/ReportStatusChip.component';
import ReportConditionChip from './ReportChips/ReportConditionChip.component';
import CustomChip from '#components/chip/CustomChip.component';
import { isColumnChipsable } from '../utils';

type ReportCellRendererProps = {
  reportCategory: string;
  value: number | string | boolean;
  datatype: string;
  extra_data?: { [key: string]: number | string };
  row_extra_data?: { [key: string]: number | string };
  formattedValue: string | number;
  chipClass: string;
};

const ReportCellRenderer: React.FC<ReportCellRendererProps> = ({
  reportCategory,
  value,
  datatype,
  extra_data,
  row_extra_data,
  formattedValue,
  chipClass,
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
  } = isColumnChipsable(datatype, reportCategory);

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
            datatype={datatype}
            extra_data={extra_data}
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
          datatype={datatype}
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
