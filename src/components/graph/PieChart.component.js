// @flow
import React, { useRef, useState } from 'react';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Label,
} from 'recharts';
import Chip from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import { numberFormatter } from '../../libs/statistics/utils';
import { DASHBOARD_COLOR_PALETTE } from '#libs/dashboard/colors';

type Props = {
  height?: number | string,
  width?: number | string,
  data: Array<{ name: string, value: number }>,
  innerRadius?: number | string,
  outerRadius?: number | string,
  tooltip?: boolean,
  legend?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  isCurrencyFormat?: boolean,
  translationKey?: string,
};

const RenderLegend = (props: { payload: any }) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  const { payload } = props;
  const [legendPopperOpen, setLegendPopperOpen] = useState(false);
  const legendPopperRef = useRef(null);

  const handleClose = () => setLegendPopperOpen(false);

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
    <>
      <div className={classes.legendContainer}>
        <Grid container direction="row">
          {payload.slice(0, 10).map((entry, index) => (
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

        {payload.length > 10 && (
          <div className={classes.legendChipContainer} ref={legendPopperRef}>
            <Chip
              clickable
              variant="outlined"
              label={t('showMoreLegend', { count: payload.length - 10 })}
              onClick={() => setLegendPopperOpen(true)}
            />
          </div>
        )}
      </div>

      <Popover
        open={legendPopperOpen}
        anchorEl={legendPopperRef?.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper className={classes.popperPaper}>
          <div className={classes.popperInnerContainer}>
            {payload.slice(10).map((entry) => (
              <div
                className={classes.inlineContainerStart}
                key={entry.payload.name}
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
            ))}
          </div>
        </Paper>
      </Popover>
    </>
  );
};

export function PieChartComponent(props: Props) {
  const {
    width,
    height,
    margin,
    innerRadius,
    outerRadius,
    tooltip,
    legend,
    isCurrencyFormat,
    translationKey,
  } = props;
  const classes = useStyles(height);
  const { t } = useTranslation();
  const total = props.data.reduce((x, y) => x + y.value, 0);

  let data = props.data
    .map((entry) => ({ ...entry, value: Math.abs(entry.value) }))
    .filter((entry) => entry.value > 0);

  if (translationKey) {
    data = data.map((entry) => ({
      ...entry,
      name: t(`${translationKey}.${entry.name}`),
    }));
  } else {
    data = data.map((entry) => ({ ...entry, name: entry.name ?? 'None' }));
  }

  if (data && data.length === 0) {
    return (
      <div className={classes.noDataMessage}>
        <Typography variant="h6">{t('dashboard:noData')}</Typography>
      </div>
    );
  }

  const colors = DASHBOARD_COLOR_PALETTE;

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
              key={`cell-${entry.name}-${entry.index}`}
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
    alignItems: 'center',
  },
  inlineContainerEnd: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginLeft: theme.spacing(1),
    alignItems: 'center',
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
  legendChipContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  popperPaper: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    maxHeight: 300,
    overflowY: 'scroll',
  },
  popperInnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}));

export default PieChartComponent;
