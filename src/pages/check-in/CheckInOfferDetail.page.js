// @flow

import React from 'react';
import { compose, withStateHandlers, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import CheckInOfferDetail from '../../libs/check-in/components/CheckInOfferDetail.component';
import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  search as searchMembers,
  fetchMemberByBarcode as fetchMemberByBarcodeAction,
  createOrUpdateMember as upsertMemberAction,
} from '../../libs/member/actions';
import {
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  registerBooking as registerBookingAction,
} from '../../libs/booking/actions';
import { fetchOfferById as fetchOfferByIdAction } from '../../libs/offer/actions';
import { getSearchedMembers, getAllMembers } from '../../libs/member/selectors';
import { getOfferBookingListWithConsumerPack } from '../../libs/booking/selectors';
import { fetchCompatiblePass as fetchCompatiblePassAction } from '../../actions/payment.actions';
import RegistrationFlowDialog from '../../libs/check-in/components/SearchAndRegisterMember.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { checkFaceIDAvailable as checkFaceIDAvailableAPI } from '../../libs/face-recognition/api';

import boop from '../../sounds/boop.mp3';
import type { OptionCallback } from '../../state/types';

const likeAudio = new Audio(boop);

type Props = {
  classes: Object,

  offerId: number,
  offer: Offer,
  fetchOfferById: (offerId: number) => void,

  members: Array<Member>,
  searchMembers: (text: string) => void,

  fetchOfferData: () => void,
  fetchAllPaymentPacks: () => void,

  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatibleConsumerPacksLoading: boolean,
  fetchCompatiblePass: (offerId: number, memberId: number) => void,

  registerWithPass: (
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => void,
  confirmBookingAttendance: (bookingId: number) => void,
  loading: boolean,

  goBack: () => void,
  redirectToConfirmPage: (offerId: number, bookingId: number) => void,

  fetchCompatiblePass: (offerId: number, memberId: number) => void,
  fetchMemberByBarcode: (string, OptionCallback) => void,

  searchedMember: ?Member,
  barcodeDetectorEnabled: boolean,
  faceIdEnabled: boolean,
  toogleBarcodeDetector: () => void,
  toogleFaceId: () => void,
  closeBarcodeAndFaceID: () => void,
  registrationFlowOpen: boolean,

  fetchCompatiblePass: () => void,

  executeOnMemberUnselectedCallback: () => void,
  openSearchMemberModal: () => void,

  setSearchedMember: (?Member) => void,
  setOnMemberUnSelectedCallback: (?() => void) => void,

  memberLoading: boolean,
  closeRegistrationFlow: () => void,
  searchedMemberList: Array<Member>,

  memberDataToComplete: ?any,
  setMemberDataToComplete: (any) => void,
  upsertMember: (id: ?number, data: FormData, options: OptionCallback) => void,
};

type State = {
  faceIdAvailable: boolean,
};

const playSound = (audioFile) => {
  audioFile.play();
};

export class CheckInOfferDetailPage extends React.Component<Props, State> {
  state = {
    faceIdAvailable: false,
  };

  componentDidMount() {
    this.props.fetchOfferById(this.props.offerId);
    this.props.fetchOfferData();
    this.props.fetchAllPaymentPacks();
    checkFaceIDAvailableAPI().then((r) =>
      this.setState({ faceIdAvailable: r.data }),
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.searchedMember !== this.props.searchedMember &&
      this.props.searchedMember
    ) {
      this.props.fetchCompatiblePass();
    }
    if (!!prevProps.searchedMember && !this.props.searchedMember) {
      this.props.executeOnMemberUnselectedCallback();
    }
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
          onAddMember={this.props.openSearchMemberModal}
          fetchMemberByBarcode={this.props.fetchMemberByBarcode}
          onMemberSearched={(member, callback) => {
            this.props.setSearchedMember(member);
            if (callback) this.props.setOnMemberUnSelectedCallback(callback);
          }}
          barcodeDetectorEnabled={this.props.barcodeDetectorEnabled}
          faceIdEnabled={this.props.faceIdEnabled}
          toogleBarcodeDetector={this.props.toogleBarcodeDetector}
          toogleFaceId={this.props.toogleFaceId}
          faceIdAvailable={this.state.faceIdAvailable}
          closeBarcodeAndFaceID={this.props.closeBarcodeAndFaceID}
          openIncompleteMemberForm={this.props.setMemberDataToComplete}
        />
        {this.props.registrationFlowOpen && (
          <RegistrationFlowDialog
            member={this.props.searchedMember}
            memberDataToComplete={this.props.memberDataToComplete}
            searchMembers={this.props.searchMembers}
            loading={this.props.memberLoading}
            onClose={this.props.closeRegistrationFlow}
            searchedMemberList={this.props.searchedMemberList}
            setSearchedMember={this.props.setSearchedMember}
            open
            consumerPacksLoading={this.props.compatibleConsumerPacksLoading}
            offer={this.props.offer}
            consumerPaymentPacks={this.props.compatibleConsumerPacks}
            registerWithPass={this.props.registerWithPass}
            upsertMember={this.props.upsertMember}
          />
        )}
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
  withStateHandlers(
    {
      searchMemberModalOpen: false,
      faceIdEnabled: false,
      barcodeDetectorEnabled: false,
      searchedMember: null,
      onMemberUnselectedCallback: null,
      memberDataToComplete: null,
    },
    {
      setMemberDataToComplete: () => (memberDataToComplete) => ({
        memberDataToComplete,
      }),
      openSearchMemberModal: () => () => ({
        searchMemberModalOpen: true,
      }),
      closeRegistrationFlow: () => () => ({
        searchedMember: null,
        searchMemberModalOpen: false,
        memberDataToComplete: null,
      }),
      setSearchedMember: () => (searchedMember) => ({
        searchedMember,
      }),
      closeBarcodeAndFaceID: () => () => ({
        faceIdEnabled: false,
        barcodeDetectorEnabled: false,
      }),
      toogleFaceId: ({ faceIdEnabled, barcodeDetectorEnabled }) => () => ({
        faceIdEnabled: !faceIdEnabled,
        barcodeDetectorEnabled: barcodeDetectorEnabled && !!faceIdEnabled,
      }),
      toogleBarcodeDetector: ({
        faceIdEnabled,
        barcodeDetectorEnabled,
      }) => () => ({
        faceIdEnabled: faceIdEnabled && !!barcodeDetectorEnabled,
        barcodeDetectorEnabled: !barcodeDetectorEnabled,
      }),
      setOnMemberUnSelectedCallback: () => (onMemberUnselectedCallback) => ({
        onMemberUnselectedCallback,
      }),
      executeOnMemberUnselectedCallback: ({
        onMemberUnselectedCallback,
      }) => () => {
        if (typeof onMemberUnselectedCallback === 'function') {
          onMemberUnselectedCallback();
        }
        return { onMemberUnselectedCallback: null };
      },
    },
  ),
  withProps(
    ({ searchMemberModalOpen, searchedMember, memberDataToComplete }) => ({
      registrationFlowOpen: !!(
        searchedMember ||
        memberDataToComplete ||
        searchMemberModalOpen
      ),
    }),
  ),
  withTranslation(['selfCheckIn']),
  withStyles(styles),
  connect(
    (state) => ({
      offer: state.offer.retrieve.data,
      members: getAllMembers(state),
      searchedMemberList: getSearchedMembers(state),

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
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      fetchCompatiblePass: fetchCompatiblePassAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,

      fetchAllPaymentPacks,
      upsertMember: upsertMemberAction,

      searchMembers,
      fetchMemberByBarcode: fetchMemberByBarcodeAction,

      registerBooking: registerBookingAction,

      goBack: () => pushRouter('/check-in'),
      redirectToConfirmPage: (offerId, bookingId) =>
        pushRouter(`/check-in/offer/${offerId}/booking/${bookingId}`),
    },
  ),
  withHandlers({
    fetchCompatiblePass: ({
      fetchCompatiblePass,
      offerId,
      searchedMember,
    }) => () => {
      fetchCompatiblePass(offerId, searchedMember.id);
    },
    fetchOfferData: ({
      offerId,
      fetchFilteredMembers,
      fetchBookingsByOffer,
      retrieveConsumerPackBulk,
    }) => () => {
      fetchBookingsByOffer(
        offerId,
        {
          onSuccess: (bs) => {
            retrieveConsumerPackBulk(bs.map((b) => b.consumer_payment_pack));
          },
        },
        null,
        { booking_status_code: 0 },
      );
      fetchFilteredMembers({ offer: offerId });
    },
    upsertMember: ({ upsertMember, closeRegistrationFlow }) => (
      id,
      data,
      options,
    ) => {
      upsertMember(id, data, {
        onError: options && options.onError,
        onSuccess: (member) => {
          if (options && options.onSuccess) options.onSuccess(member);
          closeRegistrationFlow();
        },
      });
    },
  }),
  withProps(({ bookings, members }) => ({
    // ugly FIXME
    members: bookings.map((booking) => ({
      ...members.find((member) => member.id === booking.member),
      booking,
    })),
  })),
  withHandlers({
    registerWithPass: ({ fetchOfferData, registerBooking, offerId }) => (
      consumerPaymentPackId,
      options,
    ) => {
      registerBooking(offerId, consumerPaymentPackId, {
        onError: options && options.onError,
        onSuccess: () => {
          if (options && options.onSuccess) options.onSucces();
          fetchOfferData();
        },
      });
    },
  }),
)(CheckInOfferDetailPage);
