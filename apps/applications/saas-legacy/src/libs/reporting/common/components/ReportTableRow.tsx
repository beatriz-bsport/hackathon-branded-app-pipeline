import React, { useCallback, useMemo } from 'react';

import { TableRow } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import { generateRowLink } from '#src/libs/reporting/common/utils';
import { hasAccessToUrl } from '#src/libs/role/utils';
import ReportTableCell from '#src/libs/reporting/common/components/ReportTableCell';

import type {
  CellConverter,
  ReportMetadataColumn,
  SerializedRow,
} from '#src/libs/reporting/common/types';
import type {
  RolePermission,
  ObjectLevelPermissions,
} from '#src/libs/role/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';

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
  reportCategory: ReportCategoryEnum;
  userPermissions: RolePermission;
  objectLevelPermissions: ObjectLevelPermissions;
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
  objectLevelPermissions,
}: ReportTableRowsProps) => {
  const link = generateRowLink({
    reportCategory,
    rowExtraData: serializedRow.row_extra_data,
  });
  const hasAccessToLink = hasAccessToUrl({
    url: link,
    userPermissions,
    objectLevelPermissions,
  });
  const goToItemDetail = useCallback(() => {
    if (link && hasAccessToLink) openNewBackOfficeWindow(link);
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
  const chipClass =
    link && hasAccessToLink ? classes.chipClickable : classes.chipDefault;

  return (
    <TableRow key={index} classes={rowClass} onClick={goToItemDetail}>
      {columns.map((column, columnIndex) => {
        return (
          <ReportTableCell
            key={`${index}_${columnIndex}`}
            cellValues={serializedRow?.values[columnIndex]}
            chipClass={chipClass}
            classes={classes}
            column={column}
            columnConfig={columnsConfigs[columnIndex]}
            converter={converters[columnIndex]}
            reportCategory={reportCategory}
            row_extra_data={serializedRow?.row_extra_data}
          />
        );
      })}
    </TableRow>
  );
};

export default React.memo(ReportTableRow);
