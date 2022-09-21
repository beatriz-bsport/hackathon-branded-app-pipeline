// @flow
import React from 'react';

import { compose, withStateHandlers, withState, withHandlers } from 'recompose';
import moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import uniq from 'lodash/uniq';
import withTitle from '../../hocs/with-title.hoc';
import {
  getCoach,
  associatedCoachSelector,
} from '../../libs/associated-coach/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '../../libs/private-service/selectors/private-booking';
import { fetchAllOffers as fetchAllOffersAction } from '../../libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import {
  getOfferAsEventList,
  withMetaActivity,
} from '../../libs/offer/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';
import SlotSpecificEstablishmentDialog from '#libs/private-service/components/availability/SlotSpecificEstablishmentDialog.component';

import { getCoachAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  resetAvailabilitySlots,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
  fetchPrivateBookings as fetchPrivateBookingsAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchPrivateServiceBulk as fetchPrivateServiceBulkAction,
  resetPrivateBookings,
  createOrUpdateCustomEvent as createOrUpdateCustomEventActions,
  fetchCustomEventList as fetchCustomEventListAction,
  resetCustomEvent,
} from '../../libs/private-service/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '../../libs/member/actions';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';
import {
  fetchCoachBulk,
  fetchAssociatedCoachesList as fetchAssociatedCoachesListAction,
} from '../../libs/associated-coach/actions';
import { setCoachScheduleFilter as setCoachScheduleFilterAction } from '../../libs/user-preference/actions';
import { getCoachScheduleFilter } from '../../libs/user-preference/selectors';
import { ScheduleFilter } from '../../libs/user-preference/types';
import { getTheme } from '#libs/theme/selectors';
import { getAllEstablishmentsWithAssociatedId } from '#libs/establishment/selectors';

import { getCustomEventList } from '../../libs/private-service/selectors/custom-event';
import CustomEvenFormDialog from '../../libs/private-service/components/custom-event/CustomEventFormDialog.component';
import { CompanyTheme } from '../../libs/theme/types';
import { EstablishmentWithAssociatedId } from '#libs/establishment/types';

type Props = {
  companyTheme: CompanyTheme,
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
  fetchAssociatedCoachesList: () => void,
  periodFilter: { start: string, end: string },
  fetchCustomEventList: () => void,
  resetCustomEvent: () => void,

  customEventList: Array<CustomEvent>,
  onRequestCustomEvent: (CustomEventData) => void,
  customEventData: ?CustomEventData,
  coach?: Coach,
  createOrUpdateCustomEvent: (CustomEventData, OptionCallback) => void,
  closeCustomEventDialog: () => void,
  fetchAssociatedEstablishments: () => void,
  establishments: Array<EstablishmentWithAssociatedId>,

  scheduleFilter: ScheduleFilter,
  setCoachScheduleFilter: (
    coach: Coach,
    scheduleFilter: ScheduleFilter,
  ) => void,
};

