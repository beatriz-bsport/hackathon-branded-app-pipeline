// @flow
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import withTitle from '../../hocs/with-title.hoc';
import { getCoach } from '../../libs/associated-coach/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { getPrivateBookingListFiltered } from '../../libs/private-service/selectors/private-booking';
import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import {
  getOfferAsEventList,
  withMetaActivity,
} from '../../libs/offer/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import { getCoachAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
} from '../../libs/private-service/actions';
import { fetchCoachBulk } from '../../libs/associated-coach/actions';

type Props = {
  classes: Object,
  fetchAvailabilitySlots: (data: { coach: number }) => void,
  availabilitySlots: Array<AvailabilitySlot>,

  loading: boolean,
  privateBookingList: Array<PrivateBooking>,
  offerList: Array<Offer>,
  availabilitySlotUpdating: boolean,
  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  resetAvailabilitySlots: () => void,
  enableCoachAvailabilitySlot: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
  disableCoachAvailabilitySlot: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
  id: number,

  fetchOfferList: () => void,

  resetPrivateBookings: () => void,
  fetchPrivateBookingList: () => void,

  fetchCoach: (number) => void,
  periodFilter: { start: string, end: string },
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class CoachPrivateCalendar extends React.Component<Props> {
  fetchAvailabilitySlots = () => {
    this.props.resetAvailabilitySlots();
    this.props.fetchAvailabilitySlots({
      date_start__lte: this.props.periodFilter.end,
      date_start__gte: this.props.periodFilter.start,
      coach: this.props.id,
    });
  };

  componentDidMount() {
    this.props.resetPrivateBookings();
    this.props.fetchCoach(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end ||
      this.props.id !== prevProps.id
    ) {
      this.fetchAvailabilitySlots();
      this.props.fetchPrivateBookingList();
      this.props.fetchOfferList();
    }
  }

  enableCoachAvailabilitySlot = (
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.enableCoachAvailabilitySlot(this.props.id, data, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.fetchAvailabilitySlots();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  disableCoachAvailabilitySlot = (
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.disableCoachAvailabilitySlot(this.props.id, data, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.fetchAvailabilitySlots();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
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
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          offerList={this.props.offerList}
          showOfferListToogle
          showPrivateBookingToogle
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ coachId: 'id:number' }),
  withStyles(styles),
  withNamespaces(['privateService']),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    end: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
  }),
  connect(
    (state, { id, periodFilter }) => ({
      availabilitySlots: getCoachAvailabilitySlots(state, id),
      coach: getCoach(state, id),
      privateBookingList: getPrivateBookingListFiltered(
        state,
        null,
        periodFilter,
      ),
      offerList: withMetaActivity(getOfferAsEventList)(
        state,
        null,
        periodFilter,
      ),
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
    }),
    {
      fetchCoach: (id) => fetchCoachBulk([id]),
      fetchPrivateBookings: fetchPrivateBookingsAction,
      fetchAllOffers: fetchAllOffersAction,
      resetPrivateBookings,
      fetchAvailabilitySlots,
      resetAvailabilitySlots,
      disableCoachAvailabilitySlot,
      enableCoachAvailabilitySlot,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    },
  ),
  withHandlers({
    fetchOfferList: ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
      id,
    }) => () => {
      fetchAllOffers(
        {
          coach: id,
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
      periodFilter,
      id,
    }) => () => {
      fetchPrivateBookings({
        coach: id,
        date_start__gte: periodFilter.start,
        date_start__lte: periodFilter.end,
        page_size: null,
      });
    },
  }),
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(CoachPrivateCalendar);
