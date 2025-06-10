import React from 'react';

import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import { Skeleton } from '@material-ui/lab';

import {
  getConverter,
  getColumn,
  ReportColumnPermissions,
} from '#src/libs/reporting/common/utils';
import { hasObjectLevelPermission } from '#src/libs/role/permission-utils/utils';
import ReportTableRow from '#src/libs/reporting/common/components/ReportTableRow';

import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';
import type {
  ReportConfiguration,
  ReportMetadata,
  SerializedRow,
} from '#src/libs/reporting/common/types';

type TableProps = {
  className?: string;
  reportStoreRowsLoading: boolean;
  report: ReportConfiguration;
  result: SerializedRow[];
  metadata: ReportMetadata;
  handleGeneratePreviousPage: (data: { cursor?: string }) => void;
  handleGenerateNextPage: (data: { cursor?: string }) => void;
  userPermissions: RolePermission;
  objectLevelPermissions: ObjectLevelPermissions;
  v2?: boolean;
  hasReportBeenGenerated?: boolean;
  displayNewWebshop?: boolean;
  nextCursor: string;
  previousCursor: string;
};

type PaginationProps = {
  reportStoreRowsLoading: boolean;
  handleGeneratePreviousPage: (data: { cursor?: string }) => void;
  handleGenerateNextPage: (data: { cursor?: string }) => void;
  columnSpan: number;
};

const SKELETON_NUMBERS = [1, 2, 3, 4, 5];

const TablePaginationContent: React.FC<{
  isHeader?: boolean;
  v2?: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  reportStoreRowsLoading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}> = React.memo(
  ({
    onNext,
    onPrevious,
    isHeader = false,
    reportStoreRowsLoading,
    v2,
    hasNext,
    hasPrevious,
  }) => {
    const { t } = useTranslation('reporting');
    const classes = useTablePaginationActionsStyles({ isHeader });

    const handleNextClick = React.useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        if (hasNext) {
          onNext();
        }
      },
      [onNext, hasNext],
    );

    const handlePreviousClick = React.useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        if (hasPrevious) {
          onPrevious();
        }
      },
      [onPrevious, hasPrevious],
    );

    return (
      <div className={v2 ? classes.tableHeader : ''}>
        {v2 && isHeader && (
          <Typography variant="h6">
            {t('reportDetailContent.tableTitle')}
          </Typography>
        )}
        <div className={classes.tableHeaderInfos}>
          <div>
            <IconButton
              aria-label="previous page"
              disabled={!hasPrevious || reportStoreRowsLoading}
              onClick={handlePreviousClick}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              aria-label="next page"
              disabled={!hasNext || reportStoreRowsLoading}
              onClick={handleNextClick}
            >
              <KeyboardArrowRight />
            </IconButton>
          </div>
        </div>
      </div>
    );
  },
);

const TablePaginationActions: React.FC<PaginationProps> = ({
  reportStoreRowsLoading,
  columnSpan,
  handleGeneratePreviousPage,
  handleGenerateNextPage,
}) => {
  return (
    <TableRow>
      <TableCell colSpan={columnSpan}>
        <TablePaginationContent
          hasNext={false}
          hasPrevious={false}
          onNext={() => handleGenerateNextPage({ cursor: '' })}
          onPrevious={() => handleGeneratePreviousPage({ cursor: '' })}
          reportStoreRowsLoading={reportStoreRowsLoading}
        />
      </TableCell>
    </TableRow>
  );
};

