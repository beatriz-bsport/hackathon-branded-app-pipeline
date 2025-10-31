import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { DateTime } from 'luxon';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import uniq from 'lodash/uniq';
import { TFunction } from 'i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { conditionToHideSpecificTeacherAvailabilities } from '#src/libs/private-service/utils';

import withTitle from '#src/hocs/with-title.hoc';
import { getMyAssociatedCoachProfile } from '#src/libs/associated-coach/selectors';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import {
  getPrivateBookingListFiltered,
  withRelatedFields,
} from '#src/libs/private-service/selectors/private-booking';
import {
  fetchAllOffers as fetchAllOffersAction,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAction,
} from '#src/libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import {
  getOfferAsEventList,
  getOfferHasPendingReplacementRequest,
} from '#src/libs/offer/selectors';
import { setScheduleFilter as setScheduleFilterAction } from '#src/libs/user-preference/actions';
import { getScheduleFilter } from '#src/libs/user-preference/selectors';
import { ScheduleFilter } from '#src/libs/user-preference/types';

// @ts-expect-error
import PrivateCalendarWithControls from '#src/libs/private-service/components/PrivateCalendarWithControls.component';

import { getMyAvailabilitySlots } from '#src/libs/private-service/selectors/availability-slot';
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
} from '#src/libs/private-service/actions';
import {
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#src/libs/establishment/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';
import mapRouterParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { getAllEstablishmentsWithAssociatedId } from '#src/libs/establishment/selectors';
import SlotSpecificEstablishmentDialog from '#src/libs/private-service/components/availability/SlotSpecificEstablishmentDialog.component';

import { getCustomEventList } from '#src/libs/private-service/selectors/custom-event';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';
import { getAuthToken } from '#src/http';
import Config from '#src/config';

type Period = { start: string; end: string };
type withStateType = {
  periodFilter: Period;
  // eslint-disable-next-line react/no-unused-prop-types
  setPeriodFilter: (periodFilter: Period) => void;
};

type RouterProps = {
  companyId: number;
  scheduleFilter: ScheduleFilter;
  setScheduleFilter: (scheduleFilter: ScheduleFilter) => void;
};
type Props = ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  withStateType &
  WithStyles<typeof styles> &
  RouterProps;

type State = {
  updateAvailabilitySlotData: null | [any, OptionCallback];
  resourceAvailable: null | Array<{
    datatype: 'associated_coach';
    data: Array<{
      name: string;
      photo: string;
      resource_id: number;
    }>;
  }>;
};

export class CoachPrivateCalendar extends React.Component<Props, State> {
  constructor(props: Props) {
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

  componentDidMount() {
    this.props.fetchAssociatedEstablishments();
    this.props.resetPrivateBookings();
  }

  enableResourceAvailabilitySlot = (...data: [any, OptionCallback]) => {
    if (conditionToHideSpecificTeacherAvailabilities()) {
      // Submit enable availability slot withouth displaying establishment selection dialog
      const [slotUpdateData, slotUpdateOptions] = data;
      this.enableCoachAvailabilitySlot(slotUpdateData, {
        onSuccess: () => {
          this.fetchAvailabilitySlots();
          if (slotUpdateOptions && slotUpdateOptions.onSuccess) {
            slotUpdateOptions.onSuccess();
          }
        },
        onError: () => {
          if (slotUpdateOptions && slotUpdateOptions.onError) {
            slotUpdateOptions.onError();
          }
        },
      });
      return;
    }

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
      onSuccess: () => {
        this.fetchAvailabilitySlots();
        if (slotUpdateOptions && slotUpdateOptions.onSuccess) {
          slotUpdateOptions.onSuccess();
        }
      },
    };
    this.enableCoachAvailabilitySlot(
      { ...slotUpdateData, restriction_on_associated_establishments },
      // @ts-expect-error
      options,
    );
    this.onCancelAvailabilityUpdate();
  };

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
      (this.props.coach?.id !== prevProps.coach?.id && this.props.coach?.id)
    ) {
      this.fetchWeekData();
      this.props.fetchCustomEventList();
    }
  }

  componentWillUnmount() {
    this.props.resetCustomEvent();
  }

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

  getCalendarSubscriptionUrl = () => {
    const authToken = getAuthToken();
    const locale = this.props.i18n.language;
    return `${Config.REACT_APP_BASE_URI_BOOK_V1}/booking/calendar-for-teacher/${authToken}/${locale}/booking-feed.ics`;
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
      <>
        <div className={classes.container}>
          {this.props.loading ? <LinearProgress /> : null}
          <PrivateCalendarWithControls
            hideCancelledEventsToggle
            hideResourceSelector
            isCoach
            showCustomEventsToogle
            showOfferListToogle
            showPrivateBookingToogle
            availabilitySlots={this.props.availabilitySlots}
            calendarSyncUrl={this.getCalendarSubscriptionUrl()}
            companyTheme={this.props.companyTheme}
            customEventList={this.props.customEventList}
            disableResourceAvailabilitySlot={this.disableCoachAvailabilitySlot}
            enableResourceAvailabilitySlot={this.enableResourceAvailabilitySlot}
            establishments={this.props.establishments}
            fetchAvailabilitySlots={this.fetchAvailabilitySlots}
            getHasPendingReplacementRequest={
              this.props.getHasPendingReplacementRequest
            }
            offerList={this.props.offerList}
            onDateChange={this.props.handleDateChange}
            privateBookings={this.props.privateBookingList}
            refreshOffers={this.fetchWeekData}
            resourceAvailable={this.state.resourceAvailable}
            scheduleFilter={this.props.scheduleFilter}
            setScheduleFilter={this.props.setScheduleFilter}
            timezone={this.props.companyTheme.timezone_name}
          />
        </div>
        {this.state.updateAvailabilitySlotData && (
          <SlotSpecificEstablishmentDialog
            isCoachProfile
            // @ts-expect-error
            establishments={this.props.establishments}
            onCancel={this.onCancelAvailabilityUpdate}
            onSubmit={this.submitAvailabilitySlotUpdate}
          />
        )}
      </>
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
    // @ts-expect-error
    availabilitySlots: getMyAvailabilitySlots(state),
    customEventList: getCustomEventList(state, periodFilter),
    companyTheme: state.theme.theme,
    privateBookingList: withRelatedFields(getPrivateBookingListFiltered)(
      state,
      // @ts-expect-error
      null,
      periodFilter,
    ),
    offerList: getOfferAsEventList(state, null, periodFilter),
    getHasPendingReplacementRequest:
      getOfferHasPendingReplacementRequest(state),
    loading:
      state.privateService.availabilitySlot.loading ||
      state.privateService.privateBooking.loading,
    coach: getMyAssociatedCoachProfile(state),
    scheduleFilter: getScheduleFilter(state),
    establishments: getAllEstablishmentsWithAssociatedId(state),
  }),
  {
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
    setScheduleFilter: setScheduleFilterAction,
    fetchAssociatedEstablishments: fetchAssociatedEstablishmentsAction,
    fetchEstablishments: fetchEstablishmentsAction,
    listOffersWithPendingReplacementRequestIds:
      listOffersWithPendingReplacementRequestIdsAction,
  },
);

