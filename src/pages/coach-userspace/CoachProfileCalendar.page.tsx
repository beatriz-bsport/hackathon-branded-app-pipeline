// @flow
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import uniq from 'lodash/uniq';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { TFunction } from 'i18next';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import withTitle from '#hocs/with-title.hoc';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '#libs/private-service/selectors/private-booking';
import { fetchAllOffers as fetchAllOffersAction } from '#libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { getOfferAsEventList, withMetaActivity } from '#libs/offer/selectors';

import PrivateCalendarWithControls from '#libs/private-service/components/PrivateCalendarWithControls.component';

import { getMyAvailabilitySlots } from '#libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  resetPrivateBookings,
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent,
} from '#libs/private-service/actions';
import { fetchMemberBulk as fetchMemberBulkAction } from '#libs/member/actions';
import mapRouterParamsToProps from '#hocs/router-params-to-props.hoc';

import { getCustomEventList } from '#libs/private-service/selectors/custom-event';

type Period = { start: string; end: string };
type withStateType = {
  periodFilter: Period;
  setPeriodFilter: (periodFilter: Period) => void;
};
type RouterProps = { companyId: number };
type Props = ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers> &
  withStateType &
  WithStyles<typeof styles> &
  RouterProps;

export class CoachPrivateCalendar extends React.Component<Props> {
  fetchAvailabilitySlots = () => {
    this.props.resetAvailabilitySlots();
    if (this.props.coach.id) {
      this.props.fetchAvailabilitySlots({
        date_start__lte: this.props.periodFilter.end,
        date_start__gte: this.props.periodFilter.start,
        coach: this.props.coach?.id,
        company: this.props.companyId,
      });
    }
  };

  componentDidMount() {
    this.props.resetPrivateBookings();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end ||
      (this.props.coach?.id !== prevProps.coach?.id && this.props.coach?.id)
    ) {
      this.fetchWeekData();
      this.props.fetchCustomEventList();
    }
  }

  componentWillUnmount() {
    this.props.resetCustomEvent();
  }

  fetchWeekData = () => {
    this.fetchAvailabilitySlots();
    this.props.fetchPrivateBookingList();
    this.props.fetchOfferList();
  };

  enableCoachAvailabilitySlot = (
    data: { date_start: string; date_end: string },
    options: {
      onSuccess: () => void;
      onError: () => void;
    },
  ) => {
    this.props.enableCoachAvailabilitySlot(
      this.props.coach?.id,
      { ...data, company: this.props.companyId },
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.fetchAvailabilitySlots();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      },
    );
  };

  disableCoachAvailabilitySlot = (
    data: { date_start: string; date_end: string },
    options: {
      onSuccess: () => void;
      onError: () => void;
    },
  ) => {
    this.props.disableCoachAvailabilitySlot(
      this.props.coach.id,
      { ...data, company: this.props.companyId },
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          this.fetchAvailabilitySlots();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      },
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarWithControls
          disableResourceAvailabilitySlot={this.disableCoachAvailabilitySlot}
          enableResourceAvailabilitySlot={this.enableCoachAvailabilitySlot}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookingList}
          timezone={this.props.companyTheme.timezone_name}
          onDateChange={this.props.handleDateChange}
          offerList={this.props.offerList}
          showOfferListToogle
          showPrivateBookingToogle
          hideCancelledEventsToggle
          fetchAvailabilitySlots={this.fetchAvailabilitySlots}
          refreshOffers={this.fetchWeekData}
          customEventList={this.props.customEventList}
          showCustomEventsToogle
          companyTheme={this.props.companyTheme}
          isCoach
        />
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {},
    leftIcon: { marginRight: theme.spacing(1) },
  });

const connector = connect(
  (state: RootState, { periodFilter }: withStateType) => ({
    availabilitySlots: getMyAvailabilitySlots(state),
    customEventList: getCustomEventList(state, periodFilter),
    companyTheme: state.theme.theme,
    privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
      state,
      null,
      periodFilter,
    ),
    offerList: withMetaActivity(getOfferAsEventList)(state, null, periodFilter),
    loading:
      state.privateService.availabilitySlot.loading ||
      state.privateService.privateBooking.loading,
    coach: getMyAssociatedCoachProfile(state),
  }),
  {
    fetchMemberBulk: fetchMemberBulkAction,
    fetchCustomEventList: fetchCustomEventListAction,
    fetchPrivateBookings: fetchPrivateBookingsAction,
    fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
    fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
    fetchAllOffers: fetchAllOffersAction,
    resetPrivateBookings,
    resetCustomEvent,
    fetchAvailabilitySlots,
    resetAvailabilitySlots,
    disableCoachAvailabilitySlot,
    enableCoachAvailabilitySlot,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  },
);

const mapWithHandlers = {
  fetchOfferList:
    ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
      coach,
    }: ConnectedProps<typeof connector> & withStateType) =>
    () => {
      fetchAllOffers(
        {
          coach: coach.id,
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) =>
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity)),
        },
      );
    },
  handleDateChange:
    ({ setPeriodFilter }: ConnectedProps<typeof connector> & withStateType) =>
    ({ date_start, date_end }: { date_start: string; date_end: string }) => {
      setPeriodFilter({ start: date_start, end: date_end });
    },
  fetchPrivateBookingList:
    ({
      fetchPrivateBookings,
      fetchPrivateSlotBulk,
      fetchPrivateServiceBulk,
      fetchMemberBulk,
      periodFilter,
      coach,
    }: ConnectedProps<typeof connector> & withStateType) =>
    () => {
      fetchPrivateBookings(
        {
          coach: coach.id,
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

              fetchPrivateServiceBulk(
                bookingList.map((b) => b.private_service),
              );

              fetchPrivateSlotBulk(bookingList.map((b) => b.private_slot));
            }
          },
        },
      );
    },
  fetchCustomEventList:
    ({
      fetchCustomEventList,
      periodFilter,
      coach,
    }: ConnectedProps<typeof connector> & withStateType) =>
    () => {
      fetchCustomEventList({
        date_start__gte: periodFilter.start,
        date_start__lte: periodFilter.end,
        page_size: null,
        coach: coach.id,
      });
    },
};
export default compose(
  mapRouterParamsToProps({ companyId: 'companyId:number' }),
  withStyles(styles),
  withTranslation(['privateService']),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment().startOf('week').format('YYYY-MM-DD'),
    end: moment().endOf('week').format('YYYY-MM-DD'),
  }),

  connector,
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) =>
    t('navigation:backofficeMenu.schedule'),
  ),
)(CoachPrivateCalendar);