const ReportTable: React.FC<TableProps> = ({
  className,
  reportStoreRowsLoading,
  report,
  result,
  metadata,
  handleGeneratePreviousPage,
  handleGenerateNextPage,
  userPermissions,
  objectLevelPermissions,
  v2,
  hasReportBeenGenerated,
  displayNewWebshop,
  nextCursor,
  previousCursor,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { columns = [] } = report;

  const columnsConfigs = React.useMemo(
    () =>
      columns.map((column) => {
        const config = getColumn(metadata, report, column);
        return config || { identifier: column, datatype: 'string' as const };
      }),
    [columns, metadata, report],
  );

  const converters = React.useMemo(
    () => columnsConfigs.map((config) => getConverter(config, classes, t)),
    [classes, columnsConfigs, t],
  );

  /*
    Replace values with empty string if the staff user doesn't have permission to
    see the column's data
    If the report category is not in ReportColumnPermissions, resultsWithPermissions returns result and we avoid useless calculations
    If not, we retrieve columnPermissionsIndex which is an array of boolean in which the staff user have permission to see column's data
    and we map on results to filter out the hidden data.
   */
  const resultsWithPermissions: SerializedRow[] = React.useMemo(() => {
    // Check if report category is in ReportColumnPermissions, else return result
    // @ts-expect-error not every categories are in ReportColumnPermissions
    if (ReportColumnPermissions[report.category]) {
      const columnPermissionsIndex: boolean[] = columns.map((column) => {
        const columnPermissions =
          // @ts-expect-error not every categories are in ReportColumnPermissions
          ReportColumnPermissions[report.category][column];

        if (columnPermissions) {
          return columnPermissions.every((permission: string) =>
            hasObjectLevelPermission(objectLevelPermissions, permission),
          );
        }
        return true;
      });

      if (!columnPermissionsIndex.includes(false)) {
        return result;
      }

      return result.map((row) => {
        return {
          ...row,
          values: row.values.map((data, colIndex) => {
            const canSeeColumn = columnPermissionsIndex[colIndex];
            return canSeeColumn ? data : { ...data, value: '' };
          }),
        };
      });
    }
    return result;
  }, [columns, report, objectLevelPermissions, result]);

  // Handler for next page arrow
  const handleNext = () => {
    if (nextCursor) {
      handleGenerateNextPage({ cursor: nextCursor });
    }
  };

  // Handler for previous page arrow
  const handlePrevious = () => {
    if (previousCursor) {
      handleGeneratePreviousPage({ cursor: previousCursor });
    }
  };

  return (
    <div className={className}>
      {v2 && (
        <TablePaginationContent
          isHeader
          hasNext={!!nextCursor}
          hasPrevious={!!previousCursor}
          onNext={handleNext}
          onPrevious={handlePrevious}
          reportStoreRowsLoading={reportStoreRowsLoading}
          v2={v2}
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            {!v2 && (
              <TablePaginationActions
                columnSpan={columns.length}
                handleGenerateNextPage={handleNext}
                handleGeneratePreviousPage={handlePrevious}
                reportStoreRowsLoading={reportStoreRowsLoading}
              />
            )}
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{t(`columns.${column}`)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {result &&
              !v2 &&
              resultsWithPermissions.map((serializedRow, index) => (
                <ReportTableRow
                  key={index}
                  classes={classes}
                  columns={columns}
                  columnsConfigs={columnsConfigs}
                  converters={converters}
                  displayNewWebshop={displayNewWebshop}
                  index={index}
                  objectLevelPermissions={objectLevelPermissions}
                  reportCategory={report.category}
                  reportStoreRowsLoading={reportStoreRowsLoading}
                  serializedRow={serializedRow}
                  userPermissions={userPermissions}
                />
              ))}

            {!reportStoreRowsLoading &&
              hasReportBeenGenerated &&
              v2 &&
              result &&
              resultsWithPermissions.map((serializedRow, index) => (
                <ReportTableRow
                  key={index}
                  classes={classes}
                  columns={columns}
                  columnsConfigs={columnsConfigs}
                  converters={converters}
                  displayNewWebshop={displayNewWebshop}
                  index={index}
                  objectLevelPermissions={objectLevelPermissions}
                  reportCategory={report.category}
                  reportStoreRowsLoading={reportStoreRowsLoading}
                  serializedRow={serializedRow}
                  userPermissions={userPermissions}
                />
              ))}
          </TableBody>
          {!v2 && result && (
            <TableFooter>
              <TablePaginationActions
                columnSpan={columns.length}
                handleGenerateNextPage={handleNext}
                handleGeneratePreviousPage={handlePrevious}
                reportStoreRowsLoading={reportStoreRowsLoading}
              />
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {v2 && reportStoreRowsLoading && (
        <div className={classes.skeletonContainer}>
          {SKELETON_NUMBERS.map((skeletonNumber) => (
            <Skeleton
              key={`report-row-skeleton-${skeletonNumber}`}
              variant="rect"
            />
          ))}
        </div>
      )}
      {!hasReportBeenGenerated &&
      v2 &&
      !result?.length &&
      !reportStoreRowsLoading ? (
        <Typography
          align="center"
          className={classes.reportNotGenerated}
          color="textSecondary"
        >
          {t('reportHasNotBeenGenerated')}
        </Typography>
      ) : null}
      {v2 && (
        <TablePaginationContent
          hasNext={!!nextCursor}
          hasPrevious={!!previousCursor}
          onNext={handleNext}
          onPrevious={handlePrevious}
          reportStoreRowsLoading={reportStoreRowsLoading}
          v2={v2}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  reportNotGenerated: { paddingTop: theme.spacing(2) },
  right: {
    textAlign: 'right',
  },
  trRoot: {
    height: 'auto',
  },
  trRootClickable: {
    height: 'auto',
    cursor: 'pointer',
    '&:hover': {
      borderRadius: 4,
      backgroundColor: grey[200],
    },
  },
  trRootLoading: {
    height: 'auto',
    backgroundColor: theme.palette.action.hover,
  },
  trRootSubheader: {
    height: 'auto',
    backgroundColor: '#EFEFEF',
    position: 'relative',
  },
  cell: { whiteSpace: 'pre-line' },
  chipClickable: { cursor: 'pointer' },
  chipDefault: { cursor: 'default' },
  skeletonContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    gap: theme.spacing(1),
  },
}));

const useTablePaginationActionsStyles = makeStyles<
  Theme,
  { isHeader: boolean }
>((theme) => ({
  tableHeader: ({ isHeader }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isHeader ? 'space-between' : 'flex-end',
  }),
  tableHeaderInfos: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}));

export default React.memo(ReportTable);
