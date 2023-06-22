import React from 'react';
import chroma from 'chroma-js';
import BooleanChip from '#components/chip/BooleanChip.component';
import ReportStatusChip from './ReportChips/ReportStatusChip.component';
import ReportConditionChip from './ReportChips/ReportConditionChip.component';
import CustomChip from '#components/chip/CustomChip.component';
import {
  GREEN_GREY_BOOLEAN_CHIPS,
  RED_GREEN_BOOLEAN_CHIPS,
  RED_GREEN_INVERTED_BOOLEAN_CHIPS,
  STATUS_CHIPS,
  CONDITION_CHIPS,
} from '../constants';

type ReportCellRendererProps = {
  reportCategory: string;
  value: number | string | boolean;
  datatype: string;
  extra_data: { [key: string]: number | string };
  row_extra_data: { [key: string]: number | string };
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

  const isStatusChip = STATUS_CHIPS.includes(datatype);
  const isBooleanGreenGreyChip = GREEN_GREY_BOOLEAN_CHIPS.includes(datatype);
  const isBooleanRedGreenChip = RED_GREEN_BOOLEAN_CHIPS.includes(datatype);
  const isBooleanRedGreenInvertedChip =
    RED_GREEN_INVERTED_BOOLEAN_CHIPS.includes(datatype);
  const isConditionChip =
    CONDITION_CHIPS.includes(datatype) ||
    (datatype === 'credits' && reportCategory === 'credit');
  const isTagChip = datatype.substring(0, 4) === 'tag:';

  const isChip =
    isStatusChip ||
    isBooleanGreenGreyChip ||
    isBooleanRedGreenChip ||
    isBooleanRedGreenInvertedChip ||
    isConditionChip ||
    isTagChip;

  let tagColor = null;
  if (isTagChip) {
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
      {!isChip && displayedValue}
      {isStatusChip &&
        (typeof value === 'string' || typeof value === 'number') && (
          <ReportStatusChip
            value={value}
            datatype={datatype}
            translation={displayedValue}
            extra_data={extra_data}
            row_extra_data={row_extra_data}
            chipClass={chipClass}
          />
        )}
      {isBooleanGreenGreyChip && (
        <BooleanChip
          value={!!value}
          translation={displayedValue}
          colorBlacklist="red"
          chipClass={chipClass}
        />
      )}
      {isBooleanRedGreenChip && (
        <BooleanChip
          value={!!value}
          translation={displayedValue}
          colorBlacklist="grey"
          chipClass={chipClass}
        />
      )}
      {isBooleanRedGreenInvertedChip && (
        <BooleanChip
          value={!!value}
          translation={displayedValue}
          colorBlacklist="grey"
          colorsInverted
          chipClass={chipClass}
        />
      )}
      {isConditionChip && typeof value === 'number' && (
        <ReportConditionChip
          value={value}
          datatype={datatype}
          translation={displayedValue}
          chipClass={chipClass}
          row_extra_data={row_extra_data}
        />
      )}
      {isTagChip && (
        <CustomChip
          displayedValue={displayedValue}
          mainColor={tagColor}
          icon={extra_data.icon.toString()}
          chipClass={chipClass}
        />
      )}
    </div>
  );
};

export default React.memo(ReportCellRenderer);
