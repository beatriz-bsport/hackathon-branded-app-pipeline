// @flow

import React, { Component } from 'react';

import { Grid, withStyles, Button } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { goBack, push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import {
  booking as bookingActions,
  member as memberActions,
  consumerPaymentPack as consumerPackActions,
} from '../../actions';
import type {
  MemberDetailed,
  Member as MemberSimplified,
  Booking,
  BookingOption,
} from '../../api/types';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import MemberDetail from '../../libs/member/MemberDetail.component';

type Props = {
  memberLoading: boolean,
  bookingLoading: boolean,
  member: MemberDetailed,

  allMembers: Array<MemberSimplified>,
  bookings: Array<Booking>,
  bookingOptions: Array<BookingOption>,
  classes: Object,
  id: number,
  paymentPacks: Array<PaymentPack>,

  pushToInvoice: (uuid: string) => void,
  fetchMember: (id: number) => void,
  fetchMemberBookings: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  editMember: (id: number) => void,
  billMember: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  createOrUpdateNote: ({ id: ?number, text: string, memberId: number }) => void,
  deleteNote: ({ memberId: number, noteId: number }) => void,

  goBack: () => void,
  t: TFunction,
};

export class Member extends Component<Props> {
  componentWillMount() {
    this.props.fetchMember(this.props.id);
    this.props.fetchMemberBookings(this.props.id);
  }

  render() {
    const { memberLoading, t, classes, member } = this.props;
    if (memberLoading || !member) {
      return <LinearProgress />;
    }
    return (
      <div style={{ height: '100%' }}>
        <Grid container direction="column" spacing={16}>
          <Grid item xs={12}>
            <MemberDetail
              memberId={this.props.id}
              bookingLoading={this.props.bookingLoading}
              member={this.props.member}
              allMembers={this.props.allMembers}
              bookings={this.props.bookings}
              bookingOptions={this.props.bookingOptions}
              paymentPacks={this.props.paymentPacks}
              confirmBookingAttendance={this.props.confirmBookingAttendance}
              discardBookingAttendance={this.props.discardBookingAttendance}
              editMember={this.props.editMember}
              billMember={this.props.billMember}
              incrementCredit={this.props.incrementCredit}
              decrementCredit={this.props.decrementCredit}
              createOrUpdateNote={this.props.createOrUpdateNote}
              deleteNote={this.props.deleteNote}
              onInvoiceClick={this.props.pushToInvoice}
              fetchMemberBookings={this.props.fetchMemberBookings}
              fetchMember={this.props.fetchMember}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={this.props.goBack}
              size="large"
              color="secondary"
              variant="outlined"
              className={classes.backButton}
            >
              {t('navigation.goBack')}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state, { id }) {
  return {
    id,
    memberLoading: state.member.loading,
    member: state.member.member,
    allMembers: state.member.all,
    bookingLoading: state.booking.loading,
    bookings: state.booking.all,
    bookingOptions: state.booking.options,
    paymentPacks: state.paymentPack.all,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchMember(memberId) {
      dispatch(memberActions.fetchMember(memberId));
    },
    fetchMemberBookings(memberId) {
      dispatch(bookingActions.fetchBookingsByMember(memberId));
    },
    confirmBookingAttendance(bookingId) {
      dispatch(bookingActions.confirmBookingAttendance(bookingId));
    },
    discardBookingAttendance(bookingId) {
      dispatch(bookingActions.discardBookingAttendance(bookingId));
    },
    billMember(id) {
      dispatch(routerPush(`/invoice/add/member/${id}`));
    },
    editMember(id) {
      dispatch(routerPush(`/member/edit/${id}`));
    },
    goBack() {
      dispatch(goBack());
    },
    pushToInvoice(uuid: string) {
      dispatch(routerPush(`/invoice/${uuid}`));
    },
    incrementCredit(consumerPackId) {
      dispatch(consumerPackActions.updateCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(consumerPackActions.updateCredit(consumerPackId, -1));
    },
    createOrUpdateNote({ id, text, memberId }) {
      dispatch(memberActions.createOrUpdateNote(id, text, memberId));
    },
    deleteNote({ noteId, memberId }) {
      dispatch(memberActions.deleteNote({ noteId, memberId }));
    },
  };
}

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces([]),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(({ allMembers, match }) => {
    if (match && match.params && match.params.id) {
      const member = (allMembers || []).filter(
        (m) => m.id === parseInt(match.params.id, 10),
      );
      if ((member || []).length === 1) {
        return `${member[0].firstname} ${member[0].lastname}`;
      }
    }
    return '';
  }),
)(Member);