const mapWithHandlers = {
  fetchOfferList:
    ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
      coach,
      listOffersWithPendingReplacementRequestIds,
    }: ConnectedProps<typeof connector> & withStateType) =>
    () => {
      fetchAllOffers(
        {
          coach: coach.id,
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) => {
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity));
            listOffersWithPendingReplacementRequestIds(
              offers.map((o) => o.id),
              false,
            );
          },
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
      fetchMemberBulkById,
      periodFilter,
      coach,
    }: ConnectedProps<typeof connector> & withStateType) =>
    () => {
      fetchPrivateBookings(
        {
          // @ts-expect-error
          coach: coach.id,
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
  fetchAssociatedEstablishments:
    ({
      companyId,
      fetchAssociatedEstablishments,
      fetchEstablishments,
    }: ConnectedProps<typeof connector> & RouterProps) =>
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
};
export default compose(
  mapRouterParamsToProps({ companyId: 'companyId:number' }),
  withStyles(styles),
  withTranslation(['privateService']),
  withState('periodFilter', 'setPeriodFilter', {
    start: DateTime.now().startOf('week', { useLocaleWeeks: true }).toISODate(),
    end: DateTime.now().endOf('week', { useLocaleWeeks: true }).toISODate(),
  }),

  connector,
  // @ts-expect-error
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) =>
    t('navigation:backofficeMenu.schedule'),
  ),
)(CoachPrivateCalendar);
