// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

// import type { TFunction } from 'react-i18next';

import './main.scss';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  fetchAssociatedCoachesList,
  createOrUpdateCoach as updateCoach,
} from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import CoachInput from '../../components/input/CoachInput.component';
import CoachColorModifier from '../../libs/associated-coach/components/CoachColorModifier.component';

import { getPrivateBookingList } from '../../libs/private-service/selectors/private-booking';
import { getCoachAvailabilitySlots } from '../../libs/private-service/selectors/availability-slot';
import {
  fetchAvailabilitySlots,
  fetchPrivateBookings,
  disablePrivateBooking,
  disableCoachAvailabilitySlot,
  enableCoachAvailabilitySlot,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
} from '../../libs/private-service/actions';
import { fetchFilteredMembers } from '../../libs/member/actions';
import CoachPrivateCalendarComponent from '../../libs/private-service/components/CoachPrivateCalendar.component';
import type {
  PrivateBooking,
  AvailabilitySlot,
} from '../../libs/private-service/types';

type Props = {
  enableCoachAvailabilitySlot: (any) => void,
  disableCoachAvailabilitySlot: (any) => void,
  fetchAvailabilitySlots: (params: any) => void,
  availabilitySlots: Array<AvailabilitySlot>,

  goToCoachPrivateCalendar: (number) => void,

  coachId: number,
  coachLoading: boolean,
  coaches: Array<AssociatedCoach>,
  fetchAssociatedCoachesList: () => void,
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
  t: TFunction,
};

export class CoachPrivateCalendar extends React.Component<Props> {
  state = {
    date_start: null,
    date_end: null,
  };

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivateSlots();
  }

  fetchWeekData = () => {
    const { date_start, date_end } = this.state;
    if (this.props.coachId) {
      this.props.fetchAvailabilitySlots({
        coach: this.props.coachId,
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
      this.props.fetchPrivateBookings({
        coach: this.props.coachId,
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    } else {
      this.props.fetchAvailabilitySlots({
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
      this.props.fetchPrivateBookings({
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.date_start !== this.state.date_start ||
      prevState.date_end !== this.state.date_end ||
      this.props.coachId !== prevProps.coachId
    ) {
      this.fetchWeekData();
    }
  }

  handleDateChange = ({ date_start, date_end }) => {
    this.setState({ date_start, date_end });
  };

  handleCoachChange = (ev: ?SyntheticEvent<HTMLElement>) => {
    if (ev && ev.target && ev.target.value) {
      this.props.goToCoachPrivateCalendar(ev.target.value);
    } else {
      this.props.resetCoach();
    }
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

  renderHeader = () => {
    const { classes, coachId, coaches, coachLoading, t } = this.props;
    return (
      <div className={classes.header}>
        <div className={classes.coachSelectorLoading}>
          <CoachInput
            required
            value={coachId}
            onChange={this.handleCoachChange}
            label={t('calendar.input.coach.label')}
            choices={coaches}
            onDelete={() => this.handleCoachChange(null)}
          />
          {coachLoading ? (
            <CircularProgress className={classes.leftIcon} size="small" />
          ) : null}
        </div>
        <div className={classes.row}>
          <CoachColorModifier
            associatedCoachList={
              coachId ? coaches.filter((c) => c.id === coachId) : coaches
            }
            updateCoach={(data) =>
              this.props.updateCoach(data, {
                onSuccess: () => {
                  this.fetchWeekData();
                },
              })
            }
          />
        </div>
      </div>
    );
  };

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        {this.renderHeader()}
        {this.props.loading ? <LinearProgress /> : null}
        <CoachPrivateCalendarComponent
          ref={this.calendar}
          fetchAvailabilitySlots={this.props.fetchAvailabilitySlots}
          fetchPrivateBookings={this.fetchPrivateBookingsWithData}
          disableCoachAvailabilitySlot={this.props.disableCoachAvailabilitySlot}
          enableCoachAvailabilitySlot={this.props.enableCoachAvailabilitySlot}
          availabilitySlots={this.props.availabilitySlots}
          privateBookings={this.props.privateBookings}
          disablePrivateBooking={this.props.disablePrivateBooking}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
          coachId={this.props.coachId}
          goToMember={this.props.goToMember}
          onDateChange={this.handleDateChange}
        />
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
  coachSelectorLoading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -theme.spacing.unit * 2,
  },
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
      availabilitySlotUpdating:
        state.privateService.availabilitySlot.createOrUpdate.loading,
      loading:
        state.privateService.availabilitySlot.loading ||
        state.privateService.privateBooking.loading,
      privateBookings: getPrivateBookingList(state),
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
      updateCoach,
      enableCoachAvailabilitySlot,
      resetCoach: () => push('/private-service/calendar/'),
      goToCoachPrivateCalendar: (coachId) =>
        push(`/private-service/calendar/${coachId}/`),
      goToMember: (memberId) => push(`/member/${memberId}/`),
    },
  ),
  withTitle(({ t, coach }) => (coach ? coach.name : t('pageTitles.calendar'))),
)(CoachPrivateCalendar);
