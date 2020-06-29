// @flow

import React from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import CheckInOfferDetail from '../../libs/check-in/components/CheckInOfferDetail.component';
import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  search as searchMembers,
  fetchMemberByBarcode,
  resetMemberByBarcode,
} from '../../libs/member/actions';
import {
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  registerBooking,
} from '../../libs/booking/actions';
import { fetchOfferById as fetchOfferByIdAction } from '../../libs/offer/actions';
import { getSearchedMembers, getAllMembers } from '../../libs/member/selectors';
import { getOfferBookingListWithConsumerPack } from '../../libs/booking/selectors';
import { fetchCompatiblePass as fetchCompatiblePassAction } from '../../actions/payment.actions';
import SearchAndRegisterMember, {
  SearchAndRegister,
} from '../../libs/check-in/components/SearchAndRegisterMember.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';

import boop from '../../sounds/boop.mp3';

const likeAudio = new Audio(boop);

type Props = {
  classes: Object,

  offerId: number,
  offer: Offer,
  fetchOfferById: (offerId: number) => void,

  setRegisterModalOpen: (boolean) => void,
  registerModalOpen: boolean,

  members: Array<Member>,
  searchedMembers: Array<Member>,
  searchMembers: (text: string) => void,

  fetchOfferData: () => void,
  fetchAllPaymentPacks: () => void,

  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatibleConsumerPacksLoading: boolean,
  fetchCompatiblePass: (offerId: number, memberId: number) => void,

  registerBooking: (
    offerId: number,
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => void,
  confirmBookingAttendance: (bookingId: number) => void,
  loading: boolean,

  goBack: () => void,
  redirectToConfirmPage: (offerId: number, bookingId: number) => void,

  resetMemberByBarcode: () => void,
  memberBarcodeLoading: boolean,
  memberBarcode: string,
  fetchBarcodeMemberPass: (string) => void,
  resetMemberByBarcode: () => void,
  fetchCompatiblePass: (offerId: number, memberId: number) => void,
  fetchMemberByBarcode: (string, OptionCallback) => void,
};

const playSound = (audioFile) => {
  audioFile.play();
};

export class CheckInOfferDetailPage extends React.Component<Props> {
  componentWillMount() {
    this.props.resetMemberByBarcode();
  }

  componentDidMount() {
    this.props.fetchOfferById(this.props.offerId);
    this.props.fetchOfferData();
    this.props.fetchAllPaymentPacks();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <CheckInOfferDetail
          goBack={this.props.goBack}
          refreshData={this.props.fetchOfferData}
          confirmBookingAttendance={(bookingId) => {
            playSound(likeAudio);
            this.props.confirmBookingAttendance(bookingId);
            this.props.redirectToConfirmPage(this.props.offerId, bookingId);
          }}
          bookingLoading={this.props.loading}
          offer={this.props.offer}
          members={this.props.members}
          onAddMember={() => this.props.setRegisterModalOpen(true)}
          barcodeMode
          showLiveStream={
            !this.props.memberBarcodeLoading && !this.props.memberBarcode
          }
          onBarcodeDetected={(data) => {
            this.props.fetchMemberByBarcode(data.codeResult.code, {
              onSuccess: (member) => {
                this.props.fetchBarcodeMemberPass(member.id);
              },
            });
          }}
        />
        {this.props.memberBarcodeLoading || !!this.props.memberBarcode ? (
          <SearchAndRegister
            onClose={() => {
              this.props.resetMemberByBarcode();
            }}
            member={this.props.memberBarcode}
            loading={this.props.memberBarcodeLoading}
            open
            setMember={() => {}}
            consumerPacksLoading={this.props.compatibleConsumerPacksLoading}
            offer={this.props.offer}
            consumerPaymentPacks={this.props.compatibleConsumerPacks}
            registerWithPass={(consumerPaymentPackId, { onSuccess }) => {
              this.props.registerBooking(
                this.props.offerId,
                consumerPaymentPackId,
                {
                  onSuccess: () => {
                    if (typeof onSuccess === 'function') onSuccess();
                    this.props.fetchOfferData();
                    this.props.resetMemberByBarcode();
                  },
                },
              );
            }}
          />
        ) : null}
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
          registerWithPass={(consumerPaymentPackId, { onSuccess }) => {
            this.props.registerBooking(
              this.props.offerId,
              consumerPaymentPackId,
              {
                onSuccess: () => {
                  if (typeof onSuccess === 'function') onSuccess();
                  this.props.setRegisterModalOpen(false);
                  playSound(likeAudio);
                  this.props.fetchOfferData();
                },
              },
            );
          }}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
});

export default compose(
  routerParamsToProps({ offerId: 'offerId:number' }),
  withState('registerModalOpen', 'setRegisterModalOpen', false),
  withTranslation(['selfCheckIn']),
  withStyles(styles),
  connect(
    (state) => ({
      offer: state.offer.retrieve.data,
      members: getAllMembers(state),
      searchedMembers: getSearchedMembers(state),

      memberBarcode: state.member.barcode.data,
      memberBarcodeLoading: state.member.barcode.loading,

      bookings: getOfferBookingListWithConsumerPack(state),
      loading:
        state.booking.loading ||
        state.member.loading ||
        state.offer.byDay.loading,
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks,
      compatibleConsumerPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
    }),
    {
      fetchOfferById: fetchOfferByIdAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchBookingsByOfferAction,
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      fetchCompatiblePass: fetchCompatiblePassAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,

      fetchAllPaymentPacks,

      searchMembers,
      fetchMemberByBarcode,
      resetMemberByBarcode,

      registerBooking,

      goBack: () => pushRouter('/check-in'),
      redirectToConfirmPage: (offerId, bookingId) =>
        pushRouter(`/check-in/offer/${offerId}/booking/${bookingId}`),
    },
  ),
  withHandlers({
    fetchBarcodeMemberPass: ({
      fetchCompatiblePass,
      offerId,
      memberBarcode,
    }) => () => {
      fetchCompatiblePass(offerId, memberBarcode.id);
    },
  }),
  withProps(
    ({
      bookings,
      members,
      offerId,
      fetchFilteredMembers,
      fetchBookingsByOffer,
      retrieveConsumerPackBulk,
    }) => ({
      fetchOfferData: () => {
        fetchBookingsByOffer(offerId, {
          onSuccess: (bs) => {
            retrieveConsumerPackBulk(bs.map((b) => b.consumer_payment_pack));
          },
        });
        fetchFilteredMembers({ offer: offerId });
      },
      members: bookings.map((booking) => ({
        ...members.find((member) => member.id === booking.member),
        booking,
      })),
    }),
  ),
)(CheckInOfferDetailPage);
