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
  booking as bookingActions,
  invoice as invoiceActions,
  offer as offerActions,
  member as memberAction,
} from '../../actions';
import { snackbar } from '../../actions/snackbar.actions';
import { createOrUpdateMember } from '../../actions/member.actions';
import { formatAsDatetime } from '../../datetime';
import paymentPackSelectors from '../../libs/payment-packs/selectors';

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
    allMembers: state.member.all,
    bookings: state.booking.all,
    bookingLoading: state.booking.loading,
    bookingOptions: state.booking.options,
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
          dispatch(bookingActions.refreshByOffer(offerId)),
        ),
      );
    },
    fetchOffer(id) {
      dispatch(offerActions.fetchOfferById(id));
    },
    fetchOfferData(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
      dispatch(memberAction.fetchMemberByOffer(offerId));
    },
    deleteBooking(bookingId) {
      dispatch(bookingActions.deleteBooking(bookingId));
    },
    discardBookingAttendance(bookingId) {
      dispatch(bookingActions.discardBookingAttendance(bookingId));
    },
    confirmBookingAttendance(bookingId) {
      dispatch(bookingActions.confirmBookingAttendance(bookingId));
    },
    discardOption(optionId) {
      dispatch(bookingActions.discardBookingOption(optionId));
    },
    createMember(data, options) {
      dispatch(
        createOrUpdateMember(
          data,
          true,
          options, // TODO
        ),
      );
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
            dispatch(memberAction.refreshByOffer(offerId));
          },
          isQuickInvoice,
        ),
      );
    },
    createQuickUnevenInvoice(data, offerId) {
      dispatch(
        invoiceActions.createQuickInvoice(data, () => {
          dispatch(bookingActions.refreshByOffer(offerId));
          dispatch(memberAction.refreshByOffer(offerId));
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
      dispatch(routerPush(`/member/${pk}`));
    },
    fetchCompatiblePacks(id: number) {
      dispatch(offerActions.fetchCompatiblePacks(id));
    },
    refreshListMember() {
      dispatch(memberAction.refresher());
    },
    snackbarSuccess(msg) {
      dispatch(snackbar.success(msg));
    },
    addToOffer({ offerId, consumerPaymentPackId }) {
      dispatch(
        bookingActions.addBooking({
          offerId,
          consumerPaymentPackId,
          callback: () => dispatch(memberAction.refreshByOffer(offerId)),
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
