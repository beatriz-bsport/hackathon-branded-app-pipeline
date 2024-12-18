import React from 'react';
import { Checkbox, Chip, MenuItem } from '@material-ui/core';
import { isColumnChipsable } from '#src/libs/reporting/common/utils';
import ReportCellRenderer from '#src/libs/reporting/common/components/ReportCellRenderer.component';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

type ItemProps = {
  children: string;
  data: { label: string; value: number; columnName: string };
  isSelected: boolean;
  isDisabled: boolean;
};

type ChipProps = {
  data: { label: string; value: number; columnName: string };
  onDelete: () => void;
};

type Props = {
  itemProps?: ItemProps;
  chipProps?: ChipProps;
  reportCategory: ReportCategoryEnum;
};

const ReportChipsRenderer: React.FC<Props> = ({
  itemProps,
  chipProps,
  reportCategory,
}) => {
  const renderer = itemProps ?? chipProps;

  const { isChipsable } = isColumnChipsable(
    renderer.data.columnName,
    reportCategory,
  );
  // column which can be "chipsable" (for example Last payment status)
  if (itemProps) {
    if (itemProps.data?.columnName && isChipsable) {
      return (
        <MenuItem dense disabled={itemProps.isDisabled}>
          <Checkbox checked={itemProps.isSelected} />
          <ReportCellRenderer
            columnName={itemProps.data.columnName}
            formattedValue={itemProps.data.label}
            reportCategory={reportCategory}
            value={itemProps.data.value}
          />
        </MenuItem>
      );
    }
    return (
      <React.Fragment>
        <MenuItem dense disabled={itemProps.isDisabled}>
          <Checkbox checked={itemProps.isSelected} />
          {itemProps.data.label}
        </MenuItem>
      </React.Fragment>
    );
  }

  if (chipProps.data?.columnName && isChipsable) {
    return (
      <ReportCellRenderer
        columnName={chipProps.data.columnName}
        formattedValue={chipProps.data.label}
        onDelete={chipProps.onDelete}
        reportCategory={reportCategory}
        value={chipProps.data.value}
      />
    );
  }
  // "unchipsable" column (for example Name of a company)
  return (
    <React.Fragment>
      <Chip label={chipProps.data.label} onDelete={chipProps.onDelete} />
    </React.Fragment>
  );
};

export default React.memo(ReportChipsRenderer);
