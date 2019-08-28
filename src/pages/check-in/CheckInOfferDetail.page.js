// @flow

import React from 'react';
import { compose, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';

import CheckInOfferDetail from '../../libs/check-in/components/CheckInOfferDetail.component';
import {
  fetchMemberByOffer,
  search as searchMembers,
} from '../../libs/member/actions';
import {
  confirmBookingAttendance as confirmBookingAttendanceAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  addBooking,
} from '../../libs/booking/actions';
import { fetchOfferById } from '../../actions/offer.actions';
import memberSelectors from '../../libs/member/selectors';
import bookingSelectors from '../../libs/booking/selectors';
import { fetchCompatiblePass } from '../../actions/payment.actions';
import SearchAndRegisterMember from '../../libs/check-in/components/SearchAndRegisterMember.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  classes: Object,

  offerId: number,
  offer: Offer,
  fetchOfferById: (offerId: number) => void,

  setRegisterModalOpen: (boolean) => void,
  registerModalOpen: boolean,

  members: Array<Member>,
  searchedMembers: Array<Member>,
  fetchMemberByOffer: (offerId: number) => void,
  searchMembers: (text: string) => void,

  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatibleConsumerPacksLoading: boolean,
  fetchCompatiblePass: (offerId: number, memberId: number) => void,

  fetchBookingsByOfferAction: (offerId: number) => void,
  addBooking: ({
    offerId: number,
    consumerPaymentPackId: number,
    callback: () => void,
  }) => void,
  confirmBookingAttendance: (bookingId: number) => void,
  bookingLoading: boolean,

  goBack: () => void,
  redirectToConfirmPage: (offerId: number, bookingId: number) => void,
};

export class CheckInOfferDetailPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchOfferById(this.props.offerId);
    this.fetchOfferData();
  }

  fetchOfferData = () => {
    this.props.fetchBookingsByOfferAction(this.props.offerId);
    this.props.fetchMemberByOffer(this.props.offerId);
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <CheckInOfferDetail
          goBack={this.props.goBack}
          refreshData={this.fetchOfferData}
          confirmBookingAttendance={(bookingId) => {
            this.props.confirmBookingAttendance(bookingId);
            this.props.redirectToConfirmPage(this.props.offerId, bookingId);
          }}
          bookingLoading={this.props.bookingLoading}
          offer={this.props.offer}
          members={this.props.members}
          onAddMember={() => this.props.setRegisterModalOpen(true)}
        />
        <SearchAndRegisterMember
          onClose={() => this.props.setRegisterModalOpen(false)}
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers}
          open={this.props.registerModalOpen}
          offer={this.props.offer}
          consumerPaymentPacks={this.props.compatibleConsumerPacks}
          consumerPacksLoading={this.props.compatibleConsumerPacksLoading}
          fetchCompatiblePass={(memberId) =>
            this.props.fetchCompatiblePass(this.props.offerId, memberId)
          }
          registerWithPass={(consumerPaymentPackId, { onSuccess, onError }) => {
            this.props.addBooking({
              offerId: this.props.offerId,
              consumerPaymentPackId,

              callback: () => {
                if (typeof onSuccess === 'function') onSuccess();
                this.props.setRegisterModalOpen(false);
                this.fetchOfferData();
              },
              onError,
            });
          }}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
});

export default compose(
  routerParamsToProps({ offerId: 'offerId:number' }),
  withState('registerModalOpen', 'setRegisterModalOpen', false),
  withNamespaces(['selfCheckIn']),
  withStyles(styles),
  connect(
    (state, { offerId }) => ({
      offer: state.offer.offers.find((o) => o.id === offerId),
      members: memberSelectors.getByOffer(state),
      searchedMembers: memberSelectors.getSearched(state),
      bookings: bookingSelectors.getBookings(state),
      bookingLoading: state.booking.loading,
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks,
      compatibleConsumerPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
    }),
    {
      fetchOfferById,
      fetchMemberByOffer,
      fetchBookingsByOfferAction,
      fetchCompatiblePass,
      confirmBookingAttendance: confirmBookingAttendanceAction,

      searchMembers,
      addBooking,

      goBack: () => pushRouter('/check-in'),
      redirectToConfirmPage: (offerId, bookingId) =>
        pushRouter(`/check-in/offer/${offerId}/booking/${bookingId}`),
    },
  ),
  withProps(({ bookings, members }) => ({
    members: bookings.map((booking) => ({
      ...members.find((member) => member.id === booking.member),
      booking,
    })),
  })),
)(CheckInOfferDetailPage);
