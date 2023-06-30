import React from 'react';

import { TableCell } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import { CellConverter, CellData, ReportMetadataColumn } from '../types';

import ReportCellRenderer from './ReportCellRenderer.component';

type ReportTableCellProps = {
  reportCategory: string;
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
        reportCategory={reportCategory}
        value={cellValues?.value}
        datatype={column}
        extra_data={cellValues?.extra_data}
        row_extra_data={row_extra_data}
        formattedValue={value}
        chipClass={chipClass}
      />
    </TableCell>
  );
};

export default React.memo(ReportTableCell);
