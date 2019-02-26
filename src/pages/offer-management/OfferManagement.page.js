// @flow
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import { push as routerPush, goBack } from 'react-router-redux';
import { compose } from 'recompose';

import {
  booking as bookingActions,
  invoice as invoiceActions,
  offer as offerActions,
} from '../../actions';
import { createOrUpdateMember } from '../../actions/member.actions';
import { formatAsDatetime } from '../../datetime';

import withDrawer from '../../hocs/with-drawer.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';

const formatTitle = (offer: Offer) => {
  if (offer) {
    return `${offer.name} - ${formatAsDatetime(offer.date_start)}`;
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
    activities: state.activity.all,
    paymentPacks: state.paymentPack.all,
    shopItems: state.shop.all,
    members: state.member.all,
    bookings: state.booking.all,
    bookingLoading: state.booking.loading,
    bookingOptions: state.booking.options,
    memberCreationPending: state.member.createOrUpdatePending,
    memberCreationErrors: state.member.createOrUpdateErrors,
    compatiblePacks: state.offer.compatiblePacks.items,
    compatiblePacksLoading: state.offer.compatiblePacks.loading,
    unevenSavedInvoices: state.invoice.quickInvoices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteBooking(bookingId, memberId) {
      dispatch(bookingActions.deleteBooking(bookingId, memberId));
    },
    fetchBookings(offerId) {
      dispatch(bookingActions.fetchBookingsByOffer(offerId));
    },
    bookingUpdaters: {
      discardBooking(bookingId) {
        dispatch(bookingActions.discardBooking(bookingId));
      },
      confirmBooking(bookingId) {
        dispatch(bookingActions.confirmBooking(bookingId));
      },
      discardBookingAttendance(bookingId) {
        dispatch(bookingActions.discardBookingAttendance(bookingId));
      },
      confirmBookingAttendance(bookingId) {
        dispatch(bookingActions.confirmBookingAttendance(bookingId));
      },
    },
    discardOption(optionId) {
      dispatch(bookingActions.discardBookingOption(optionId));
    },
    createOrUpdateMember(data) {
      dispatch(createOrUpdateMember(data, true));
    },
    createInvoice(invoiceData: InvoiceData, memberId: number, isQuickInvoice) {
      dispatch(
        invoiceActions.createOrUpdateInvoice(
          invoiceData,
          true,
          memberId,
          isQuickInvoice,
        ),
      );
    },
    createQuickUnevenInvoice(data) {
      dispatch(invoiceActions.createQuickInvoice(data));
    },
    resetQuickInvoices() {
      dispatch(invoiceActions.resetQuickInvoices());
    },
    goBack() {
      dispatch(goBack());
    },
    push(path) {
      dispatch(routerPush(path));
    },
    fetchCompatiblePacks(id: number) {
      dispatch(offerActions.fetchCompatiblePacks(id));
    },
    addToOffer({ offerId, consumerPaymentPackId, memberId }) {
      dispatch(
        bookingActions.addBooking({ offerId, consumerPaymentPackId, memberId }),
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
  withDrawer(({ offer }: { offer: Offer }) => formatTitle(offer), true),
)(OfferManagementComponent);
