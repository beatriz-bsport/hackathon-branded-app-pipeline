// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import memoize from 'memoize-one';

import Calendar from '../../../components/offer/Calendar.component';
import TimeTable from '../../../components/offer/TimeTable.component';
import { DATE_FORMAT } from '../../../datetime';
import MetaActivityCard from './MetaActivityCard.component';

type Props = {
  metaActivity: MetaActivity,
  dateSelected: Object,
  handleDayClick: (date: string) => void,
  offers: Array<Offer>,
  events: Array<Event>,
  openCreateOfferForm: () => void,
  offersLoading: boolean,
  goToOffer: (Offer) => void,

  classes: Object,
  t: TFunction,
};

const getEvents = memoize((events) => {
  const events_ = {};
  for (const o of events) {
    const midnight = moment(o.date_start).startOf('day');

    if (Object.prototype.hasOwnProperty.call(events_, midnight)) {
      events_[midnight].push(o);
    } else {
      events_[midnight] = [o];
    }
  }
  return events_;
});

export const MetaActivityDetail = (props: Props) => {
  const { metaActivity, classes, t } = props;
  return (
    <Grid container direction="row" alignItems="stretch">
      <Grid item sm={12} md={6} className={classes.panel}>
        <MetaActivityCard metaActivity={metaActivity} />
      </Grid>
      <Grid item sm={12} md={6} className={classes.panel}>
        <Paper className={classes.fullWidth}>
          <Calendar
            date={(props.dateSelected || moment()).format(DATE_FORMAT)}
            onDateClick={props.handleDayClick}
            forceMonthDisplay
            events={getEvents(props.events)}
          />
          <TimeTable
            date={props.dateSelected}
            offers={props.offers}
            metaActivityId={props.metaActivity ? props.metaActivity.id : null}
            loading={props.offersLoading}
            onOfferSelected={(o) => props.goToOffer(o)}
          />
        </Paper>
        <div className={classes.addOfferButton}>
          <Fab
            variant="extended"
            aria-label="Add"
            color="primary"
            onClick={props.openCreateOfferForm}
          >
            <AddIcon className={classes.leftIcon} />
            {t('addOffers')}
          </Fab>
        </div>
      </Grid>
    </Grid>
  );
};
const styles = (theme) => ({
  addOfferButton: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  panel: {
    width: '100%',
    padding: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['metaActivity']),
  withStyles(styles),
  withState('dateSelected', 'setDateSelected', null),
  withProps(({ setDateSelected, fetchOffersByDay }) => ({
    handleDayClick: (date: string) => {
      const momentDate = moment(date, DATE_FORMAT);
      setDateSelected(momentDate);
      fetchOffersByDay(momentDate);
    },
  })),
)(MetaActivityDetail);