type State = {
  updateAvailabilitySlotData: null | [any, OptionCallback],
  resourceAvailable: null | Array<{
    datatype: 'associated_coach',
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

export class CoachPrivateCalendar extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      updateAvailabilitySlotData: null,
      resourceAvailable: [
        {
          datatype: 'associated_coach',
          data: [
            {
              name: props.coach?.name,
              photo: props.coach?.photo,
              resource_id: props.coach?.associated_coach_id,
            },
          ],
        },
      ],
    };
  }

  enableResourceAvailabilitySlot = (...data) => {
    this.setState({ updateAvailabilitySlotData: data });
  };

  onCancelAvailabilityUpdate = () =>
    this.setState({ updateAvailabilitySlotData: null });

  submitAvailabilitySlotUpdate = (
    restriction_on_associated_establishments: number[],
  ) => {
    const [slotUpdateData, slotUpdateOptions] =
      this.state.updateAvailabilitySlotData;

    const options = {
      onSuccess: (...args) => {
        this.fetchAvailabilitySlots();
        if (slotUpdateOptions && slotUpdateOptions.onSuccess) {
          slotUpdateOptions.onSuccess(...args);
        }
      },
    };

    this.props.enableCoachAvailabilitySlot(
      this.props.id,
      { ...slotUpdateData, restriction_on_associated_establishments },
      options,
    );
    this.onCancelAvailabilityUpdate();
  };

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
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAssociatedEstablishments();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.coach?.id !== this.props.coach?.id) {
      this.setState({
        resourceAvailable: [
          {
            datatype: 'associated_coach',
            data: [
              {
                name: this.props.coach?.name,
                photo: this.props.coach?.photo,
                resource_id: this.props.coach?.associated_coach_id,
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

  setScheduleFilter = (scheduleFilter: ScheduleFilter) => {
    if (this.props.coach) {
      this.props.setCoachScheduleFilter({
        coach: this.props.coach.id,
        scheduleFilter,
      });
    }
  };

  render() {
    const { classes } = this.props;

    if (!this.props.coach) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarWithControls
          disableResourceAvailabilitySlot={this.disableCoachAvailabilitySlot}
          enableResourceAvailabilitySlot={this.enableResourceAvailabilitySlot}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookingList}
          timezone={this.props.companyTheme.timezone_name}
          availabilitySlotUpdating={
            this.props.availabilitySlotUpdating || this.props.loading
          }
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          offerList={this.props.offerList}
          showOfferListToogle
          showPrivateBookingToogle
          showHideCancelledEventsToggle
          fetchAvailabilitySlots={this.fetchAvailabilitySlots}
          refreshOffers={this.fetchWeekData}
          customEventList={this.props.customEventList}
          createCustomEvent={this.props.onRequestCustomEvent}
          showCustomEventsToogle
          companyTheme={this.props.companyTheme}
          scheduleFilter={this.props.scheduleFilter}
          setScheduleFilter={this.setScheduleFilter}
          establishments={this.props.establishments}
          resourceAvailable={this.state.resourceAvailable}
          hideResourceSelector
        />

        {this.props.customEventData && (
          <CustomEvenFormDialog
            coaches={[this.props.coach]}
            onSubmit={this.props.createOrUpdateCustomEvent}
            onClose={this.props.closeCustomEventDialog}
            open
          />
        )}
        {this.state.updateAvailabilitySlotData && (
          <SlotSpecificEstablishmentDialog
            establishments={this.props.establishments}
            onCancel={this.onCancelAvailabilityUpdate}
            onSubmit={this.submitAvailabilitySlotUpdate}
          />
        )}
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ coachId: 'id:number' }),
  withStyles(styles),
  withTranslation(['privateService']),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment().startOf('week').add(-1, 'day').format('YYYY-MM-DD'),
    end: moment().endOf('week').add(1, 'day').format('YYYY-MM-DD'),
  }),
  withStateHandlers(
    { customEventData: null },
    {
      closeCustomEventDialog: () => () => ({ customEventData: null }),
      onRequestCustomEvent: () => (customEventData) => ({ customEventData }),
    },
  ),
  connect(
    (state, { id, periodFilter }) => ({
      availabilitySlots: getCoachAvailabilitySlots(state, id),
      coach: getCoach(state, id),
      associatedCoach: associatedCoachSelector.get(state),
      customEventList: getCustomEventList(state, periodFilter),
      companyTheme: getTheme(state),
      companyId: getTheme(state)?.company,
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
      availabilitySlotUpdating:
        state.privateService.availabilitySlot.createOrUpdate.loading,
      scheduleFilter: getCoachScheduleFilter(state, id),
      establishments: getAllEstablishmentsWithAssociatedId(state),
    }),
    {
      fetchCoach: (id) => fetchCoachBulk([id]),
      fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
      fetchMemberBulkById: fetchMemberBulkByIdAction,
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
      createOrUpdateCustomEvent: createOrUpdateCustomEventActions,
      setCoachScheduleFilter: setCoachScheduleFilterAction,
      fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
      fetchEstablishments: fetchEstablishmentsAction,
    },
  ),
  withHandlers({
    createOrUpdateCustomEvent:
      ({
        createOrUpdateCustomEvent,
        customEventData,
        closeCustomEventDialog,
      }) =>
      (data, options) => {
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
    fetchOfferList:
      ({ fetchAllOffers, fetchMetaActivityBulk, periodFilter, id }) =>
      () => {
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
    handleDateChange:
      ({ setPeriodFilter }) =>
      ({ date_start, date_end }: { date_start: string, date_end: string }) => {
        setPeriodFilter({
          start: moment(date_start).add(-1, 'day').format('YYYY-MM-DD'),
          end: moment(date_end).add(1, 'day').format('YYYY-MM-DD'),
        });
      },
    fetchPrivateBookingList:
      ({
        fetchPrivateBookings,
        fetchPrivateSlotBulk,
        fetchPrivateServiceBulk,
        fetchMemberBulkById,
        periodFilter,
        id,
      }) =>
      () => {
        fetchPrivateBookings(
          {
            coach: id,
            date_start__gte: periodFilter.start,
            date_start__lte: periodFilter.end,
            page_size: null,
          },

          {
            onSuccess: (bookingList) => {
              if (bookingList.length) {
                fetchMemberBulkById(uniq(bookingList.map((b) => b.member)));

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
      ({ fetchCustomEventList, periodFilter, id }) =>
      () => {
        fetchCustomEventList({
          date_start__gte: periodFilter.start,
          date_start__lte: periodFilter.end,
          page_size: null,
          coach: id,
        });
      },
    fetchAssociatedEstablishments:
      ({ companyId, fetchAssociatedEstablishments, fetchEstablishments }) =>
      () => {
        fetchAssociatedEstablishments(
          { company: companyId },
          {
            onSuccess: (associatedEstablishments) => {
              const idList = associatedEstablishments.map((ae) => ae.id) || [];
              if (idList.length > 0) {
                fetchEstablishments({
                  associated_establishment__in: idList,
                  page_size: 300,
                });
              }
            },
          },
        );
      },
  }),
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(CoachPrivateCalendar);
