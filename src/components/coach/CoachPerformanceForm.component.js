// @flow

import React from 'react';

import { compose, withStateHandlers, withHandlers } from 'recompose';

import { Grid, Typography, Button, withStyles } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import DateInput from '../input/DateInput.component';

import { Moment } from '../../i18n';

type Props = {
  t: (x: string) => string,
  classes: Object,
  dateStart: Moment,
  dateEnd: Moment,
  changeDateStart: (event: Object) => void,
  changeDateEnd: (event: Object) => void,
  onSubmit: (performanceForm: PerformanceForm) => void,
};

export function CoachPerformanceForm(props: Props) {
  const { t, classes, dateStart, dateEnd } = props;
  return (
    <form onSubmit={props.onSubmit}>
      <DateInput
        required
        value={dateStart}
        onChange={props.changeDateStart}
        label={t('common.from')}
        className={classes.dateInput}
        fullWidth
      />
      <DateInput
        required
        value={dateEnd}
        onChange={props.changeDateEnd}
        label={t('common.until')}
        className={classes.dateInput}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className={classes.button}
      >
        {t('calculate')}
      </Button>
    </form>
  );
}

const styles = (theme) => ({
  button: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  dateInput: {
    marginRight: theme.spacing.unit * 2,
  },
  subheading: { marginBottom: theme.spacing.unit * 2 },
  bonusRules: { marginRight: theme.spacing.unit * 2 },
  leftButton: { marginRight: theme.spacing.unit },
});

export default compose(
  withStyles(styles),
  withNamespaces(['paymentRules', 'coachPerformance', 'translation']),
  withStateHandlers(
    {
      dateStart: Moment().subtract(1, 'month'),
      dateEnd: Moment(),
    },
    {
      changeDateStart: () => (dateStart: Moment) => ({ dateStart }),
      changeDateEnd: () => (dateEnd: Moment) => ({ dateEnd }),
    },
  ),
  withHandlers({
    onSubmit: ({ dateStart, dateEnd, onSubmit }) => (event) => {
      event.preventDefault();
      onSubmit({ dateStart, dateEnd });
    },
  }),
)(CoachPerformanceForm);
