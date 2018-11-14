// @flow

import React from 'react';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

type QuickRange = {
  key: string,
  start: Moment,
  end: Moment,
};
type Props = {
  classes: { [string]: string },
  t: TFunction,
  quickRanges: QuickRange[],
  onChange: (Moment, Moment) => void,
  start: Moment,
  end: Moment,
};

export function DateRangeFilter(props: Props) {
  const { start, end, classes, quickRanges, t, onChange } = props;
  return (
    <div className={classes.root}>
      <TextField
        id="date"
        label={t('dateRange.start')}
        type="date"
        value={start.format('YYYY-MM-DD')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label={t('dateRange.end')}
        type="date"
        value={end.format('YYYY-MM-DD')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {quickRanges.map((range) => {
        const selectedColor = range.selected ? 'primary' : 'default';
        return (
          <Button
            key={range.key}
            variant="contained"
            color={selectedColor}
            className={classes.button}
            onClick={() => onChange(range.start, range.end)}
          >
            {t(range.key)}
          </Button>
        );
      })}
    </div>
  );
}

const styles = (theme) => ({
  root: {
    paddingVertical: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces('dashboard'),
)(DateRangeFilter);
