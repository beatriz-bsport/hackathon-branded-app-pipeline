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
  previousPage: number;
  nextPage: number;
  otherPages: Array<any>;
  handleGeneratePreviousPage: (data: any) => void;
  handleGenerateNextPage: (data: any) => void;
  userPermissions: RolePermission;
  objectLevelPermissions: ObjectLevelPermissions;
  v2?: boolean;
  hasReportBeenGenerated?: boolean;
};

type PaginationProps = {
  reportStoreRowsLoading: boolean;
  previousPage: number;
  nextPage: number;
  otherPages: Array<any>;
  handleGeneratePreviousPage: (data: any) => void;
  handleGenerateNextPage: (data: any) => void;
  columnSpan: number;
};

const TablePaginationContent: React.FC<
  Omit<PaginationProps, 'columnSpan'> & { isHeader?: boolean; v2?: boolean }
> = React.memo(
  ({
    handleGenerateNextPage,
    handleGeneratePreviousPage,
    isHeader,
    nextPage,
    otherPages,
    previousPage,
    reportStoreRowsLoading,
    v2,
  }) => {
    const { t } = useTranslation('reporting');
    const classes = useTablePaginationActionsStyles({ isHeader });

    return (
      <div className={v2 ? classes.tableHeader : ''}>
        {v2 && isHeader && (
          <Typography variant="h6">
            {t('reportDetailContent.tableTitle')}
          </Typography>
        )}
        <div>
          <IconButton
            aria-label="previous page"
            disabled={!previousPage || reportStoreRowsLoading}
            onClick={handleGeneratePreviousPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography variant="caption">
            {`Page ${nextPage ? nextPage - 1 : previousPage + 1}/${
              otherPages ? Math.max(otherPages.length, 1) : 1
            }`}
          </Typography>
          <IconButton
            aria-label="next page"
            disabled={!nextPage || reportStoreRowsLoading}
            onClick={handleGenerateNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </div>
    );
  },
);

const TablePaginationActions: React.FC<PaginationProps> = ({
  reportStoreRowsLoading,
  previousPage,
  nextPage,
  otherPages,
  columnSpan,
  handleGeneratePreviousPage,
  handleGenerateNextPage,
}) => {
  return (
    <TableRow>
      <TableCell colSpan={columnSpan}>
        <TablePaginationContent
          handleGenerateNextPage={handleGenerateNextPage}
          handleGeneratePreviousPage={handleGeneratePreviousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          previousPage={previousPage}
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
  previousPage,
  nextPage,
  otherPages,
  handleGeneratePreviousPage,
  handleGenerateNextPage,
  userPermissions,
  objectLevelPermissions,
  v2,
  hasReportBeenGenerated,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { columns = [] } = report;

  const columnsConfigs = React.useMemo(
    () => columns?.map((column) => getColumn(metadata, report, column)) ?? [],
    [columns, metadata, report],
  );

  const converters = React.useMemo(
    () =>
      columnsConfigs?.map((config) => getConverter(config, classes, t)) ?? [],
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

  return (
    <div className={className}>
      {v2 && (
        <TablePaginationContent
          isHeader
          handleGenerateNextPage={handleGenerateNextPage}
          handleGeneratePreviousPage={handleGeneratePreviousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          previousPage={previousPage}
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
                handleGenerateNextPage={handleGenerateNextPage}
                handleGeneratePreviousPage={handleGeneratePreviousPage}
                nextPage={nextPage}
                otherPages={otherPages}
                previousPage={previousPage}
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
                  index={index}
                  objectLevelPermissions={objectLevelPermissions}
                  reportCategory={report.category}
                  reportStoreRowsLoading={reportStoreRowsLoading}
                  serializedRow={serializedRow}
                  userPermissions={userPermissions}
                />
              ))}
            {hasReportBeenGenerated &&
              v2 &&
              result &&
              resultsWithPermissions.map((serializedRow, index) => (
                <ReportTableRow
                  key={index}
                  classes={classes}
                  columns={columns}
                  columnsConfigs={columnsConfigs}
                  converters={converters}
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
                handleGenerateNextPage={handleGenerateNextPage}
                handleGeneratePreviousPage={handleGeneratePreviousPage}
                nextPage={nextPage}
                otherPages={otherPages}
                previousPage={previousPage}
                reportStoreRowsLoading={reportStoreRowsLoading}
              />
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {!hasReportBeenGenerated && v2 && !result?.length ? (
        <Typography
          align="center"
          className={classes.reportNotGenerated}
          color="textSecondary"
        >
          {t('reportHasNotBeenGenerated')}
        </Typography>
      ) : null}
      {hasReportBeenGenerated && v2 && result?.length ? (
        <TablePaginationContent
          handleGenerateNextPage={handleGenerateNextPage}
          handleGeneratePreviousPage={handleGeneratePreviousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          previousPage={previousPage}
          reportStoreRowsLoading={reportStoreRowsLoading}
          v2={v2}
        />
      ) : null}
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
}));

const useTablePaginationActionsStyles = makeStyles<
  Theme,
  { isHeader: boolean }
>(() => ({
  tableHeader: ({ isHeader }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isHeader ? 'space-between' : 'flex-end',
  }),
}));

export default React.memo(ReportTable);
