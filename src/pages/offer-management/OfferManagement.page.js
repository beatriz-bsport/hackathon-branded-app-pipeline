// @flow
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import {
  replace as replaceRouter,
  push as routerPush,
} from 'connected-react-router';
import { compose, withProps } from 'recompose';

import { invoice as invoiceActions } from '../../actions';
import {
  fetchOfferById as fetchOfferByIdAction,
  toogleWaitingListFreeze as toogleWaitingListFreezeAction,
  fetchCompatiblePacks as fetchCompatiblePacksAction,
} from '../../libs/offer/actions';
import {
  compatiblePacksWithOfferAndEnabled,
  getDetailedOffer,
} from '../../libs/offer/selectors';
import { getShopItemsAvailable } from '../../libs/shop/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { mailMembers as mailMembersAction } from '../../libs/communication/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import themeSelectors from '../../libs/theme/selectors';

import {
  registerBooking as registerBookingAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  refreshBookingsByOffer as refreshBookingsByOfferAction,
  cancelBooking as cancelBookingAction,
  confirmAttendance as confirmBookingAttendanceAction,
  discardAttendance as discardBookingAttendanceAction,
} from '../../libs/booking/actions';
import {
  discardBookingOption as discardBookingOptionAction,
  registerToWaitingList as registerToWaitingListAction_,
  fetchByOffer as fetchBookingOptionByOfferAction,
} from '../../libs/waiting-list/actions';
import { getPermissions } from '../../libs/role/selectors';
import { getOfferBookingListWithConsumerPack } from '../../libs/booking/selectors';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';

import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';

import { snackbar } from '../../actions/snackbar.actions';
import {
  getEnabled as getPaymentPackEnabled,
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  refreshFilteredMembers as refreshFilteredMembersAction,
  fetchMember as fetchMemberAction,
  createOrUpdateMember,
  search as searchMembersAction,
} from '../../libs/member/actions';
import {
  getSearchedMembers,
  getAllMembers,
  getMemberHistory,
} from '../../libs/member/selectors';

import withTitle from '../../hocs/with-title.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';

const formatTitle = (offer: Offer, offerLoading: boolean) => {
  if (!offer || offerLoading) {
    return ' - ';
  }
  if (offer && offer.name) {
    const { coach, coach_override } = offer;
    return `${offer.name} - ${
      coach_override ? coach_override.name : coach.name
    }`;
  }
  return ' - ';
};

function mapStateToProps(state, { id }) {
  return {
    // offer
    offerId: id,
    offer: getDetailedOffer(state),
    offerLoading: state.offer.retrieve.loading,
    // payment pack
    paymentPacks: getAllPaymentPacks(state),
    paymentPacksEnabled: getPaymentPackEnabled(state),
    compatiblePacks: compatiblePacksWithOfferAndEnabled(state),
    compatiblePacksLoading: state.offer.compatiblePacks.loading,
    // member
    membersloading: state.member.loading,
    members: getAllMembers(state),
    memberHistory: getMemberHistory(state).slice(0, 5),
    memberSearchLoading: state.member.search.loading,
    searchedMembers: getSearchedMembers(state),
    memberCreationPending: state.member.upsert.loading,
    memberCreationErrors: state.member.upsert.error,
    // booking
    bookings: getOfferBookingListWithConsumerPack(state),
    bookingLoading: state.booking.loading,
    bookingOptionsPending: state.waitingList.option.items,
    // invoice
    unevenSavedInvoices: state.invoice.quickInvoices,
    // buyable stuff
    privatePassList: getPrivatePassAvailable(state),
    permission: getPermissions(state),
    paymentComboList: getPaymentComboList(state),
    shopItemsAvailable: getShopItemsAvailable(state),
    // theme
    company_theme: themeSelectors.getTheme(state),
  };
}

