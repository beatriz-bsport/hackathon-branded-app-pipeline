// @flow
import React from 'react';

import { compose, withHandlers, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';
import uniq from 'lodash/uniq';

import withTitle from '../../hocs/with-title.hoc';
import { getEstablishmentWithAssociatedId } from '../../libs/establishment/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../../libs/private-service/selectors/private-booking';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '../../libs/member/actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import { getOfferAsEventList } from '../../libs/offer/selectors';
import type { ScheduleFilter } from '../../libs/user-preference/types';
import { setEstablishmentScheduleFilter as setEstablishmentScheduleFilterAction } from '../../libs/user-preference/actions';
import { getEstablishmentScheduleFilter } from '../../libs/user-preference/selectors';

import { getEstablishmentAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableEstablishmentAvailabilitySlot,
  enableEstablishmentAvailabilitySlot,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
} from '../../libs/private-service/actions';
import {
  fetchEstablishmentBulk,
  fetchAssociatedEstablishments,
} from '../../libs/establishment/actions';

import { getTheme } from '#libs/theme/selectors';
import { CompanyTheme } from '../../libs/theme/types';
import { EstablishmentWithAssociatedId } from '#libs/establishment/types';

type Props = {
  companyTheme: CompanyTheme,
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

  fetchEstablishmentBulk: (es: Array<number>) => void,
  periodFilter: { start: string, end: string },

  scheduleFilter: ScheduleFilter,
  setEstablishmentScheduleFilter: (
    establishment: number,
    scheduleFilter: ScheduleFilter,
  ) => void,
  fetchAssociatedEstablishments: (data: any) => void,
  companyId: number,
  establishment: EstablishmentWithAssociatedId,
};

type State = {
  resourceAvailable: null | Array<{
    datatype: 'associated_establishment',
    data: Array<{
      name: string,
      photo: string,
      resource_id: number,
    }>,
  }>,
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class EstablishmentCalendar extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      resourceAvailable: [
        {
          datatype: 'associated_establishment',
          data: [
            {
              name: props.establishment?.name,
              photo: props.establishment?.photo,
              resource_id: props.establishment?.associated_establishment_id,
            },
          ],
        },
      ],
    };
  }

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
    this.props.fetchAssociatedEstablishments({ company: this.props.companyId });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.establishment?.id !== this.props.establishment?.id) {
      this.setState({
        resourceAvailable: [
          {
            datatype: 'associated_establishment',
            data: [
              {
                name: this.props.establishment?.name,
                photo: this.props.establishment?.photo,
                resource_id:
                  this.props.establishment?.associated_establishment_id,
              },
            ],
          },
        ],
      });
    }
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

  setScheduleFilter = (scheduleFilter: ScheduleFilter) =>
    this.props.setEstablishmentScheduleFilter({
      establishment: this.props.id,
      scheduleFilter,
    });

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarWithControls
          hideResourceSelector
          showHideCancelledEventsToggle
          showOfferListToogle
          showPrivateBookingToogle
          availabilitySlots={this.props.availabilitySlots}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          companyTheme={this.props.companyTheme}
          disableResourceAvailabilitySlot={
            this.disableEstablishmentAvailabilitySlot
          }
          enableResourceAvailabilitySlot={
            this.enableEstablishmentAvailabilitySlot
          }
          fetchAvailabilitySlots={this.fetchAvailabilitySlots}
          goToMember={this.props.goToMember}
          offerList={this.props.offerList}
          onDateChange={this.props.handleDateChange}
          privateBookings={this.props.privateBookingList}
          refreshOffers={this.fetchWeekData}
          refreshPrivateBookings={this.fetchWeekData}
          resourceAvailable={this.state.resourceAvailable}
          scheduleFilter={this.props.scheduleFilter}
          setScheduleFilter={this.setScheduleFilter}
          timezone={this.props.companyTheme.timezone_name}
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
    start: DateTime.now()
      .startOf('week', { useLocaleWeeks: true })
      .minus({ days: 1 })
      .toISODate(),
    end: DateTime.now()
      .endOf('week', { useLocaleWeeks: true })
      .plus({ days: 1 })
      .toISODate(),
  }),
  connect(
    (state, { id, periodFilter }) => ({
      availabilitySlots: getEstablishmentAvailabilitySlots(state, id),
      companyTheme: getTheme(state),
      companyId: getTheme(state)?.company,
      establishment: getEstablishmentWithAssociatedId(state, id),
      privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
        state,
        null,
        periodFilter,
      ),
      offerList: getOfferAsEventList(state, null, periodFilter),
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
      scheduleFilter: getEstablishmentScheduleFilter(state, id),
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
      fetchMemberBulkById: fetchMemberBulkByIdAction,
      setEstablishmentScheduleFilter: setEstablishmentScheduleFilterAction,
      fetchAssociatedEstablishments,
    },
  ),
  withHandlers({
    fetchOfferList:
      ({ fetchAllOffers, fetchMetaActivityBulk, periodFilter, id }) =>
      () => {
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
    handleDateChange:
      ({ setPeriodFilter }) =>
      ({ date_start, date_end }: { date_start: string, date_end: string }) => {
        setPeriodFilter({
          start: DateTime.fromISO(date_start).minus({ days: 1 }).toISODate(),
          end: DateTime.fromISO(date_end).plus({ days: 1 }).toISODate(),
        });
      },
    fetchPrivateBookingList:
      ({
        fetchPrivateBookings,
        periodFilter,
        fetchPrivateServiceBulk,
        fetchPrivateSlotBulk,
        fetchMemberBulkById,
        id,
      }) =>
      () => {
        fetchPrivateBookings(
          {
            establishment: id,
            date_start__gte: periodFilter.start,
            date_start__lte: periodFilter.end,
            page_size: null,
          },
          {
            onSuccess: (bookingList) => {
              fetchPrivateServiceBulk(
                bookingList.map((b) => b.private_service),
              );
              fetchPrivateSlotBulk(bookingList.map((b) => b.private_slot));
              fetchMemberBulkById(uniq(bookingList.map((b) => b.member)));
            },
          },
        );
      },
  }),
  withTitle(({ establishment }) => {
    return establishment ? `${establishment.title}` : '';
  }),
)(EstablishmentCalendar);
