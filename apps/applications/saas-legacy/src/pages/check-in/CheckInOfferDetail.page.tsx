import React from 'react';
import {
  compose,
  withStateHandlers,
  withProps,
  withHandlers,
  withState,
} from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import { withStyles, WithStyles } from '@material-ui/styles';
import { Theme, Typography } from '@material-ui/core';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import CheckInOfferDetail from '#src/libs/check-in/components/CheckInOfferDetail.component';
import CheckInConfirm from '#src/libs/check-in/components/CheckInConfirm.component';
import SearchAndRegisterMember from '#src/libs/check-in/components/SearchAndRegisterMember.component';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  search as searchMembers,
  fetchMemberByBarcode as fetchMemberByBarcodeAction,
  createOrUpdateMember as upsertMemberAction,
} from '#src/libs/member/actions';
import { fetchLevel as fetchLevelAction } from '#src/libs/level/actions';
import {
  confirmAttendance as confirmBookingAttendanceAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  registerTabletBooking as registerTabletBookingAction,
  retrieveBooking as retrieveBookingAction,
} from '#src/libs/booking/actions';
import { retrieveOffer as retrieveOfferAction } from '#src/libs/offer/actions';
import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  fetchByOfferByMember as fetchByOfferByMemberAction,
} from '#src/libs/consumer-payment-pack/actions';
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
} from '#src/libs/payment-packs/actions';
import { fetchSignFormUpConfiguration } from '#src/libs/sign-up-form/actions';
import { retrieveEstablishment as retrieveEstablishmentAction } from '#src/libs/establishment/actions';
import { fetchAssociatedCoach as fetchAssociatedCoachAction } from '#src/libs/associated-coach/actions';

import {
  getOfferBookingListWithConsumerPack,
  getMemberBookingWithConsumerPack,
} from '#src/libs/booking/selectors';
import {
  getOfferById,
  getRetrieveOfferLoading,
} from '#src/libs/offer/selectors';
import {
  getSearchedMembers,
  getMember,
  getSearchMemberLoading,
} from '#src/libs/member/selectors';
import {
  getByOfferByMember,
  withPaymentPack as withPaymentPackForConsumer,
} from '#src/libs/consumer-payment-pack/selectors';
import { getSignUpFormConfigurationDict } from '#src/libs/sign-up-form/selectors';
import { getLevel, getLevelsIsLoading } from '#src/libs/level/selectors';
import {
  getEstablishment,
  getEstablishmentLoading,
} from '#src/libs/establishment/selectors';
import {
  getCoach,
  getCoachLoading,
} from '#src/libs/associated-coach/selectors';

import { getLocaleCountry } from '#src/utils/language';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import type { RootState } from '#src/reducers';
import type { Member } from '#src/libs/member/types';
import type { BookingWithConsumerPaymentPack } from '#src/libs/booking/types';
import type { WithHandlerType } from '#src/utils/types';
import type { OptionCallback } from '#src/state/types';

// @ts-expect-error audio file
import boop from '../../sounds/boop.mp3';
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';
import { trackBarcodeScanToggledEvent } from '#src/events/booking/trackers';

const likeAudio = new Audio(boop);
likeAudio.loop = false;

type OwnProps = {
  offerId: number;
  registrationFlowOpen: boolean;
  searchedMember: Member | null;
  bookingShown: BookingWithConsumerPaymentPack | null;
  setBookingShown: (booking: BookingWithConsumerPaymentPack | null) => void;
};

