// @flow
import React from 'react';

import { withState, withProps, compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  fetchAssociatedCoachesList,
  createOrUpdateCoach as updateCoach,
} from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';

import {
  fetchFilteredMembers,
  search as searchMembers,
} from '../../libs/member/actions';
import memberSelector from '../../libs/member/selectors';

import CoachSelectorWithColorCode from '../../libs/associated-coach/components/CoachSelectorWithColorCode.component';
import { getPrivateBookingList } from '../../libs/private-service/selectors/private-booking';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import { getCoachAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  fetchPrivateBookings,
  disablePrivateBooking,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatiblePrivatePass as fetchCompatiblePrivatePassAction,
  fetchCompatiblePrivateConsumerPass as fetchCompatiblePrivateConsumerPassAction,
  registerPrivateBooking,
} from '../../libs/private-service/actions';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import PrivateCalendarComponent from '../../libs/private-service/components/PrivateCalendar.component';
import PrivateBookingManagerForm from '../../libs/private-service/components/PrivateBookingManagerForm.component';
import type {
  PrivateBooking,
  AvailabilitySlot,
} from '../../libs/private-service/types';

type Props = {
  enableCoachAvailabilitySlot: (
    coachId: number,
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => void,
  disableCoachAvailabilitySlot: (
    coachId: number,
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => void,
  fetchAvailabilitySlots: (params: any) => void,
  availabilitySlots: Array<AvailabilitySlot>,

  goToCoachPrivateCalendar: (number) => void,
  fetchPass: (privateSlotId: number, memberId: number) => void,
  registerPrivateBooking: (
    data: any,
    options: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  setBookRequestDate: (?string) => void,
  bookRequestDate: ?string,
  searchedMembers: Array<Member>,
  searchMembers: (string) => void,
  privateServiceList: Array<PrivateService>,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  privatePassList: Array<PrivatePass>,
  billMemberPrivatePass: (memberId: number, privatePassId: number) => void,
  compatiblePassLoading: boolean,
  bookingProcessing: boolean,
  coachId: number,
  coachLoading: boolean,
  coaches: Array<AssociatedCoach>,
  fetchAssociatedCoachesList: () => void,
  updateCoach: (
    data: any,
    options: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  resetCoach: () => void,

  loading: boolean,

  fetchAllPrivateServices: () => void,
  fetchAllPrivateSlots: () => void,
  fetchFilteredMembers: (params: any) => void,

  fetchPrivateBookings: (params: any) => void,
  privateBookings: Array<PrivateBooking>,
  disablePrivateBooking: (id: number, data: { force_refund: boolean }) => void,
  availabilitySlotUpdating: boolean,
  goToMember: (id: number) => void,

  classes: Object,
};

type State = {
  date_start: ?string,
  date_end: ?string,
};

export class CoachPrivateCalendar extends React.Component<Props, State> {
  state = {
    date_start: null,
    date_end: null,
  };

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivateSlots();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.date_start !== this.state.date_start ||
      prevState.date_end !== this.state.date_end ||
      this.props.coachId !== prevProps.coachId
    ) {
      this.fetchWeekData();
    }
  }

  fetchAvailabilitySlots = () => {
    const { date_start, date_end } = this.state;
    this.props.fetchAvailabilitySlots({
      date_start__gte: date_start,
      date_start__lte: date_end,
      ...(this.props.coachId
        ? {
            coach: this.props.coachId,
          }
        : {}),
    });
  };

  fetchPrivateBookingsWithData = (params: any) => {
    this.props.fetchPrivateBookings(params, {
      onSuccess: (bookings) => {
        this.props.fetchFilteredMembers({
          id__in: bookings.map((b) => b.member),
        });
      },
    });
  };

  fetchWeekData = () => {
    const { date_start, date_end } = this.state;
    if (this.props.coachId) {
      this.fetchAvailabilitySlots();
      this.fetchPrivateBookingsWithData({
        coach: this.props.coachId,
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    } else {
      this.fetchAvailabilitySlots();
      this.fetchPrivateBookingsWithData({
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    }
  };

  handleDateChange = ({
    date_start,
    date_end,
  }: {
    date_start: string,
    date_end: string,
  }) => {
    this.setState({ date_start, date_end });
  };

  handleCoachChange = (ev: ?SyntheticEvent<HTMLElement>) => {
    if (ev && ev.target && ev.target.value) {
      this.props.goToCoachPrivateCalendar(ev.target.value);
    } else {
      this.props.resetCoach();
    }
  };

  enableCoachAvailabilitySlot = (
    coachId: number,
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.enableCoachAvailabilitySlot(coachId, data, {
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
    coachId: number,
    data: { date_start: string, date_end: string },
    options: {
      onSuccess: () => void,
      onError: () => void,
    },
  ) => {
    this.props.disableCoachAvailabilitySlot(coachId, data, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.fetchAvailabilitySlots();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  registerPrivateBooking = (data, options) => {
    this.props.registerPrivateBooking(data, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.props.setBookRequestDate(null);
        this.fetchWeekData();
      },
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <CoachSelectorWithColorCode
          coachId={this.props.coachId}
          associatedCoachList={this.props.coaches}
          loading={this.props.coachLoading}
          onChangeCoach={this.handleCoachChange}
          updateCoach={(data) =>
            this.props.updateCoach(data, {
              onSuccess: () => {
                this.fetchWeekData();
              },
            })
          }
        />
        {this.props.loading ? <LinearProgress /> : null}
        <PrivateCalendarComponent
          disableCoachAvailabilitySlot={this.disableCoachAvailabilitySlot}
          enableCoachAvailabilitySlot={this.enableCoachAvailabilitySlot}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookings}
          disablePrivateBooking={this.props.disablePrivateBooking}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          coachId={this.props.coachId}
          goToMember={this.props.goToMember}
          onDateChange={this.handleDateChange}
          onBookRequest={this.props.setBookRequestDate}
        />
        <Dialog
          open={this.props.bookRequestDate}
          onClose={() => this.props.setBookRequestDate(null)}
        >
          <PrivateBookingManagerForm
            onClose={() => this.props.setBookRequestDate(null)}
            date={this.props.bookRequestDate}
            searchedMembers={this.props.searchedMembers}
            searchMembers={this.props.searchMembers}
            associatedCoachList={this.props.coaches}
            privateServiceList={this.props.privateServiceList}
            initial={{ coachId: this.props.coachId }}
            compatiblePrivateConsumerPass={this.props.privateConsumerPassList}
            compatiblePrivatePass={this.props.privatePassList}
            billMemberPrivatePass={this.props.billMemberPrivatePass}
            compatiblePassLoading={this.props.compatiblePassLoading}
            fetchPass={this.props.fetchPass}
            registerPrivateBooking={this.registerPrivateBooking}
            processing={this.props.bookingProcessing}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing.unit,
    minWidth: '100%',
    overflowX: 'auto',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
  },
  leftIcon: { marginRight: theme.spacing.unit },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #E2E2E2',
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ coachId: 'coachId:number' }),
  withStyles(styles),
  withNamespaces(['privateService']),
  connect(
    (state, { coachId }) => ({
      availabilitySlots: getCoachAvailabilitySlots(state, coachId),
      coaches: getActiveCoaches(state),
      coach: getActiveCoaches(state).find((c) => c.id === coachId),
      coachLoading: state.coach.loading,
      privateServiceList: getAvailablePrivateServices(state),
      availabilitySlotUpdating:
        state.privateService.availabilitySlot.createOrUpdate.loading,
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
      privateBookings: getPrivateBookingList(state),
      searchedMembers: memberSelector.getSearched(state),
      compatiblePassLoading:
        state.privateService.privatePass.loading ||
        state.privateService.privateConsumerPass.loading,
      privatePassList: getPrivatePassAvailable(state),
      privateConsumerPassList: getPrivateConsumerPassList(state),
      bookingProcessing:
        state.privateService.privateBooking.createOrUpdate.loading,
    }),
    {
      fetchAssociatedCoachesList,
      fetchAvailabilitySlots,
      fetchPrivateBookings,
      fetchAllPrivateServices,
      fetchAllPrivateSlots,
      fetchFilteredMembers,
      disableCoachAvailabilitySlot,
      disablePrivateBooking,
      searchMembers,
      updateCoach,
      pushRouter: push,
      enableCoachAvailabilitySlot,
      fetchCompatiblePrivatePass: fetchCompatiblePrivatePassAction,
      fetchCompatiblePrivateConsumerPass: fetchCompatiblePrivateConsumerPassAction,
      registerPrivateBooking,
      resetCoach: () => push('/private-service/calendar/'),
      goToCoachPrivateCalendar: (coachId) =>
        push(`/private-service/calendar/${coachId}/`),
      goToMember: (memberId) => push(`/member/${memberId}/`),
    },
  ),
  withTitle(({ t, coach }) => (coach ? coach.name : t('pageTitles.calendar'))),
  withProps(
    ({ fetchCompatiblePrivatePass, fetchCompatiblePrivateConsumerPass }) => ({
      billMemberPrivatePass: (memberId: number, privatePassId) =>
        window.open(
          `/invoice/add/member/${memberId}?withPrivatePass=${privatePassId}`,
        ),
      fetchPass: (privateSlotId, memberId) => {
        fetchCompatiblePrivatePass(privateSlotId);
        fetchCompatiblePrivateConsumerPass(privateSlotId, {
          member: memberId,
        });
      },
    }),
  ),
  withState('bookRequestDate', 'setBookRequestDate', null),
)(CoachPrivateCalendar);
