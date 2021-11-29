// @flow

import React from 'react';
import moment, { Moment } from 'moment-timezone';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import DateInput from './input/DateInput.component';

type Props = {
  classes: { [string]: string },
  t: TFunction,
  dateRange: { start: Moment, end: Moment, kind: string },
  onChange: (Moment, Moment, ?string) => void,
  hideDatePickers: boolean,
};

export function DateRangeFilter(props: Props) {
  const { classes, t, onChange, dateRange } = props;
  const quickRanges = [
    {
      key: 'current_week',
      start: moment().subtract(7, 'days'),
      end: moment(),
      selected: dateRange.kind === 'current_week',
    },
    {
      key: 'current_month',
      start: moment().subtract(1, 'month'),
      end: moment(),
      selected: dateRange.kind === 'current_month',
    },
    {
      key: 'last_three_months',
      start: moment().subtract(3, 'months'),
      end: moment(),
      selected: dateRange.kind === 'last_three_months',
    },
    {
      key: 'current_year',
      start: moment().subtract(1, 'year'),
      end: moment(),
      selected: dateRange.kind === 'current_year',
    },
  ];
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      className={classes.root}
    >
      {!props.hideDatePickers ? (
        <Grid item>
          <DateInput
            className={classes.dateInput}
            id="date"
            label={t('dateRange.start')}
            type="date"
            value={dateRange.start.format('YYYY-MM-DD')}
            onChange={(value) => onChange(value, dateRange.end, null)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DateInput
            id="date"
            label={t('dateRange.end')}
            type="date"
            value={dateRange.end.format('YYYY-MM-DD')}
            onChange={(value) => onChange(dateRange.start, value, null)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      ) : null}
      <Grid item>
        {quickRanges.map((range) => {
          const selectedColor = range.selected ? 'primary' : 'default';
          return (
            <Button
              key={range.key}
              variant="outlined"
              size="small"
              color={selectedColor}
              className={classes.button}
              onClick={() => onChange(range.start, range.end, range.key)}
            >
              {t(range.key)}
            </Button>
          );
        })}
      </Grid>
    </Grid>
  );
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  dateInput: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation('dashboard'),
)(DateRangeFilter);
