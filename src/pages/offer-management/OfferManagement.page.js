// @flow
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import {
  replace as replaceRouter,
  push as routerPush,
} from 'react-router-redux';
import { compose } from 'recompose';

import {
  invoice as invoiceActions,
  offer as offerActions,
} from '../../actions';
import { compatiblePacksWithOfferAndEnabled } from '../../libs/offer/selectors';
import shopSelector from '../../libs/shop/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { mailMembers as mailMembersAction } from '../../libs/communication/actions';
import { fetchAll as fetchShopItems } from '../../libs/shop/actions/shopitem';

import {
  addBooking as addBookingAction,
  refreshByOffer as refreshBookingsByOfferAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  deleteBooking as deleteBookingAction,
  confirmBookingAttendance as confirmBookingAttendanceAction,
  discardBookingAttendance as discardBookingAttendanceAction,
  discardBookingOption as discardBookingOptionAction,
  registerToWaitingList as registerToWaitingListAction,
} from '../../libs/booking/actions';
import { getPermissions } from '../../libs/role/selectors';
import bookingSelectors from '../../libs/booking/selectors';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { fetchPrivatePassList } from '../../libs/private-service/actions';

import { snackbar } from '../../actions/snackbar.actions';
import paymentPackSelectors, {
  getAll as getAllPaymentPacks,
} from '../../libs/payment-packs/selectors';

import {
  fetchFilteredMembers,
  refreshFilteredMembers,
  fetchMember as fetchMemberAction,
  createOrUpdateMember,
  search as searchMembersAction,
} from '../../libs/member/actions';
import memberSelectors from '../../libs/member/selectors';

import withTitle from '../../hocs/with-title.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';

const formatTitle = (offer: Offer) => {
  if (offer) {
    const { coach, coach_override } = offer;
    return `${offer.name} - ${
      coach_override ? coach_override.name : coach.name
    }`;
  }
  return '';
};

function mapStateToProps(state, { id }) {
  return {
    offerId: id,
    offer: state.offer.offers.find((o) => o.id === id),
    offers: state.offer.calendar,
    offerLoading: state.offer.byDay.loading,
    paymentPacks: getAllPaymentPacks(state),
    paymentPacksEnabled: paymentPackSelectors.getEnabled(state),
    shopItemsAvailable: shopSelector.getShopItemsAvailable(state),
    membersloading: state.member.loading,
    members: state.member.all,
    memberSearchLoading: state.member.search.loading,
    searchedMembers: memberSelectors.getSearched(state),
    bookings: bookingSelectors.getBookings(state),
    bookingLoading: state.booking.loading,
    bookingOptionsPending: bookingSelectors.getOptionsPending(state),
    memberCreationPending: state.member.upsert.loading,
    memberCreationErrors: state.member.upsert.error,
    compatiblePacks: compatiblePacksWithOfferAndEnabled(state),
    compatiblePacksLoading: state.offer.compatiblePacks.loading,
    unevenSavedInvoices: state.invoice.quickInvoices,
    privatePassList: getPrivatePassAvailable(state),
    permission: getPermissions(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    revertQuickInvoiceAndRefreshOffer(uuid, offerId) {
      dispatch(
        invoiceActions.revertQuickInvoice(uuid, () =>
          dispatch(refreshBookingsByOfferAction(offerId)),
        ),
      );
    },
    fetchOffer(id) {
      dispatch(offerActions.fetchOfferById(id));
    },
    fetchShopItems,
    fetchPrivatePassList() {
      dispatch(fetchPrivatePassList());
    },
    fetchMember(id) {
      dispatch(fetchMemberAction(id));
    },
    fetchOfferData(offerId) {
      dispatch(fetchBookingsByOfferAction(offerId));
      dispatch(fetchFilteredMembers({ offer: offerId, withNotes: true }));
    },
    deleteBooking(bookingId) {
      dispatch(deleteBookingAction(bookingId));
    },
    discardBookingAttendance(bookingId) {
      dispatch(discardBookingAttendanceAction(bookingId));
    },
    confirmBookingAttendance(bookingId) {
      dispatch(confirmBookingAttendanceAction(bookingId));
    },
    switchWaitingListFreeze(offerId, newFreezeState) {
      dispatch(offerActions.toogleWaitingListFreeze(offerId, newFreezeState));
      dispatch(offerActions.fetchOfferById(offerId));
    },
    discardOption(optionId) {
      dispatch(discardBookingOptionAction(optionId));
    },
    registerToWaitingList(offerId, memberId) {
      dispatch(
        registerToWaitingListAction(offerId, memberId, {
          onSuccess: () => dispatch(refreshFilteredMembers({ offer: offerId })),
        }),
      );
    },
    createMember(data, options) {
      dispatch(createOrUpdateMember(data, options));
    },
    createInvoice(
      invoiceData: InvoiceData,
      memberId: number,
      isQuickInvoice,
      offerId,
    ) {
      dispatch(
        invoiceActions.createOrUpdateInvoice(
          invoiceData,
          true,
          () => {
            dispatch(refreshFilteredMembers({ offer: offerId }));
          },
          isQuickInvoice,
        ),
      );
    },
    createQuickUnevenInvoice(data, offerId) {
      dispatch(
        invoiceActions.createQuickInvoice(data, () => {
          dispatch(refreshBookingsByOfferAction(offerId));
          dispatch(refreshFilteredMembers({ offer: offerId }));
        }),
      );
    },
    resetQuickInvoices() {
      dispatch(invoiceActions.resetQuickInvoices());
    },
    goToCalendar(date) {
      dispatch(
        replaceRouter(`/calendar/${date.year}/${date.month}/${date.day}`),
      );
    },
    goToOffer(id) {
      dispatch(replaceRouter(`/offer/${id}`));
    },
    push(path) {
      dispatch(routerPush(path));
    },
    goToMember(pk) {
      dispatch(routerPush(`/member/${pk}/`));
    },
    searchMembers(text: string) {
      dispatch(searchMembersAction(text));
    },
    mailMembers(data: any) {
      dispatch(mailMembersAction(data));
    },
    fetchCompatiblePacks(id: number) {
      dispatch(offerActions.fetchCompatiblePacks(id));
    },
    snackbarSuccess(msg) {
      dispatch(snackbar.success(msg));
    },
    addToOffer({ offerId, consumerPaymentPackId }) {
      dispatch(
        addBookingAction({
          offerId,
          consumerPaymentPackId,
          callback: () => dispatch(refreshFilteredMembers({ offer: offerId })),
        }),
      );
    },
  };
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withNamespaces(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withTitle(({ offer }: { offer: Offer }) => formatTitle(offer)),
)(OfferManagementComponent);