const mapDispatchToProps = {
  fetchOffer: fetchOfferByIdAction,
  snackbarSuccess: snackbar.success,

  toogleWaitingListFreeze: toogleWaitingListFreezeAction,
  registerToWaitingListAction: registerToWaitingListAction_,
  discardOption: discardBookingOptionAction,
  fetchBookingOptionByOffer: fetchBookingOptionByOfferAction,

  // buyyable stuff
  fetchShopItems,
  fetchPrivatePassList,
  fetchPaymentComboList,

  // fetch booking member and consumerpack
  fetchBookingsByOffer: fetchBookingsByOfferAction,
  refreshBookingsByOffer: refreshBookingsByOfferAction,
  retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
  fetchCompatiblePacks: fetchCompatiblePacksAction,

  // modify booking
  registerBooking: registerBookingAction,
  cancelBooking: cancelBookingAction,
  discardBookingAttendance: discardBookingAttendanceAction,
  confirmBookingAttendance: confirmBookingAttendanceAction,

  // member
  createMember: createOrUpdateMember,
  fetchMember: fetchMemberAction,
  refreshFilteredMembers: refreshFilteredMembersAction,
  fetchFilteredMembers: fetchFilteredMembersAction,
  searchMembers: (txt) => searchMembersAction(txt),
  mailMembers: mailMembersAction,

  // invoice actions
  revertQuickInvoice: invoiceActions.revertQuickInvoice,
  createQuickInvoice: invoiceActions.createQuickInvoice,
  createOrUpdateInvoice: invoiceActions.createOrUpdateInvoice,
  resetQuickInvoices: invoiceActions.resetQuickInvoices,

  // move
  goToCalendar: (date) =>
    replaceRouter(`/calendar/${date.year}/${date.month}/${date.day}`),
  goToOffer: (id) => replaceRouter(`/offer/${id}`),
  push: routerPush,
  goToMember: (id) => routerPush(`/member/${id}/`),
};

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(
    ({
      refreshBookingsByOffer,
      fetchFilteredMembers,
      retrieveConsumerPackBulk,
      id,
    }) => ({
      refresh: (ordering_field) => {
        refreshBookingsByOffer(
          id,
          {
            onSuccess: (bookings) => {
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              );
            },
          },
          ordering_field,
        );
        fetchFilteredMembers({ offer: id, withNotes: true });
      },
    }),
  ),
  withProps(
    ({
      fetchBookingsByOffer,
      fetchBookingOptionByOffer,
      refresh,
      retrieveConsumerPackBulk,
      fetchFilteredMembers,
      cancelBooking,
      registerBooking,
    }) => ({
      addBooking: (
        offerId,
        consumerPaymentPackId,
        keep_credits,
        ordering_field,
        notify_member,
      ) => {
        registerBooking(
          offerId,
          consumerPaymentPackId,
          {
            onSuccess: () => refresh(ordering_field),
          },
          keep_credits,
          notify_member,
        );
      },
      deleteBooking: (bookingId, ordering_field) => {
        cancelBooking(
          bookingId,
          {},
          {
            onSuccess: () => refresh(ordering_field),
          },
        );
      },
      fetchOfferData: (offerId, ordering_field) => {
        fetchBookingsByOffer(
          offerId,
          {
            onSuccess: (bookings) => {
              retrieveConsumerPackBulk(
                bookings.map((b) => b.consumer_payment_pack),
              );
            },
          },
          ordering_field,
        );
        fetchFilteredMembers({ offer: offerId, withNotes: true });
        fetchBookingOptionByOffer(offerId);
      },
    }),
  ),
  // Waiting list
  withProps(
    ({
      toogleWaitingListFreeze,
      fetchOffer,
      registerToWaitingListAction,
      refreshFilteredMembers,
    }) => ({
      switchWaitingListFreeze: (offerId, newFreezeState) => {
        toogleWaitingListFreeze(offerId, newFreezeState, {
          onSuccess: () => fetchOffer(offerId),
        });
      },
      registerToWaitingList: (offerId, memberId) => {
        registerToWaitingListAction(offerId, memberId, {
          onSuccess: () => refreshFilteredMembers({ offer: offerId }),
        });
      },
    }),
  ),
  // Invoice
  withProps(
    ({
      createOrUpdateInvoice,
      refreshFilteredMembers,
      createQuickInvoice,
      refresh,
      id,
      fetchFilteredMembers,
      revertQuickInvoice,
      refreshBookingsByOffer,
    }) => ({
      createQuickUnevenInvoice: (data) => {
        createQuickInvoice(data, () => {
          refresh();
          fetchFilteredMembers({ offer: id, withNotes: true });
        });
      },
      revertQuickInvoiceAndRefreshOffer: (uuid, offerId, ordering_field) => {
        revertQuickInvoice(uuid, () =>
          refreshBookingsByOffer(offerId, ordering_field),
        );
      },
      createInvoice: (
        invoiceData: InvoiceData,
        memberId: number,
        isQuickInvoice,
        offer,
      ) => {
        createOrUpdateInvoice(
          invoiceData,
          true,
          () => {
            refreshFilteredMembers({ offer });
          },
          isQuickInvoice,
        );
      },
    }),
  ),
  withTitle(
    ({ offer, offerLoading }: { offer: Offer, offerLoading: boolean }) =>
      formatTitle(offer, offerLoading),
  ),
)(OfferManagementComponent);
