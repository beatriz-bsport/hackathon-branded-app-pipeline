import React, { useCallback, useMemo } from 'react';

import { TableRow } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import { CellConverter, ReportMetadataColumn, SerializedRow } from '../types';
import ReportTableCell from './ReportTableCell';
import { generateRowLink } from '../utils';
import { hasAccessToUrl } from '#libs/role/utils';
import { RolePermission } from '#libs/role/types';

type ReportTableRowsProps = {
  reportStoreRowsLoading: boolean;
  index: number;
  converters: CellConverter[];
  classes: ClassNameMap;
  columns: string[];
  columnsConfigs: Array<
    | ReportMetadataColumn
    | {
        identifier: string;
        datatype: 'string';
      }
  >;
  serializedRow: SerializedRow;
  reportCategory: string;
  userPermissions: RolePermission;
};

const ReportTableRow: React.FC<ReportTableRowsProps> = ({
  reportStoreRowsLoading,
  index,
  classes,
  columns,
  columnsConfigs,
  converters,
  serializedRow,
  reportCategory,
  userPermissions,
}: ReportTableRowsProps) => {
  const link = generateRowLink({
    reportCategory,
    rowExtraData: serializedRow.row_extra_data,
  });
  const hasAccessToLink = hasAccessToUrl({ url: link, userPermissions });
  const goToItemDetail = useCallback(() => {
    if (link && hasAccessToLink) window.open(link, '_blank', 'noreferrer');
  }, [hasAccessToLink, link]);
  const rowClass = useMemo(() => {
    if (reportStoreRowsLoading) {
      return { root: classes.trRootLoading };
    }
    return link && hasAccessToLink
      ? { root: classes.trRootClickable }
      : { root: classes.trRoot };
  }, [
    classes.trRoot,
    classes.trRootClickable,
    classes.trRootLoading,
    hasAccessToLink,
    link,
    reportStoreRowsLoading,
  ]);

  return (
    <TableRow key={index} onClick={goToItemDetail} classes={rowClass}>
      {columns.map((_, i) => {
        return (
          <ReportTableCell
            key={`${index}_${i}`}
            columnConfig={columnsConfigs[i]}
            cellValues={serializedRow?.values[i]}
            converter={converters[i]}
            columnIndex={i}
            classes={classes}
          />
        );
      })}
    </TableRow>
  );
};

export default React.memo(ReportTableRow);
