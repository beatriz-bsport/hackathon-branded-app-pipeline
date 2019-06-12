// @flow
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import {
  replace as replaceRouter,
  push as routerPush,
  goBack,
} from 'react-router-redux';
import { compose } from 'recompose';

import {
  invoice as invoiceActions,
  offer as offerActions,
} from '../../actions';

import {
  addBooking as addBookingAction,
  refreshByOffer as refreshBookingsByOfferAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  deleteBooking as deleteBookingAction,
  confirmBookingAttendance as confirmBookingAttendanceAction,
  discardBookingAttendance as discardBookingAttendanceAction,
  discardBookingOption as discardBookingOptionAction,
} from '../../libs/booking/actions';
import bookingSelectors from '../../libs/booking/selectors';

import { snackbar } from '../../actions/snackbar.actions';
import { formatAsDatetime } from '../../datetime';
import paymentPackSelectors from '../../libs/payment-packs/selectors';

import {
  fetchMemberByOffer,
  fetchMember as fetchMemberAction,
  createOrUpdateMember,
  search as searchMembersAction,
  refreshByOffer as refreshMemberByOffer,
} from '../../libs/member/actions';
import memberSelectors from '../../libs/member/selectors';

import withDrawer from '../../hocs/with-drawer.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';

const formatTitle = (offer: Offer) => {
  if (offer) {
    const { coach, coach_override } = offer;
    return `${offer.name} - ${formatAsDatetime(offer.date_start)} - ${
      coach_override ? coach_override.name : coach.name
    }`;
  }
  return '';
};

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const offerId = (match && match.params && +match.params.id) || null;

  return {
    offerId,
    offer: state.offer.offers.find((o) => o.id === offerId),
    offers: state.offer.calendar,
    offerLoading: state.offer.byDay.loading,
    activities: state.activity.all,
    paymentPacks: paymentPackSelectors.getAll(state),
    shopItems: state.shop.all,
    members: state.member.byOffer.items,
    memberSearchLoading: state.member.search.loading,
    searchedMembers: memberSelectors.getSearched(state),
    bookings: bookingSelectors.getBookings(state),
    bookingLoading: state.booking.loading,
    bookingOptions: bookingSelectors.getOptions(state),
    memberCreationPending: state.member.upsert.loading,
    memberCreationErrors: state.member.upsert.error,
    compatiblePacks: state.offer.compatiblePacks.items.filter(
      (pp) => !pp.disabled,
    ),
    compatiblePacksLoading: state.offer.compatiblePacks.loading,
    unevenSavedInvoices: state.invoice.quickInvoices,
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
    fetchMember(id) {
      dispatch(fetchMemberAction(id));
    },
    fetchOfferData(offerId) {
      dispatch(fetchBookingsByOfferAction(offerId));
      dispatch(fetchMemberByOffer(offerId));
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
    discardOption(optionId) {
      dispatch(discardBookingOptionAction(optionId));
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
            dispatch(refreshMemberByOffer(offerId));
          },
          isQuickInvoice,
        ),
      );
    },
    createQuickUnevenInvoice(data, offerId) {
      dispatch(
        invoiceActions.createQuickInvoice(data, () => {
          dispatch(refreshBookingsByOfferAction(offerId));
          dispatch(refreshMemberByOffer(offerId));
        }),
      );
    },
    resetQuickInvoices() {
      dispatch(invoiceActions.resetQuickInvoices());
    },
    goBack() {
      dispatch(goBack());
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
          callback: () => dispatch(refreshMemberByOffer(offerId)),
        }),
      );
    },
  };
}

export default compose(
  withNamespaces(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(({ offer }: { offer: Offer }) => formatTitle(offer)),
)(OfferManagementComponent);
