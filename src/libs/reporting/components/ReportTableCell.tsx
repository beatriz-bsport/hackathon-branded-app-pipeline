import React from 'react';

import { TableCell } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import { CellConverter, CellData, ReportMetadataColumn } from '../types';

type ReportTableCellProps = {
  columnConfig:
    | ReportMetadataColumn
    | {
        identifier: string;
        datatype: 'string';
      };
  converter: CellConverter;
  columnIndex: number;
  cellValues: CellData | null;
  classes: ClassNameMap;
};

const ReportTableCell: React.FC<ReportTableCellProps> = ({
  columnConfig,
  converter,
  cellValues,
  classes,
}) => {
  const { value, cellProps } = converter(cellValues?.value);
  return (
    <TableCell
      key={columnConfig?.identifier}
      {...(cellProps || {})}
      className={classes.cell}
    >
      {value}
    </TableCell>
  );
};

export default React.memo(ReportTableCell);
