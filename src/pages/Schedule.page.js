// @flow
import React from 'react';

import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'connected-react-router';

import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../libs/private-service/selectors/private-booking';
import { fetchAllOffers as fetchAllOffersAction } from '../libs/offer/actions';
import withTitle from '../hocs/with-title.hoc';
import { getAllPageEstablishments } from '../libs/establishment/selectors';
import { fetchEstablishments } from '../libs/establishment/actions';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../libs/meta-activity/actions';
import { getOfferAsEventList, withMetaActivity } from '../libs/offer/selectors';
import { fetchMemberBulk as fetchMemberBulkAction } from '../libs/member/actions';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';
import {
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent,
} from '../libs/private-service/actions';
import { getCustomEventList } from '../libs/private-service/selectors/custom-event';
import { getPermissions } from '../libs/role/selectors';
import CustomEvenFormDialog from '../libs/private-service/components/custom-event/CustomEventFormDialog.component';

import PrivateCalendarWithControls from '../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
  createOrUpdateCustomEvent as createOrUpdateCustomEventActions,
} from '../libs/private-service/actions';

type Props = {
  classes: Object,
  privateBookingList: Array<PrivateBooking>,
  offerList: Array<Offer>,

  resetPrivateBookings: () => void,

  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  periodFilter: { start: string, end: string },

  fetchPrivateBookingList: () => void,
  fetchOfferList: () => void,
  fetchEstablishments: () => void,
  fetchAssociatedCoachesList: (params: any) => void,
  resourcesByDatatype: Array<ResourceDataGroup>,

  permission: ?Permission,
  pushToCalendar: () => void,
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class CoachPrivateCalendar extends React.Component<Props> {
  componentDidMount() {
    this.props.resetPrivateBookings();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList({ disabled: false });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end
    ) {
      this.props.fetchPrivateBookingList();
      this.props.fetchOfferList();
      this.props.fetchCustomEventList();
    }
  }

  componentWillUnmount() {
    this.props.resetCustomEvent();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <PrivateCalendarWithControls
          availabilitySlots={[]}
          goToCalendar={
            !this.props.permission.navigation && this.props.permission.calendar
              ? this.props.pushToCalendar
              : null
          }
          resourcesByDatatype={this.props.resourcesByDatatype}
          customEventList={this.props.customEventList}
          privateBookings={this.props.privateBookingList}
          createCustomEvent={this.props.onRequestCustomEvent}
          disableAvailabilitySlotDisplay
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          offerList={this.props.offerList}
          refreshOffers={this.props.fetchOfferList}
          refreshPrivateBookings={this.props.fetchPrivateBookingList}
          showOfferListToogle
          showPrivateBookingToogle
        />
        {this.props.customEventData && (
          <CustomEvenFormDialog
            coaches={this.props.availableCoaches}
            onSubmit={this.props.createOrUpdateCustomEvent}
            onClose={this.props.closeCustomEventDialog}
            open
          />
        )}
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('translation:navigation.schedule')),
  withStateHandlers(
    { customEventData: null },
    {
      closeCustomEventDialog: () => () => ({ customEventData: null }),
      onRequestCustomEvent: () => (customEventData) => ({ customEventData }),
    },
  ),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    end: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
  }),
  connect(
    (state, { periodFilter }) => ({
      permission: getPermissions(state),
      resourcesByDatatype: [
        {
          datatype: 'establishment',
          items: getAllPageEstablishments(state),
        },
        {
          datatype: 'coach',
          items: getActiveCoaches(state).map((c) => ({
            title: c.name,
            id: c.id,
            color: c.color,
          })),
        },
      ],
      privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
        state,
        null,
        periodFilter,
      ),
      offerList: withMetaActivity(getOfferAsEventList)(
        state,
        null,
        periodFilter,
      ),
      availableCoaches: getActiveCoaches(state),
      customEventList: getCustomEventList(state, periodFilter),
    }),
    {
      fetchPrivateBookings: fetchPrivateBookingsAction,
      fetchCustomEventList: fetchCustomEventListAction,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllOffers: fetchAllOffersAction,
      resetPrivateBookings,
      resetCustomEvent,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchMemberBulk: fetchMemberBulkAction,
      pushToCalendar: () => push('/calendar'),
      createOrUpdateCustomEvent: createOrUpdateCustomEventActions,
    },
  ),
  withHandlers({
    createOrUpdateCustomEvent: ({
      createOrUpdateCustomEvent,
      customEventData,
      closeCustomEventDialog,
    }) => (data, options) => {
      createOrUpdateCustomEvent(
        { ...data, ...customEventData },
        {
          onSuccess: (...args) => {
            if (options && options.onSuccess) options.onSuccess(...args);
            closeCustomEventDialog();
          },
          onError: options && options.onError,
        },
      );
    },
    fetchOfferList: ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
    }) => () => {
      fetchAllOffers(
        {
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) =>
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity)),
        },
      );
    },
    handleDateChange: ({ setPeriodFilter }) => ({
      date_start,
      date_end,
    }: {
      date_start: string,
      date_end: string,
    }) => {
      setPeriodFilter({ start: date_start, end: date_end });
    },
    fetchPrivateBookingList: ({
      fetchPrivateBookings,
      fetchMemberBulk,
      periodFilter,
    }) => () => {
      fetchPrivateBookings(
        {
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
        },
        {
          onSuccess: (bookingList) => {
            if (bookingList.length) {
              fetchMemberBulk({
                id__in: uniq(bookingList.map((b) => b.member)),
              });
            }
          },
        },
      );
    },
    fetchCustomEventList: ({ fetchCustomEventList, periodFilter }) => () => {
      fetchCustomEventList({
        date_start__gte: periodFilter.start,
        date_start__lte: periodFilter.end,
        page_size: null,
      });
    },
  }),
)(CoachPrivateCalendar);
