// @ts-nocheck
import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';

import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { TableFooter, Theme } from '@material-ui/core';

import { ReportConfiguration, ReportMetadata } from '../types';
import { getConverter, getColumn } from '../utils';

type TableProps = {
  reportStoreRowsLoading: boolean;
  report: ReportConfiguration;
  result: Array<any>;
  metadata: ReportMetadata;
  reportStoreRows: Array<any>;
  previousPage: number;
  nextPage: number;
  otherPages: Array<any>;
  handleGeneratePreviousPage: (data: any) => void;
  handleGenerateNextPage: (data: any) => void;
  columnSpan: number;
  value: String;
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
          onClick={handleGeneratePreviousPage}
          disabled={!previousPage || reportStoreRowsLoading}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="caption">
          {`Page ${nextPage ? nextPage - 1 : previousPage + 1}/${
            otherPages ? Math.max(otherPages.length, 1) : 1
          }`}
        </Typography>
        <IconButton
          onClick={handleGenerateNextPage}
          disabled={!nextPage || reportStoreRowsLoading}
          aria-label="next page"
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
}) => {
  const classes = useStyles();
  const { t } = useTranslation('reporting');
  const { columns = [] } = report;

  const columnsConfigs =
    columns?.map((c) => getColumn(metadata, report, c)) ?? [];

  const converters =
    columnsConfigs?.map((c) => getConverter(c, classes, t)) ?? [];
  return (
    <div className={classes.responsive}>
      <Table>
        <TableHead>
          <TablePaginationActions
            previousPage={previousPage}
            nextPage={nextPage}
            otherPages={otherPages}
            handleGeneratePreviousPage={handleGeneratePreviousPage}
            handleGenerateNextPage={handleGenerateNextPage}
            reportStoreRowsLoading={reportStoreRowsLoading}
            columnSpan={columns.length}
          />
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{t(`columns.${column}`)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {result
            ? result.map((row, index) => (
                <TableRow
                  key={index}
                  classes={
                    reportStoreRowsLoading
                      ? { root: classes.trRootLoading }
                      : { root: classes.trRoot }
                  }
                >
                  {columns.map((column, i) => {
                    const { value, cellProps } = converters[i](row[i]);

                    return (
                      <TableCell
                        key={columnsConfigs[i]?.identifier}
                        {...(cellProps || {})}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            : null}
        </TableBody>
        {result && (
          <TableFooter>
            <TablePaginationActions
              previousPage={previousPage}
              nextPage={nextPage}
              otherPages={otherPages}
              handleGeneratePreviousPage={handleGeneratePreviousPage}
              handleGenerateNextPage={handleGenerateNextPage}
              reportStoreRowsLoading={reportStoreRowsLoading}
              columnSpan={columns.length}
            />
          </TableFooter>
        )}
      </Table>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  responsive: {
    overflowX: 'scroll',
  },
  right: {
    textAlign: 'right',
  },
  trRoot: {
    height: 'auto',
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
}));

export default ReportTable;
