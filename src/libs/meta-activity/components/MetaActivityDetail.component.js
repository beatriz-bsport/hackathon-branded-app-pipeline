// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { withTranslation, TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import memoize from 'memoize-one';
import { getMergeTags } from '#libs/marketing/utils';

import Calendar from '../../../components/offer/Calendar.component';
import TimeTable from '../../../components/offer/TimeTable.component';
import { DATE_FORMAT } from '../../../utils/datetime';
import BookingCreationNotification from '../../booking/components/BookingCreationNotification.component';
import MetaActivityCard from './MetaActivityCard.component';
import { SmartList } from '#libs/smart-list/types';

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
  onEdit: () => void,
  goToSmartlist: () => void,
  getSmartLists: () => void,
  smartLists: SmartList[],
  tags: { [tag_name: string]: string[] },
  resolvedGenericTags: resolvedGenericTags,
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
    <Grid container alignItems="stretch" direction="row">
      <Grid item className={classes.panel} md={6} sm={12}>
        <MetaActivityCard metaActivity={metaActivity} onEdit={props.onEdit} />
        <BookingCreationNotification
          createNotification={props.createNotification}
          deleteNotification={props.deleteNotification}
          emailDetailLoading={props.emailDetailLoading}
          emailDetails={props.emailDetails}
          emailListLoading={props.emailListLoading}
          emails={props.emails}
          getEmailDetail={props.getEmailDetail}
          getEmails={props.getEmails}
          getSmartLists={props.getSmartLists}
          goToSmartlist={props.goToSmartlist}
          identifier="meta_activity"
          notifications={props.notifications}
          objectId={props.metaActivity.id}
          resolvedGenericTags={props.resolvedGenericTags}
          smartLists={props.smartLists}
          tags={getMergeTags(props.tags, t)}
          updateNotification={props.updateNotification}
        />
      </Grid>
      <Grid item className={classes.panel} md={6} sm={12}>
        <Paper className={classes.fullWidth}>
          <Calendar
            forceMonthDisplay
            date={(props.dateSelected || moment()).format(DATE_FORMAT)}
            events={getEvents(props.events)}
            onDateChange={props.handleDayClick}
          />
          <TimeTable
            loading={props.offersLoading}
            metaActivityId={props.metaActivity ? props.metaActivity.id : null}
            offers={props.offers}
            onOfferSelected={props.goToOffer}
          />
        </Paper>
        <div className={classes.addOfferButton}>
          <Fab
            aria-label="Add"
            color="primary"
            onClick={props.openCreateOfferForm}
            variant="extended"
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
