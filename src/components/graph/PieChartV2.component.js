// @flow
import React from 'react';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Label,
} from 'recharts';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import { numberFormatter } from '../../state/stats/utils';
import { getPalette, getAnalogColors } from './color-utils';

type Props = {
  height?: number | string,
  width?: number | string,
  data: Array<any>,
  baseColor: string,
  chartOptions: Array<{ dataKey: string, caption: string }>,
  innerRadius?: number | string,
  outerRadius?: number | string,
  tooltip?: boolean,
  legend?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  isCurrencyFormat?: boolean,
};

const RenderLegend = (props: { payload: any }) => {
  const classes = useStyles();
  const { payload } = props;
  if (payload.length === 1) {
    return (
      <div>
        <div className={classes.onlyOneLegend}>
          <div
            style={{
              height: 15,
              width: 15,
              background: payload[0].color,
              marginLeft: 10,
              marginRight: 10,
              flexShrink: 0,
            }}
          />
          <Typography variant="caption">{payload[0].payload.name}</Typography>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.legendContainer}>
      <Grid container direction="row">
        {payload.map((entry, index) => (
          <Grid item xs={6} key={entry.payload.name}>
            <div
              className={
                index % 2 === 0
                  ? classes.inlineContainerStart
                  : classes.inlineContainerEnd
              }
            >
              <div
                style={{
                  height: 15,
                  width: 15,
                  background: entry.color,
                  marginLeft: 10,
                  marginRight: 10,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption">{entry.payload.name}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export function PieChartV2(props: Props) {
  const {
    width,
    height,
    margin,
    chartOptions,
    innerRadius,
    outerRadius,
    tooltip,
    baseColor,
    legend,
    isCurrencyFormat,
  } = props;
  const classes = useStyles(height);
  const { t } = useTranslation(['dashboard']);
  const total = props.data.reduce((x, y) => x + y.value, 0);

  const data = props.data
    .map((entry) => ({
      name: (
        chartOptions.find((option) => entry.name === option.dataKey) || {
          caption: '...',
        }
      ).caption,
      value: Math.abs(entry.value),
    }))
    .filter((entry) => entry.value > 0);

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
      <PieChart margin={margin}>
        <Pie
          data={data}
          innerRadius={innerRadius || '67%'}
          outerRadius={outerRadius || '80%'}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={colors[index % colors.length]}
            />
          ))}
          <Label
            position="center"
            fontSize={25}
            value={total}
            formatter={numberFormatter(isCurrencyFormat)}
          />
        </Pie>
        {tooltip ? (
          <Tooltip formatter={numberFormatter(isCurrencyFormat)} />
        ) : null}
        {legend ? <Legend content={<RenderLegend />} /> : null}
      </PieChart>
    </ResponsiveContainer>
  );
}

const useStyles = makeStyles((theme) => ({
  noDataMessage: {
    display: 'flex',
    height: (height) => height || 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineContainerStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginRight: theme.spacing(1),
  },
  inlineContainerEnd: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginLeft: theme.spacing(1),
  },
  legendContainer: {
    minWidth: 270,
    maxWidth: 450,
    width: '60%',
    marginBottom: theme.spacing(1),
    margin: 'auto',
  },
  onlyOneLegend: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
}));

export default PieChartV2;
