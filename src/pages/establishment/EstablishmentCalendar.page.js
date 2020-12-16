// @flow
import React from 'react';

import { compose, withHandlers, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';
import uniq from 'lodash/uniq';

import withTitle from '../../hocs/with-title.hoc';
import { getEstablishment } from '../../libs/establishment/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../../libs/private-service/selectors/private-booking';
import { fetchMemberBulk as fetchMemberBulkAction } from '../../libs/member/actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import {
  getOfferAsEventList,
  withMetaActivity,
} from '../../libs/offer/selectors';

import { getEstablishmentAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot.ts';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableEstablishmentAvailabilitySlot,
  enableEstablishmentAvailabilitySlot,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
} from '../../libs/private-service/actions.ts';
import { fetchEstablishmentBulk } from '../../libs/establishment/actions';

type Props = {
  theme: CompanyTheme,
  classes: Object,
  fetchAvailabilitySlots: (data: any) => void,
  loading: boolean,
  privateBookingList: Array<PrivateBooking>,
  offerList: Array<Offer>,
  availabilitySlotUpdating: boolean,
  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  availabilitySlots: Array<AvailabilitySlot>,
  resetAvailabilitySlots: () => void,
  enableEstablishmentAvailabilitySlot: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
  disableEstablishmentAvailabilitySlot: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
  id: number,

  fetchOfferList: () => void,

  resetPrivateBookings: () => void,
  fetchPrivateBookingList: () => void,

  fetchEstablishmentBulk: (Array<number>) => void,
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
      establishment: this.props.id,
    });
    this.props.fetchPrivateBookingList();
    this.props.fetchOfferList();
  };

  componentDidMount() {
    this.props.resetPrivateBookings();
    this.props.fetchEstablishmentBulk([this.props.id]);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end ||
      this.props.id !== prevProps.id
    ) {
      this.fetchWeekData();
    }
  }

  fetchWeekData = () => {
    this.fetchAvailabilitySlots();
    this.fetchEvents();
  };

  fetchEvents = () => {
    this.props.fetchPrivateBookingList();
    this.props.fetchOfferList();
  };

  enableEstablishmentAvailabilitySlot = (
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.enableEstablishmentAvailabilitySlot(this.props.id, data, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.fetchAvailabilitySlots();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  disableEstablishmentAvailabilitySlot = (
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.disableEstablishmentAvailabilitySlot(this.props.id, data, {
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
          disableResourceAvailabilitySlot={
            this.disableEstablishmentAvailabilitySlot
          }
          enableResourceAvailabilitySlot={
            this.enableEstablishmentAvailabilitySlot
          }
          showOfferListToogle
          showPrivateBookingToogle
          fetchAvailabilitySlots={this.fetchAvailabilitySlots}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookingList}
          offerList={this.props.offerList}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          refreshOffers={this.fetchWeekData}
          refreshPrivateBookings={this.fetchWeekData}
          timezone={this.props.theme.timezone_name}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withTranslation(['privateService']),
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
      availabilitySlots: getEstablishmentAvailabilitySlots(state, id),
      theme: state.theme.theme,
      establishment: getEstablishment(state, id),
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
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
    }),
    {
      fetchAvailabilitySlots,
      resetAvailabilitySlots,
      fetchPrivateBookings: fetchPrivateBookingsAction,
      resetPrivateBookings,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchAllOffers: fetchAllOffersAction,
      fetchEstablishmentBulk,
      disableEstablishmentAvailabilitySlot,
      enableEstablishmentAvailabilitySlot,
      fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
      fetchPrivateServiceBulk: fetchPrivateServiceBulkAction,
      fetchMemberBulk: fetchMemberBulkAction,
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
          establishment: id,
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) => {
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity));
          },
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
      fetchPrivateServiceBulk,
      fetchPrivateSlotBulk,
      fetchMemberBulk,
      id,
    }) => () => {
      fetchPrivateBookings(
        {
          establishment: id,
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
        },
        {
          onSuccess: (bookingList) => {
            fetchPrivateServiceBulk(bookingList.map((b) => b.private_service));
            fetchPrivateSlotBulk(bookingList.map((b) => b.private_slot));
            fetchMemberBulk({ id__in: uniq(bookingList.map((b) => b.member)) });
          },
        },
      );
    },
  }),
  withTitle(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(CoachPrivateCalendar);
