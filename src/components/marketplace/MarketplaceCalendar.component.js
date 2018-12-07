// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { Moment } from '../../i18n';

import Calendar from '../offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';

type Props = {
  classes: { [string]: string },
  onSelectDate: () => void,
  selectedDate: *,
  calendarLoading: boolean,
  offers: *[],
  dayOffers: *[],
  dayOffersLoading: boolean,
  onClickOffer: () => void,
};

export function MarketplaceCalendar(props: Props) {
  const {
    classes,
    onSelectDate,
    selectedDate,
    calendarLoading,
    offers,
    dayOffers,
    dayOffersLoading,
  } = props;
  const events = {};
  offers.forEach((o) => {
    const midnight = Moment(o.date_start).startOf('day');
    if (!events[midnight]) {
      events[midnight] = [];
    }
    events[midnight].push(o);
  });
  return (
    <Grid container direction="row" alignItems="stretch">
      <Grid item xs={12} md={6}>
        <div className={classes.leftPanel}>
          <Calendar
            forceMonthDisplay
            onDateClick={onSelectDate}
            date={selectedDate}
            events={events}
          />
        </div>
      </Grid>
      <Grid item xs={12} md={6}>
        <div className={classes.rightPanel}>
          <MarketplaceTimetable
            offers={dayOffers}
            date={selectedDate}
            onClickOffer={props.onClickOffer}
            loading={dayOffersLoading}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        {calendarLoading ? <LinearProgress /> : null}
      </Grid>
    </Grid>
  );
}

const styles = (theme) => ({
  leftPanel: {
    padding: theme.spacing.unit * 2,
  },
  rightPanel: {
    borderLeft: '1px solid #F0F0F0',
    height: '100%',
  },
});

export default withStyles(styles)(MarketplaceCalendar);
