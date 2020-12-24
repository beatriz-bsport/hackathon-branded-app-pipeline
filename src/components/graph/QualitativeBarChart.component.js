// @flow
import React from 'react';
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
import { getPalette, getAnalogColors } from './color-utils';
import { numberFormatter } from '../../libs/statistics/utils';

type Props = {
  height?: number | string,
  width?: number | string,
  data: Array<any>,
  baseColor: string,
  valueCaption: string,
  tooltip?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  noGrid?: boolean,
  barSize?: number,
  allowDecimals?: boolean,
  translationKey?: string,
};

export function QualitativeBarChart(props: Props) {
  const {
    height,
    width,
    margin,
    noGrid,
    barSize,
    baseColor,
    valueCaption,
    tooltip,
    allowDecimals,
    translationKey,
  } = props;
  const { t } = useTranslation(['dashboard']);
  const classes = useStyles(height);

  let data = props.data
    .map((entry) => ({ ...entry, value: Math.abs(entry.value) }))
    .filter((entry) => entry.value > 0);

  if (translationKey) {
    data = data.map((entry) => ({
      ...entry,
      name: t(`${translationKey}.${entry.name}`),
    }));
  }

  if (data && data.length === 0) {
    return (
      <div className={classes.noDataMessage}>
        <Typography variant="h6">{t('noData')}</Typography>
      </div>
    );
  }

  let colors = [];

  if (data.length <= 4) {
    colors = getAnalogColors(baseColor);
  } else {
    colors = getPalette(baseColor);
  }

  return (
    <ResponsiveContainer width={width || '100%'} height={height || 400}>
      <BarChart
        data={data}
        margin={margin || { top: 10, right: 20, bottom: 20, left: 50 }}
        layout="vertical"
      >
        {noGrid ? null : <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          type="number"
          tickFormatter={numberFormatter(false)}
          label={{ value: valueCaption, position: 'bottom' }}
          allowDecimals={allowDecimals}
        />
        <YAxis type="category" dataKey="name" />
        {tooltip && <Tooltip />}
        <Bar dataKey="value" barSize={barSize} name={tooltip && valueCaption}>
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