type StateHandlerInit = {
  searchMemberModalOpen: boolean;
  barcodeDetectorEnabled: boolean;
  searchedMember: Member | null;
  onMemberUnselectedCallback: () => void;
  memberDataToComplete: any;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnProps &
  WithHandlerType<typeof mapWithHandlers> &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  StateHandlerType;

type StateHanldersType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedPropsAndStateHandlers = ConnectedProps<typeof connector> &
  StateHanldersType &
  OwnProps;

const playSound = (audioFile: HTMLAudioElement) => {
  try {
    audioFile.play();
  } catch (error) {
    console.error(error);
  }
};

export class CheckInOfferDetailPage extends React.Component<Props> {
  handleSearchMembers = (text: string) => {
    this.props.searchMembers(text, { hide_archived: true });
  };

  componentDidMount() {
    this.props.retrieveOffer(this.props.offerId, {
      onSuccess: (offer) => {
        analyticsClientB2B.addSuperProperties({
          offer_id: offer?.id,
          activity: offer?.activity,
          activity_name: offer?.activity_name,
        });
        !!(offer.custom_level || offer.level) &&
          this.props.fetchLevel(offer.custom_level ?? offer.level);
        this.props.retrieveEstablishment(this.props.offer?.establishment);
        this.props.fetchAssociatedCoach(
          this.props.offer?.coach_override ?? this.props.offer?.coach,
        );
      },
    });
    this.props.fetchOfferData();
    this.props.fetchPaymentPackList();
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
      this.props.retrieveBooking(this.props.bookingShown.id, {
        onSuccess: (booking) =>
          this.props.retrieveConsumerPackBulk([booking.consumer_payment_pack]),
      });
    }
  }

  componentWillUnmount() {
    analyticsClientB2B.removeSuperProperties([
      'offer_id',
      'activity',
      'activity_name',
    ]);
  }

  registerWithPass = (
    consumerPaymentPackId: number,
    options: OptionCallback,
  ) => {
    this.props.registerTabletBooking(
      consumerPaymentPackId,
      this.props.offerId,
      {
        onError: options?.onError,
        onSuccess: () => {
          this.props.fetchOfferData?.();
          this.props.closeRegistrationFlow();
          options?.onSuccess?.();
        },
      },
    );
  };

  handleMemberSearched = (
    member: Member,
    callback?: OptionCallback<Member>,
  ) => {
    this.props.setSearchedMember(member);
    if (callback) this.props.setOnMemberUnSelectedCallback(callback);
  };

  handleConfirmBookingAttendance = (bookingId: number) => {
    const confirmationBooking = (this.props.bookings ?? []).find(
      (booking) => booking.id === bookingId,
    );
    if (confirmationBooking) {
      this.props.confirmBookingAttendance(bookingId, {
        onSuccess: () => {
          playSound(likeAudio);
          // @ts-expect-error TODO - typing
          this.props.setBookingShown(confirmationBooking);
        },
      });
    }
  };

  render() {
    const activityName = this.props?.offer?.activity_name;
    return (
      <div className={this.props.classes.container}>
        {activityName && (
          <Typography align="center" variant="h4">
            {activityName}
          </Typography>
        )}
        <CheckInOfferDetail
          barcodeDetectorEnabled={this.props.barcodeDetectorEnabled}
          bookings={this.props.bookings}
          closeBarcode={this.props.closeBarcode}
          coach={this.props.getCoach(
            this.props.offer?.coach_override ?? this.props.offer?.coach,
          )}
          confirmBookingAttendance={this.handleConfirmBookingAttendance}
          establishment={this.props.getEstablishment(
            this.props.offer?.establishment,
          )}
          fetchMemberByBarcode={this.props.fetchMemberByBarcode}
          getMember={this.props.getMember}
          goBack={this.props.goBack}
          isBookingLoading={this.props.isBookingLoading}
          isCoachLoading={this.props.isCoachLoading}
          isEstablishmentLoading={this.props.isEstablishmentLoading}
          isLevelLoading={this.props.isLevelLoading}
          isOfferLoading={this.props.isOfferLoading}
          level={this.props.getLevel(
            this.props.offer?.custom_level ?? this.props.offer?.level,
          )}
          offer={this.props.offer}
          onAddMember={this.props.openSearchMemberModal}
          onMemberSearched={this.handleMemberSearched}
          refreshData={this.props.fetchOfferData}
          toggleBarcodeDetector={this.props.toggleBarcodeDetector}
        />
        {this.props.registrationFlowOpen && (
          <SearchAndRegisterMember
            // @ts-expect-error TODO - typing
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
            registerWithPass={this.registerWithPass}
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
            establishment={this.props.getEstablishment(
              this.props.bookingShown?.establishment,
            )}
            goBack={() => this.props.setBookingShown(null)}
            // @ts-expect-error bad reducer typing
            member={this.props.getMember(this.props.bookingShown?.member)}
            offer={this.props.offer}
          />
        </GenericResponsiveDrawer>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
});

const mapWithHandlers = {
  fetchByOfferByMember:
    ({
      fetchByOfferByMember,
      offerId,
      searchedMember,
    }: ConnectedPropsAndStateHandlers) =>
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
    }: ConnectedPropsAndStateHandlers) =>
    () => {
      fetchBookingsByOffer(
        offerId,
        {
          onSuccess: (bookings) => {
            retrieveConsumerPackBulk(
              bookings.map((booking) => booking.consumer_payment_pack),
              {
                onSuccess: (consumerPaymentPackList) =>
                  fetchPaymentPackBulk(
                    consumerPaymentPackList.map(
                      (consumerPaymentPack) => consumerPaymentPack.payment_pack,
                    ),
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
    ({ upsertMember, closeRegistrationFlow }: ConnectedPropsAndStateHandlers) =>
    (id: number, data: FormData, options?: OptionCallback) => {
      upsertMember(id, data, {
        onError: options?.onError,
        onSuccess: (member) => {
          options?.onSuccess?.(member);
          closeRegistrationFlow();
        },
      });
    },
};

const connector = connect(
  (state: RootState, { offerId }: OwnProps) => ({
    theme: state.theme.theme,
    companyCountry: getLocaleCountry(state.theme.theme.locale),
    offer: getOfferById(state, offerId),
    searchedMemberList: getSearchedMembers(state),
    memberBarcodeLoading: state.member.barcode.loading,
    memberLoading: getSearchMemberLoading(state),
    bookings: getOfferBookingListWithConsumerPack(state),
    loading:
      state.booking.byOffer.loading ||
      state.member.loading ||
      state.offer.byDay.loading,
    compatibleConsumerPacks:
      withPaymentPackForConsumer(getByOfferByMember)(state),
    compatibleConsumerPacksLoading:
      state.consumerPaymentPack.byOfferByMember.loading,
    managerFormConfig: getSignUpFormConfigurationDict(state),
    getBooking: (bookingId: number) =>
      bookingId ? getMemberBookingWithConsumerPack(state, bookingId) : null,
    isBookingLoading: state.booking.byOffer.loading,
    isOfferLoading: getRetrieveOfferLoading(state),
    isEstablishmentLoading: getEstablishmentLoading(state),
    isCoachLoading: getCoachLoading(state),
    isLevelLoading: getLevelsIsLoading(state),
    getLevel: (id: number) => getLevel(state, id),
    getEstablishment: (id: number) => getEstablishment(state, id),
    getCoach: (id: number) => getCoach(state, id),
    getMember: (id: number) => getMember(state, id),
  }),
  {
    retrieveOffer: retrieveOfferAction,
    fetchFilteredMembers: fetchFilteredMembersAction,
    fetchBookingsByOffer: fetchBookingsByOfferAction,
    fetchByOfferByMember: fetchByOfferByMemberAction,
    confirmBookingAttendance: confirmBookingAttendanceAction,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
    retrieveBooking: retrieveBookingAction,
    fetchPaymentPackList: () =>
      fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
    fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    upsertMember: upsertMemberAction,
    searchMembers,
    fetchMemberByBarcode: fetchMemberByBarcodeAction,
    registerTabletBooking: registerTabletBookingAction,
    goBack: () => pushRouter('/check-in'),
    fetchSignFormUpConfiguration,
    fetchLevel: fetchLevelAction,
    retrieveEstablishment: retrieveEstablishmentAction,
    fetchAssociatedCoach: fetchAssociatedCoachAction,
  },
);

const withStateHandlersInit: StateHandlerInit = {
  searchMemberModalOpen: false,
  barcodeDetectorEnabled: false,
  searchedMember: null,
  onMemberUnselectedCallback: null,
  memberDataToComplete: null,
};

const withStateHandlersSetter = {
  setMemberDataToComplete: () => (memberDataToComplete: any) => ({
    memberDataToComplete,
  }),
  openSearchMemberModal: () => () => ({
    searchMemberModalOpen: true,
  }),
  closeRegistrationFlow: () => () =>
    ({
      searchedMember: null,
      searchMemberModalOpen: false,
      memberDataToComplete: null,
    } as StateHandlerInit),
  setSearchedMember: () => (searchedMember: Member | null) => ({
    searchedMember,
  }),
  closeBarcode: () => () => ({
    barcodeDetectorEnabled: false,
  }),
  toggleBarcodeDetector:
    ({ barcodeDetectorEnabled }: StateHandlerInit) =>
    () => {
      analyticsClientB2B.track(trackBarcodeScanToggledEvent({}));
      return {
        barcodeDetectorEnabled: !barcodeDetectorEnabled,
      };
    },
  setOnMemberUnSelectedCallback: () => (onMemberUnselectedCallback: any) => ({
    onMemberUnselectedCallback,
  }),
  executeOnMemberUnselectedCallback:
    ({ onMemberUnselectedCallback }: StateHandlerInit) =>
    () => {
      if (typeof onMemberUnselectedCallback === 'function') {
        onMemberUnselectedCallback();
      }
      return { onMemberUnselectedCallback: null } as StateHandlerInit;
    },
};

export default compose<Props, OwnProps>(
  routerParamsToProps({ offerId: 'offerId:number' }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withProps(
    ({
      searchMemberModalOpen,
      searchedMember,
      memberDataToComplete,
    }: StateHandlerInit) => ({
      registrationFlowOpen: !!(
        searchedMember ||
        memberDataToComplete ||
        searchMemberModalOpen
      ),
    }),
  ),
  withTranslation('selfCheckIn'),
  withStyles(styles),
  connector,
  withState('bookingShown', 'setBookingShown', null),
  withHandlers(mapWithHandlers),
)(CheckInOfferDetailPage);
