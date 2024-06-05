// @flow

import React from 'react';
import {
  compose,
  withStateHandlers,
  withProps,
  withHandlers,
  withState,
} from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { fetchLevel as fetchLevelAction } from '#src/libs/level/actions';
import { withCustomLevel } from '#src/libs/level/selectors';
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
  retrieveBooking,
} from '../../libs/booking/actions';
import CheckInConfirm from '../../libs/check-in/components/CheckInConfirm.component';
import { fetchOfferById as fetchOfferByIdAction } from '../../libs/offer/actions';
import { getRetrieveOffer } from '../../libs/offer/selectors';
import { getSearchedMembers, getAllMembers } from '../../libs/member/selectors';
import {
  getOfferBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
} from '../../libs/booking/selectors';
import RegistrationFlowDialog from '../../libs/check-in/components/SearchAndRegisterMember.component';
import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  fetchByOfferByMember as fetchByOfferByMemberAction,
} from '../../libs/consumer-payment-pack/actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
} from '../../libs/payment-packs/actions';
import { checkFaceIDAvailable as checkFaceIDAvailableAPI } from '../../libs/face-recognition/api';

import {
  getByOfferByMember,
  withPaymentPack as withPaymentPackForConsumer,
} from '../../libs/consumer-payment-pack/selectors';

import boop from '../../sounds/boop.mp3';
import type { OptionCallback } from '../../state/types';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import type { MemberWithBooking } from '../../libs/member/types';

const likeAudio = new Audio(boop);

