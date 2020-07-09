// @flow

import moment from 'moment';

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import mean from 'lodash/mean';
import flow from 'lodash/flow';
import countBy from 'lodash/countBy';
import entries from 'lodash/entries';
import partialRight from 'lodash/partialRight';
import maxBy from 'lodash/maxBy';
import last from 'lodash/last';
import head from 'lodash/head';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import type {
  ReportConfiguration,
  ReportExtractResult,
  ReportMetadata,
} from './types';

type Props = {
  report: ReportConfiguration,
  result: ReportExtractResult,
  metadata: ReportMetadata,
  loading?: boolean,
  t: TFunction,
  classes: { [string]: string },
};

const findMostFrequent = flow(
  countBy,
  entries,
  partialRight(maxBy, last),
  head,
);

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
          value: `${parseFloat(value || 0).toFixed(2)}€`,
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
        value: moment(value, 'DD/MM/YYYY').format('DD/MM/YYYY'),
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
          value: moment(value, 'DD/MM/YYYY[,] HH[:]mm').format(
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

const TableSubHeader = ({ classes, columnsConfigs, converters, result, t }) => {
  return (
    <React.Fragment>
      {!!columnsConfigs.filter((c) => c.summable).length && (
        <React.Fragment>
          <Typography variant="caption">{t('subheader.total')}</Typography>
          <TableRow classes={{ root: classes.trRootSubheader }}>
            {columnsConfigs.map((conf, idx) =>
              conf.summable ? (
                (() => {
                  const { value, cellProps } = converters[idx](
                    result
                      .map((row) => row[idx])
                      .reduce((acc, v) => acc + v, 0),
                  );
                  return (
                    <TableCell
                      key={columnsConfigs[idx].identifier}
                      {...(cellProps || {})}
                      classes={{ paddingDense: classes.paddingDense }}
                    >
                      {value}
                    </TableCell>
                  );
                })()
              ) : (
                <TableCell
                  key={columnsConfigs[idx].identifier}
                  classes={{ paddingDense: classes.paddingDense }}
                />
              ),
            )}
          </TableRow>
        </React.Fragment>
      )}
      {!!columnsConfigs.filter((c) => c.averageable).length && (
        <React.Fragment>
          <Typography variant="caption">{t('subheader.average')}</Typography>
          <TableRow classes={{ root: classes.trRootSubheader }}>
            {columnsConfigs.map((conf, idx) =>
              conf.averageable ? (
                (() => {
                  const { value, cellProps } = converters[idx](
                    mean(result.map((row) => row[idx])),
                  );
                  return (
                    <TableCell
                      key={columnsConfigs[idx].identifier}
                      {...(cellProps || {})}
                      classes={{ paddingDense: classes.paddingDense }}
                    >
                      {value}
                    </TableCell>
                  );
                })()
              ) : (
                <TableCell
                  key={columnsConfigs[idx].identifier}
                  classes={{ paddingDense: classes.paddingDense }}
                />
              ),
            )}
          </TableRow>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export function ReportTable(props: Props) {
  const { report, result, loading, classes, t, metadata } = props;
  const { columns } = report;
  const columnsConfigs = columns.map((c) => getColumn(metadata, report, c));
  const converters = columnsConfigs.map((c) => getConverter(c, classes, t));

  return (
    <div className={classes.responsive}>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{t(`columns.${column}`)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && !!result && (
            <TableSubHeader
              t={t}
              classes={classes}
              columnsConfigs={columnsConfigs}
              converters={converters}
              result={result}
            />
          )}
          {!loading && result
            ? result.map((row) => (
                <TableRow
                  key={row[0] + row[1]}
                  classes={{ root: classes.trRoot }}
                >
                  {columns.map((column, i) => {
                    const { value, cellProps } = converters[i](row[i]);
                    return (
                      <TableCell
                        key={columnsConfigs[i].identifier}
                        {...(cellProps || {})}
                        classes={{ paddingDense: classes.paddingDense }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}

ReportTable.defaultProps = {
  loading: false,
};

const styles = () => ({
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
  trRootSubheader: {
    height: 'auto',
    backgroundColor: '#EFEFEF',
    position: 'relative',
  },
  paddingDense: {},
});
export default withStyles(styles)(withTranslation(['reporting'])(ReportTable));
