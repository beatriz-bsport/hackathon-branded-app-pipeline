// @flow
import React, { Component } from 'react';

import {
  Grid,
  Collapse,
  Typography,
  Button,
  Switch,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import DateInput from '../input/DateInput.component';
import NumericInput from '../input/NumericInput.component';
import PriceInput from '../input/PriceInput.component';

import { Moment } from '../../i18n';

import type { Event } from '../../types';

type Props = {
  t: (x: string) => string,
  classes: Object,
  onSubmit: (performanceForm: PerformanceForm) => void,
};

type State = {
  includeBonusOnOversizing: boolean,
  bookingThreshold: number,
  pricePerAdditionalBooking: number,
  pricePerOffer: number,
  date_start: Object,
  date_end: Object,
};

export class CoachPerformanceForm extends Component<Props, State> {
  state = {
    includeBonusOnOversizing: false,
    date_start: Moment().add('months', -1),
    date_end: Moment(),
    pricePerAdditionalBooking: 2,
    pricePerOffer: 20,
    bookingThreshold: 10,
  };

  toogleBonus = (event: Event) => {
    this.setState({ includeBonusOnOversizing: event.target.checked });
  };

  onFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  onSubmit = (event: Event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { t, classes } = this.props;
    const {
      includeBonusOnOversizing,
      date_start,
      date_end,
      pricePerOffer,
      pricePerAdditionalBooking,
      bookingThreshold,
    } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container direction="column" spacing={40}>
          <Grid item>
            <Typography variant="subheading" className={classes.subheading}>
              {t('form.coachPerformance.dateTitle')}
            </Typography>
            <Grid container direction="row" spacing={24}>
              <Grid item>
                <DateInput
                  required
                  value={date_start}
                  onChange={this.onFieldChange('date_start')}
                  label={t('common.from')}
                />
              </Grid>
              <Grid item>
                <DateInput
                  required
                  value={date_end}
                  onChange={this.onFieldChange('date_end')}
                  label={t('common.until')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subheading" className={classes.subheading}>
              {t('form.coachPerformance.remuneration')}
            </Typography>
            <PriceInput
              required
              label={t('form.coachPerformance.pricePerOffer')}
              value={pricePerOffer}
              onChange={(event) => {
                this.onFieldChange('pricePerOffer')(
                  parseFloat(event.target.value),
                );
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={16} alignItems="center">
              <Grid item>
                <Switch
                  color="primary"
                  checked={includeBonusOnOversizing}
                  onChange={this.toogleBonus}
                />
              </Grid>
              <Grid item>
                <Typography>
                  {t('form.coachPerformance.checkboxIncludeABonus')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Collapse in={includeBonusOnOversizing} collapsedHeight="2px">
                <Grid
                  container
                  direction="column"
                  spacing={16}
                  className={classes.paddedLeftBlock}
                >
                  <Grid item>
                    <NumericInput
                      helperText={t(
                        'form.coachPerformance.bookingThresholdHelper',
                      )}
                      label={t('form.coachPerformance.bookingThresholdLabel')}
                      value={bookingThreshold}
                      disabled={!includeBonusOnOversizing}
                      onChange={(event) => {
                        this.onFieldChange('bookingThreshold')(
                          parseFloat(event.target.value),
                        );
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <PriceInput
                      helperText={t(
                        'form.coachPerformance.pricePerAdditionalBookingHelper',
                      )}
                      label={t(
                        'form.coachPerformance.pricePerAdditionalBookingLabel',
                      )}
                      value={pricePerAdditionalBooking}
                      disabled={!includeBonusOnOversizing}
                      onChange={(event) => {
                        this.onFieldChange('pricePerAdditionalBooking')(
                          parseFloat(event.target.value),
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container item justify="center">
              <Button variant="raised" color="primary" type="submit">
                {t('coach.performance.calculate')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

const styles = (theme) => ({
  subheading: { marginBottom: theme.spacing.unit * 2 },
  paddedLeftBlock: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
  },
});

export default withStyles(styles)(translate()(CoachPerformanceForm));
