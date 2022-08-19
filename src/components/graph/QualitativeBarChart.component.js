// @flow
import React, { useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { numberFormatter } from '../../libs/statistics/utils';
import { DASHBOARD_COLOR_PALETTE } from '#libs/dashboard/colors';
import { getCurrencyDisplay } from '../../libs/theme/selectors';

type Props = {
  height?: number | string,
  width?: number | string,
  data: Array<any>,
  tooltip?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  noGrid?: boolean,
  barSize?: number,
  allowDecimals?: boolean,
  translationKey?: string,
  isCurrencyFormat?: boolean,
  xLabel: string,
  placeholderEmptyTranslationKey: string | null,
};

export function QualitativeBarChart(props: Props) {
  const {
    height,
    width,
    margin,
    noGrid,
    barSize,
    tooltip,
    allowDecimals,
    translationKey,
    isCurrencyFormat,
    xLabel,
    placeholderEmptyTranslationKey,
  } = props;
  const { t } = useTranslation(['dashboard']);
  const classes = useStyles(height);

  const xLabelFormatted = `${xLabel}${
    isCurrencyFormat ? ` (${getCurrencyDisplay()})` : ''
  }`;

  const formatter = useCallback(
    (value) => {
      return [numberFormatter(isCurrencyFormat)(value), xLabel];
    },
    [isCurrencyFormat, xLabel],
  );

  let data = props.data
    .map((entry) => ({ ...entry, value: Math.abs(entry.value) }))
    .filter((entry) => entry.value > 0);

  if (translationKey) {
    data = data.map((entry) => ({
      ...entry,
      name: t(`${translationKey}.${entry.name}`),
    }));
  } else {
    data = data.map((entry) => ({
      ...entry,
      name:
        entry.name ??
        (placeholderEmptyTranslationKey
          ? t(placeholderEmptyTranslationKey)
          : 'None'),
    }));
  }

  if (data && data.length === 0) {
    return (
      <div className={classes.noDataMessage}>
        <Typography variant="h6">{t('noData')}</Typography>
      </div>
    );
  }

  const colors = DASHBOARD_COLOR_PALETTE;

  return (
    <ResponsiveContainer width={width || '100%'} height={height || 400}>
      <BarChart
        data={data}
        margin={margin || { top: 10, right: 20, bottom: 20, left: 0 }}
        layout="vertical"
      >
        {noGrid ? null : <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          type="number"
          tickFormatter={numberFormatter(isCurrencyFormat)}
          label={{ value: xLabelFormatted, position: 'bottom' }}
          allowDecimals={allowDecimals}
        />
        <YAxis type="category" dataKey="name" tick={false} />
        {tooltip && <Tooltip formatter={formatter} />}
        <Bar dataKey="value" barSize={barSize}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const useStyles = makeStyles(() => ({
  noDataMessage: {
    display: 'flex',
    height: (height) => height || 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default QualitativeBarChart;
