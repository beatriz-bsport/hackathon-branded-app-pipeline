// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import type { ReportConfiguration, ReportExtractResult } from './types';

type Props = {
  report: ReportConfiguration,
  result: ReportExtractResult,
  loading?: boolean,
  t: TFunction,
};

export function ReportTable(props: Props) {
  const { report, result, loading, t } = props;
  const { columns } = report;
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell>{t(`columns.${column}`)}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {!loading && result
          ? result.map((row) => (
              <TableRow key={row[0]}>
                {columns.map((column, i) => (
                  <TableCell key={row[0]}>{row[i]}</TableCell>
                ))}
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}

ReportTable.defaultProps = {
  loading: false,
};

export default withNamespaces(['reporting'])(ReportTable);
