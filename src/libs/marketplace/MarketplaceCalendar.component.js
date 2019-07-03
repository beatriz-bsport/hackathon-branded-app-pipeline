// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import { Moment } from '../../i18n';

import Calendar from '../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import CoachSelector from './components/CoachSelector.component';
import EstablishmentSelector from './components/EstablishmentSelector.component';
import LevelSelector from './components/LevelSelector.component';

type Props = {
  classes: { [string]: string },
  onSelectDate: () => void,
  selectedDate: *,
  calendarLoading: boolean,
  offers: *[],
  dayOffers: *[],
  dayOffersLoading: boolean,
  onClickOffer: () => void,
  coaches: *[],
  establishments: *[],
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
    coaches,
    establishments,
  } = props;
  console.log(props);
  const events = {};
  offers.forEach((o) => {
    const midnight = Moment(o.date_start).startOf('day');
    if (!events[midnight]) {
      events[midnight] = [];
    }
    events[midnight].push(o);
  });
  return (
    <Grid
      container
      direction="row"
      alignItems="stretch"
      classeName={classes.root}
    >
      <Grid item xs={12} md={7}>
        <Grid container spacing={3} className={classes.leftPanel}>
          <Grid item xs={12}>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <CoachSelector coaches={coaches} onChange={null} />
              </Grid>
              <Grid item xs={6}>
                <LevelSelector onChange={null} />
              </Grid>
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <EstablishmentSelector
                  establishments={establishments}
                  onChange={null}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.calendar}>
            <Calendar
              forceMonthDisplay
              onDateClick={onSelectDate}
              date={selectedDate}
              events={events}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5}>
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
  root: {},
  leftPanel: {
    padding: theme.spacing.unit * 2,
  },
  rightPanel: {
    borderLeft: '1px solid #F0F0F0',
    height: '100%',
  },
  calendar: {
    // borderTop: '1px solid #F0F0F0',
  },
});

export default withStyles(styles)(MarketplaceCalendar);
