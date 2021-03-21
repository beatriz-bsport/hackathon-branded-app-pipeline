// @flow

import moment from 'moment-timezone';

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
/*
import flow from 'lodash/flow';
import countBy from 'lodash/countBy';
import entries from 'lodash/entries';
import partialRight from 'lodash/partialRight';
import maxBy from 'lodash/maxBy';
import last from 'lodash/last';
import head from 'lodash/head';
*/

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { TableFooter } from '@material-ui/core';
import { getCurrencyDisplay } from '../theme/selectors';

import type { ReportConfiguration, ReportExtractResult } from './types';

type Props = {
  reportStoreRowsLoading: boolean,
  report: ReportConfiguration,
  result: ReportExtractResult,
  t: TFunction,
  classes: { [string]: string },
  reportStoreRows: Array<any>,
  previousPage: number,
  nextPage: number,
  otherPages: Array<any>,
  handleGeneratePreviousPage: (*) => void,
  handleGenerateNextPage: (*) => void,
  className: { [string]: string },
  columnSpan: number,
};

/*
const findMostFrequent = flow(
  countBy,
  entries,
  partialRight(maxBy, last),
  head,
);
*/

function getConverter(column, classes, t) {
  if (!column || !column.datatype) {
    return (value) => ({ value });
  }
  const { datatype } = column;
  return (value) => {
    if (datatype === 'price') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${parseFloat(value || 0).toFixed(2)}${getCurrencyDisplay()}`,
        };
      }
    }
    if (datatype === 'cts') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${(parseFloat(value || 0) / 100).toFixed(
            2,
          )}${getCurrencyDisplay()}`,
        };
      }
    }
    if (datatype === 'int') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: parseInt(value || 0, 10),
        };
      }
    }
    if (datatype === 'percent') {
      if (typeof value === 'number' || !value) {
        return {
          cellProps: { className: classes.right },
          value: `${parseFloat(value || 0).toFixed(2)}%`,
        };
      }
    }
    if (datatype === 'time') {
      return {
        value: moment(value, 'HH[:]mm').format('HH[:]mm'),
      };
    }
    if (datatype === 'date') {
      return {
        value: value ? moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY') : '',
      };
    }
    if (datatype === 'dow') {
      return {
        value: moment.weekdays()[(parseInt(value, 10) + 1) % 7],
      };
    }
    if (datatype === 'boolean') {
      if (value) {
        return { value: t('yes') };
      }
      return { value: t('no') };
    }
    if (datatype === 'datetime') {
      if (value) {
        return {
          value: moment(value, 'YYYY-MM-DD[,] HH[:]mm').format(
            'DD MMM YYYY HH[h]mm',
          ),
        };
      }
      return '';
    }
    if (datatype === 'product_type') {
      return { value: t(`product_type.${value}`) };
    }
    if (datatype === 'payment_method') {
      if (value && (typeof value === 'string' || !value)) {
        return {
          value: (value || '')
            .split(',')
            .map((v) => t(`payment_method.${v}`))
            .join(', '),
        };
      }
      return { value: t('payment_method.none') };
    }
    return { value };
  };
}

function getColumn(metadata, report, column) {
  const reportMetadata = metadata.value.find(
    (r) => r.category === report.category,
  );
  return (
    reportMetadata.columns.find((c) => c.identifier === column) || {
      identifier: column,
      datatype: 'string',
    }
  );
}

function TablePaginationActions(props: Props) {
  const {
    previousPage,
    nextPage,
    otherPages,
    handleGeneratePreviousPage,
    handleGenerateNextPage,
    reportStoreRowsLoading,
    columnSpan,
  } = props;
  return (
    <TableRow>
      <TableCell colSpan={columnSpan}>
        <IconButton
          onClick={handleGeneratePreviousPage}
          disabled={!previousPage || reportStoreRowsLoading}
          aria-label="previous page"
        >
          <Typography variant="caption">{previousPage}</Typography>
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="caption">
          {`Page ${nextPage ? nextPage - 1 : previousPage + 1}/${
            otherPages ? otherPages.length : ''
          }`}
        </Typography>
        <IconButton
          onClick={handleGenerateNextPage}
          disabled={!nextPage || reportStoreRowsLoading}
          aria-label="next page"
        >
          <KeyboardArrowRight />
          <Typography variant="caption">{nextPage}</Typography>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
export function ReportTable(props: Props) {
  const {
    report,
    result,
    classes,
    t,
    metadata,
    previousPage,
    nextPage,
    otherPages,
    handleGeneratePreviousPage,
    handleGenerateNextPage,
    reportStoreRowsLoading,
  } = props;
  const { columns } = report;

  const columnsConfigs = columns.map((c) => getColumn(metadata, report, c));
  const converters = columnsConfigs.map((c) => getConverter(c, classes, t));

  return (
    <div className={classes.responsive}>
      <Table padding="dense">
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
                        key={columnsConfigs[i].identifier}
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
}

ReportTable.defaultProps = {
  loading: false,
};

const styles = (theme) => ({
  responsive: {
    overflowX: 'scroll',
    maxWidth: 'calc(100vw - 300px)',
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
});
export default withStyles(styles)(withTranslation(['reporting'])(ReportTable));
