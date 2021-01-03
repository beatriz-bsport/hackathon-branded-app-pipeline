// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import memoize from 'memoize-one';

import Calendar from '../../../components/offer/Calendar.component';
import TimeTable from '../../../components/offer/TimeTable.component';
import { DATE_FORMAT } from '../../../utils/datetime';
import BookingCreationNotification from '../../booking/components/BookingCreationNotification.component';
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

  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  createNotification: (data: any) => void,
  updateNotification: (id: number, data: any) => void,
  deleteNotification: (notificationId: number) => void,
  notifications: { items: Array<any>, loading: boolean },

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
        <BookingCreationNotification
          notifications={props.notifications}
          objectId={props.metaActivity.id}
          getEmails={props.getEmails}
          emails={props.emails}
          getEmailDetail={props.getEmailDetail}
          emailDetails={props.emailDetails}
          emailListLoading={props.emailListLoading}
          emailDetailLoading={props.emailDetailLoading}
          createNotification={props.createNotification}
          updateNotification={props.updateNotification}
          deleteNotification={props.deleteNotification}
          identifier="meta_activity"
        />
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
            offers={props.offers}
            metaActivityId={props.metaActivity ? props.metaActivity.id : null}
            loading={props.offersLoading}
            onOfferSelected={props.goToOffer}
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
    marginTop: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  panel: {
    width: '100%',
    padding: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['metaActivity']),
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
