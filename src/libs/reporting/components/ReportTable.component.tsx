import React from 'react';

import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';

import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
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
} from '#libs/reporting/utils';
import { hasObjectLevelPermission } from '#libs/role/permission-utils/utils';
import ReportTableRow from '#libs/reporting/components/ReportTableRow';

import type { ObjectLevelPermissions, RolePermission } from '#libs/role/types';
import type {
  ReportConfiguration,
  ReportMetadata,
  SerializedRow,
} from '#libs/reporting/types';

type TableProps = {
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
      </TableCell>
    </TableRow>
  );
};

const ReportTable: React.FC<TableProps> = ({
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
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { columns = [] } = report;

  const columnsConfigs = React.useMemo(
    () => columns?.map((c) => getColumn(metadata, report, c)) ?? [],
    [columns, metadata, report],
  );

  const converters = React.useMemo(
    () =>
      columnsConfigs?.map((config) =>
        getConverter(config, classes, t, report.category),
      ) ?? [],
    [classes, columnsConfigs, report.category, t],
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
    <div className={classes.responsive}>
      <Table>
        <TableHead>
          <TablePaginationActions
            columnSpan={columns.length}
            handleGenerateNextPage={handleGenerateNextPage}
            handleGeneratePreviousPage={handleGeneratePreviousPage}
            nextPage={nextPage}
            otherPages={otherPages}
            previousPage={previousPage}
            reportStoreRowsLoading={reportStoreRowsLoading}
          />
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{t(`columns.${column}`)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {result &&
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
        {result && (
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
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  responsive: {
    overflowX: 'auto',
  },
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
  tableFooter: {
    width: '100%',
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  cell: { whiteSpace: 'pre-line' },
  chipClickable: { cursor: 'pointer' },
  chipDefault: { cursor: 'default' },
}));

export default React.memo(ReportTable);
