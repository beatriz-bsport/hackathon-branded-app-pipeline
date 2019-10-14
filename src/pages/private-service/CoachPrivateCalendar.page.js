// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

// import type { TFunction } from 'react-i18next';

import './main.scss';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import CoachInput from '../../components/input/CoachInput.component';

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
  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivateSlots();
  }

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

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.container}>
        {this.props.loading ? <BackofficeLinearProgress /> : null}
        <div className={classes.coachSelectorLoading}>
          <CoachInput
            required
            value={this.props.coachId}
            onChange={this.handleCoachChange}
            label={t('calendar.input.coach.label')}
            choices={this.props.coaches}
            onDelete={() => this.handleCoachChange(null)}
          />
          {this.props.coachLoading ? (
            <CircularProgress className={classes.leftIcon} size="small" />
          ) : null}
        </div>
        <CoachPrivateCalendarComponent
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
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    minWidth: '100%',
    overflowX: 'auto',
  },
  leftIcon: { marginRight: theme.spacing.unit },
  coachSelectorLoading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
      enableCoachAvailabilitySlot,
      resetCoach: () => push('/private-service/calendar/'),
      goToCoachPrivateCalendar: (coachId) =>
        push(`/private-service/calendar/${coachId}/`),
      goToMember: (memberId) => push(`/member/${memberId}/`),
    },
  ),
  withTitle(({ t, coach }) => (coach ? coach.name : t('pageTitles.calendar'))),
)(CoachPrivateCalendar);
