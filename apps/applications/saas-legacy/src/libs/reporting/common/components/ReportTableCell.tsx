import React from 'react';

import { TableCell } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import type {
  CellConverter,
  CellData,
  ReportMetadataColumn,
} from '#src/libs/reporting/common/types';

import ReportCellRenderer from '#src/libs/reporting/common/components/ReportCellRenderer.component';

type ReportTableCellProps = {
  reportCategory: ReportCategoryEnum;
  columnConfig:
    | ReportMetadataColumn
    | {
        identifier: string;
        datatype: 'string';
      };
  converter: CellConverter;
  column: string;
  cellValues: CellData | null;
  classes: ClassNameMap;
  row_extra_data?: { [key: string]: number | string };
  chipClass?: string;
};

const ReportTableCell: React.FC<ReportTableCellProps> = ({
  reportCategory,
  columnConfig,
  converter,
  column,
  cellValues,
  classes,
  chipClass,
  row_extra_data,
}) => {
  const { value, cellProps } = converter(cellValues?.value);

  return (
    <TableCell
      key={columnConfig?.identifier}
      {...(cellProps || {})}
      className={classes.cell}
    >
      <ReportCellRenderer
        chipClass={chipClass}
        columnName={column}
        extra_data={cellValues?.extra_data}
        formattedValue={value}
        reportCategory={reportCategory}
        row_extra_data={row_extra_data}
        value={cellValues?.value}
      />
    </TableCell>
  );
};

export default React.memo(ReportTableCell);