type Props = {
  classes: Object,

  offerId: number,
  offer: Offer,
  fetchOfferById: (offerId: number) => void,

  members: Array<MemberWithBooking>,
  searchMembers: (text: string) => void,

  fetchOfferData: () => void,
  fetchPaymentPackList: (params: any) => void,

  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatibleConsumerPacksLoading: boolean,
  fetchByOfferByMember: (offerId: number, memberId: number) => void,

  registerWithPass: (
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => void,
  confirmBookingAttendance: (bookingId: number) => void,
  loading: boolean,

  goBack: () => void,

  fetchMemberByBarcode: (string, OptionCallback) => void,

  searchedMember: ?Member,
  barcodeDetectorEnabled: boolean,
  faceIdEnabled: boolean,
  toogleBarcodeDetector: () => void,
  toogleFaceId: () => void,
  closeBarcodeAndFaceID: () => void,
  registrationFlowOpen: boolean,

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
  fetchSignFormUpConfiguration: (membership: string) => void,
  managerFormConfig: SignUpFormConfigDict,
  theme: Theme,
  companyCountry: string,

  fetchLevel: (id: number) => void,
  member: Member | null,
  bookingShown: Booking | null,
  setBookingShown: (booking: Booking | null) => void,

  retrieveBooking: (id: number, options: OptionCallback) => void,
  retrieveConsumerPackBulk: (Array<number>) => void,
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

  handleSearchMembers = (text: string) => {
    this.props.searchMembers(text, { hide_archived: true });
  };

  componentDidMount() {
    this.props.fetchOfferById(this.props.offerId, {
      onSuccess: (offer) => {
        this.props.fetchLevel(offer.level_id);
      },
    });
    this.props.fetchOfferData();
    this.props.fetchPaymentPackList();
    checkFaceIDAvailableAPI().then((r) =>
      this.setState({ faceIdAvailable: r.data }),
    );
    this.props.fetchSignFormUpConfiguration();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.searchedMember !== this.props.searchedMember &&
      this.props.searchedMember
    ) {
      this.props.fetchByOfferByMember();
    }
    if (!!prevProps.searchedMember && !this.props.searchedMember) {
      this.props.executeOnMemberUnselectedCallback();
    }
    if (
      this.props.bookingShown &&
      this.props.bookingShown !== prevProps.bookingShown
    ) {
      this.props.retrieveBooking(this.props.bookingShown, {
        onSuccess: (booking) =>
          this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]),
      });
    }
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <CheckInOfferDetail
          barcodeDetectorEnabled={this.props.barcodeDetectorEnabled}
          bookingLoading={this.props.loading}
          closeBarcodeAndFaceID={this.props.closeBarcodeAndFaceID}
          confirmBookingAttendance={(booking) => {
            playSound(likeAudio);
            this.props.confirmBookingAttendance(booking.id);
            this.props.setBookingShown(booking);
          }}
          faceIdAvailable={this.state.faceIdAvailable}
          faceIdEnabled={this.props.faceIdEnabled}
          fetchMemberByBarcode={this.props.fetchMemberByBarcode}
          goBack={this.props.goBack}
          members={this.props.members || []}
          offer={this.props.offer}
          onAddMember={this.props.openSearchMemberModal}
          onMemberSearched={(member, callback) => {
            this.props.setSearchedMember(member);
            if (callback) this.props.setOnMemberUnSelectedCallback(callback);
          }}
          openIncompleteMemberForm={this.props.setMemberDataToComplete}
          refreshData={this.props.fetchOfferData}
          toogleBarcodeDetector={this.props.toogleBarcodeDetector}
          toogleFaceId={this.props.toogleFaceId}
        />
        {this.props.registrationFlowOpen && (
          <RegistrationFlowDialog
            open
            companyCountry={this.props.companyCountry}
            consumerPaymentPacks={this.props.compatibleConsumerPacks}
            consumerPaymentPacksLoading={
              this.props.compatibleConsumerPacksLoading
            }
            generalTermsAndConditions={
              this.props.theme.general_terms_and_conditions
            }
            loading={this.props.memberLoading}
            managerFormConfig={this.props.managerFormConfig?.poll_fields}
            member={this.props.searchedMember}
            memberDataToComplete={this.props.memberDataToComplete}
            offer={this.props.offer}
            onClose={this.props.closeRegistrationFlow}
            registerWithPass={this.props.registerWithPass}
            searchedMemberList={this.props.searchedMemberList}
            searchMembers={this.handleSearchMembers}
            setSearchedMember={this.props.setSearchedMember}
            upsertMember={this.props.upsertMember}
            waiver={this.props.theme.waiver}
          />
        )}
        <GenericResponsiveDrawer
          withoutHeaderContainer
          withoutPadding
          onClose={() => this.props.setBookingShown(null)}
          open={!!this.props.bookingShown}
        >
          <CheckInConfirm
            booking={this.props.bookingShown}
            goBack={() => this.props.setBookingShown(null)}
            member={this.props.member || []}
            offer={this.props.offer}
            paymentPack={
              this.props.bookingShown?.consumer_payment_pack?.payment_pack
            }
          />
        </GenericResponsiveDrawer>
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
      toogleFaceId:
        ({ faceIdEnabled, barcodeDetectorEnabled }) =>
        () => ({
          faceIdEnabled: !faceIdEnabled,
          barcodeDetectorEnabled: barcodeDetectorEnabled && !!faceIdEnabled,
        }),
      toogleBarcodeDetector:
        ({ faceIdEnabled, barcodeDetectorEnabled }) =>
        () => ({
          faceIdEnabled: faceIdEnabled && !!barcodeDetectorEnabled,
          barcodeDetectorEnabled: !barcodeDetectorEnabled,
        }),
      setOnMemberUnSelectedCallback: () => (onMemberUnselectedCallback) => ({
        onMemberUnselectedCallback,
      }),
      executeOnMemberUnselectedCallback:
        ({ onMemberUnselectedCallback }) =>
        () => {
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
      theme: state.theme.theme,
      companyCountry: state.theme.theme.locale.split('_')[1],
      offer: withCustomLevel(getRetrieveOffer)(state),
      members: getAllMembers(state),
      searchedMemberList: getSearchedMembers(state),

      memberBarcodeLoading: state.member.barcode.loading,

      bookings: getOfferBookingListWithConsumerPack(state),
      loading:
        state.booking.loading ||
        state.member.loading ||
        state.offer.byDay.loading,
      compatibleConsumerPacks:
        withPaymentPackForConsumer(getByOfferByMember)(state),
      compatibleConsumerPacksLoading:
        state.consumerPaymentPack.byOfferByMember.loading,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      getBooking: (bookingId) =>
        bookingId ? getMemberBookingWithConsumerPack(state, bookingId) : null,
      bookingLoading: state.booking.loading,
    }),
    {
      fetchOfferById: fetchOfferByIdAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      fetchByOfferByMember: fetchByOfferByMemberAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,

      retrieveBooking,
      fetchPaymentPackList: () =>
        fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      upsertMember: upsertMemberAction,

      searchMembers,
      fetchMemberByBarcode: fetchMemberByBarcodeAction,

      registerBooking: registerBookingAction,

      goBack: () => pushRouter('/check-in'),
      fetchSignFormUpConfiguration,
      fetchLevel: fetchLevelAction,
    },
  ),
  withState('bookingShown', 'setBookingShown', null),
  withHandlers({
    fetchByOfferByMember:
      ({ fetchByOfferByMember, offerId, searchedMember }) =>
      () => {
        fetchByOfferByMember(offerId, searchedMember.id);
      },
    fetchOfferData:
      ({
        offerId,
        fetchFilteredMembers,
        fetchBookingsByOffer,
        retrieveConsumerPackBulk,
        fetchPaymentPackBulk,
      }) =>
      () => {
        fetchBookingsByOffer(
          offerId,
          {
            onSuccess: (bs) => {
              retrieveConsumerPackBulk(
                bs.map((b) => b.consumer_payment_pack),
                {
                  onSuccess: (cppList) =>
                    fetchPaymentPackBulk(
                      cppList.map((cpp) => cpp.payment_pack),
                    ),
                },
              );
            },
          },
          null,
          { booking_status_code: 0 },
        );
        fetchFilteredMembers({ offer: offerId });
      },
    upsertMember:
      ({ upsertMember, closeRegistrationFlow }) =>
      (id, data, options) => {
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
  withProps(({ members, bookingShown }) => ({
    member: members.find((m) => m.booking.id === bookingShown?.id),
  })),
  withHandlers({
    registerWithPass:
      ({ fetchOfferData, registerBooking, offerId, closeRegistrationFlow }) =>
      (consumerPaymentPackId, options) => {
        registerBooking(
          consumerPaymentPackId,
          { offer: offerId, auto_assign_spot: true },
          {
            onError: options && options.onError,
            onSuccess: () => {
              fetchOfferData();
              closeRegistrationFlow();
              if (options && options.onSuccess) options.onSuccess();
            },
          },
        );
      },
  }),
)(CheckInOfferDetailPage);
