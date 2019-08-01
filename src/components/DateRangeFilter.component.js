// @flow

import React from 'react';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { Moment } from 'moment';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import DateInput from './input/DateInput.component';

type QuickRange = {
  key: string,
  start: Moment,
  end: Moment,
  selected: boolean,
  onClick: (Moment, Moment, ?string) => void,
};
type Props = {
  classes: { [string]: string },
  t: TFunction,
  quickRanges: QuickRange[],
  onChange: (Moment, Moment, ?string) => void,
  start: Moment,
  end: Moment,
};

export function DateRangeFilter(props: Props) {
  const { start, end, classes, quickRanges, t, onChange } = props;
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      className={classes.root}
    >
      <Grid item>
        <DateInput
          className={classes.dateInput}
          id="date"
          label={t('dateRange.start')}
          type="date"
          value={start.format('YYYY-MM-DD')}
          onChange={(value) => onChange(value, end, null)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <DateInput
          id="date"
          label={t('dateRange.end')}
          type="date"
          value={end.format('YYYY-MM-DD')}
          onChange={(value) => onChange(start, value, null)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item>
        {quickRanges.map((range) => {
          const selectedColor = range.selected ? 'primary' : 'default';
          return (
            <Button
              key={range.key}
              variant="outlined"
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
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
  },
  dateInput: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces('dashboard'),
)(DateRangeFilter);
