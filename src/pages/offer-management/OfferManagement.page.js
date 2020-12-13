// @flow
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import {
  replace as replaceRouter,
  push as routerPush,
} from 'connected-react-router';
import { compose, withProps, withHandlers } from 'recompose';

import {
  revertQuickInvoice as revertQuickInvoiceAction,
  createQuickInvoice as createQuickInvoiceAction,
  fetchInvoiceItemList as fetchInvoiceItemListAction,
  createOrUpdateInvoice as createOrUpdateInvoiceAction,
  resetQuickInvoices,
  fetchSpecificInvoice as fetchInvoice,
  fetchInvoiceList as fetchInvoiceListAction,
} from '../../libs/invoice/actions';
import {
  fetchOfferById as fetchOfferByIdAction,
  toogleWaitingListFreeze as toogleWaitingListFreezeAction,
  fetchCompatiblePacks as fetchCompatiblePacksAction,
} from '../../libs/offer/actions';
import {
  compatiblePacksWithOfferAndEnabled,
  getDetailedOffer,
} from '../../libs/offer/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { sendCommunication } from '../../libs/communication/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import themeSelectors from '../../libs/theme/selectors';
import {
  registerBooking as registerBookingAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  refreshBookingsByOffer as refreshBookingsByOfferAction,
  cancelBooking as cancelBookingAction,
  confirmAttendance as confirmBookingAttendanceAction,
  discardAttendance as discardBookingAttendanceAction,
  fetchRecurrenceRuleBooking as fetchRecurrenceRuleBookingAction,
  createRecurrenceRuleBooking,
  deleteRecurrenceRuleBooking,
  updateRecurrenceRuleBooking,
} from '../../libs/booking/actions';
import {
  discardBookingOption as discardBookingOptionAction,
  registerToWaitingList as registerToWaitingListAction_,
  fetchByOffer as fetchBookingOptionByOfferAction,
} from '../../libs/waiting-list/actions';
import { getPermissions } from '../../libs/role/selectors';
import {
  getOfferBookingListWithConsumerPack,
  getRecurrenceRuleBookingList,
} from '../../libs/booking/selectors';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '../../libs/consumer-payment-pack/actions';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '../../libs/email-editor/actions';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import { snackbar } from '../../actions/snackbar.actions';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  fetchMemberBulk as fetchMemberBulkAction,
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

import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';

import {
  withInvoiceItem,
  withMember,
  getInvoiceList,
  getBuyableItem,
} from '../../libs/invoice/selectors';

import withTitle from '../../hocs/with-title.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';

const RECURRENT_BOOKING_PAGE_SIZE = 10;

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

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(),
  connect(
    (state) => ({
      // offer
      offer: getDetailedOffer(state),
      offerLoading: state.offer.retrieve.loading,
      // payment pack
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
      country: state.theme.theme.locale.split('_')[1],
      // booking
      bookings: getOfferBookingListWithConsumerPack(state),
      bookingLoading: state.booking.loading,
      bookingOptionsPending: state.waitingList.option.items,
      recurrenceRuleBooking: getRecurrenceRuleBookingList(state),
      metaActivities: getEnabledMetaActivities(state),
      recurrentBookingCurrentPage: state.booking.recurrenceRule.page,
      recurrentBookingNextPage: state.booking.recurrenceRule.next_page,
      recurrentBookingCount: state.booking.recurrenceRule.count,
      email_templates_list: getAllEmailTemplatesSummaries(state),

      email_templates_details: getEmailTemplatesDetail(state),

      establishmentList: getAvailableEstablishmentList(state),

      // invoice
      unpaidInvoiceList: withMember(withInvoiceItem(getInvoiceList))(state),
      // buyable stuff
      permission: getPermissions(state),
      availableBuyableItems: getBuyableItem(state),
      // theme
      company_theme: themeSelectors.getTheme(state),
    }),
    {
      fetchOffer: fetchOfferByIdAction,
      snackbarSuccess: snackbar.success,

      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: emailTemplateDetail,

      fetchEstablishmentList: fetchEstablishments,
      fetchInvoice,
      fetchInvoiceList: fetchInvoiceListAction,

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
      fetchRecurrenceRuleBooking: fetchRecurrenceRuleBookingAction,
      createRecurrenceRuleBooking,
      deleteRecurrenceRuleBooking,
      updateRecurrenceRuleBooking,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,

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
      fetchMemberBulk: fetchMemberBulkAction,
      searchMembers: (txt) => searchMembersAction(txt),

      sendCommunication,

      // invoice actions
      revertQuickInvoice: revertQuickInvoiceAction,
      createQuickInvoice: createQuickInvoiceAction,
      fetchInvoiceItemList: fetchInvoiceItemListAction,
      createOrUpdateInvoice: createOrUpdateInvoiceAction,
      resetQuickInvoices,

      // move
      goToCalendar: (date) =>
        replaceRouter(`/calendar/${date.year}/${date.month}/${date.day}`),
      goToOffer: (id) => replaceRouter(`/offer/${id}`),
      push: routerPush,
      goToMember: (id) => routerPush(`/member/${id}/`),
    },
  ),
  withHandlers({
    fetchBookingOptionByOffer: ({ fetchBookingOptionByOffer }) => (offerId) => {
      return fetchBookingOptionByOffer(offerId, { show_cancelled: true });
    },
    fetchInvoiceListUnpaid: ({ fetchInvoiceList }) => (params) => {
      fetchInvoiceList({ unpaid: true, ...(params || {}) });
    },
  }),
  withProps(({ id }) => ({
    offerId: id,
  })),
  withHandlers({
    refresh: ({
      refreshBookingsByOffer,
      fetchFilteredMembers,
      retrieveConsumerPackBulk,
      id,
    }) => (ordering_field) => {
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
  withHandlers({
    addBooking: ({ refresh, registerBooking }) => (
      consumerPaymentPackId,
      data,
      ordering_field,
    ) => {
      registerBooking(consumerPaymentPackId, data, {
        onSuccess: () => refresh(ordering_field),
      });
    },
    deleteBooking: ({ refresh, cancelBooking }) => (
      bookingId,
      ordering_field,
      options,
      data,
    ) => {
      cancelBooking(bookingId, data || {}, {
        onSuccess: () => {
          refresh(ordering_field);
          if (options && options.onSuccess) {
            options.onSuccess();
          }
        },
      });
    },
    fetchOfferData: ({
      fetchOffer,
      fetchBookingsByOffer,
      fetchRecurrenceRuleBooking,
      fetchBookingOptionByOffer,
      retrieveConsumerPackBulk,
      fetchCompatiblePacks,
      fetchFilteredMembers,
      fetchMemberBulk,
      offerId,
      fetchInvoiceListUnpaid,
    }) => (ordering_field) => {
      fetchOffer(offerId);
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
      fetchFilteredMembers(
        { offer: offerId, withNotes: true },
        {
          onSuccess: (memberList) => {
            fetchInvoiceListUnpaid({ member__in: memberList.map((m) => m.id) });
          },
        },
      );
      fetchBookingOptionByOffer(offerId);
      fetchCompatiblePacks(offerId);
      fetchRecurrenceRuleBooking(
        { offer: offerId, page: 1, page_size: RECURRENT_BOOKING_PAGE_SIZE },
        {
          onSuccess: (recurrenceRuleList) => {
            if (recurrenceRuleList.length) {
              fetchMemberBulk({
                id__in: recurrenceRuleList.map((nr) => nr.member),
              });
            }
          },
        },
      );
    },
    switchWaitingListFreeze: ({
      toogleWaitingListFreeze,
      fetchOffer,
      fetchBookingOptionByOffer,
    }) => (offerId, newFreezeState) => {
      toogleWaitingListFreeze(offerId, newFreezeState, {
        onSuccess: () => {
          fetchOffer(offerId);
          fetchBookingOptionByOffer(offerId);
        },
      });
    },
    registerToWaitingList: ({
      registerToWaitingListAction,
      refreshFilteredMembers,
    }) => (offerId, memberId) => {
      registerToWaitingListAction(offerId, memberId, {
        onSuccess: () => refreshFilteredMembers({ offer: offerId }),
      });
    },
    createQuickUnevenInvoice: ({
      createQuickInvoice,
      fetchInvoiceItemList,
      refresh,
      fetchInvoiceListUnpaid,
      id,
      fetchFilteredMembers,
    }) => (data) => {
      createQuickInvoice(data, {
        onSuccess: (invoice) => {
          fetchFilteredMembers(
            { offer: id, withNotes: true },

            {
              onSuccess: (memberList) => {
                fetchInvoiceListUnpaid({
                  member__in: memberList.map((m) => m.id),
                });
              },
            },
          );
          fetchInvoiceItemList({
            invoice__uuid: invoice.uuid,
            page_size: 10,
          });
          refresh();
        },
      });
    },
    revertQuickInvoiceAndRefreshOffer: ({
      revertQuickInvoice,
      refreshBookingsByOffer,
    }) => (uuid, offerId, ordering_field) => {
      revertQuickInvoice(uuid, {
        onSuccess: () => refreshBookingsByOffer(offerId, ordering_field),
      });
    },
    createInvoice: ({ createOrUpdateInvoice, refreshFilteredMembers }) => (
      invoiceData,
      offer,
      options,
    ) => {
      createOrUpdateInvoice(invoiceData, {
        onSuccess: (invoice) => {
          if (options && options.onSuccess) {
            options.onSuccess(invoice);
          }

          refreshFilteredMembers({ offer });
        },
        onError: options && options.onError,
      });
    },
  }),
  withTitle(
    ({ offer, offerLoading }: { offer: Offer, offerLoading: boolean }) =>
      formatTitle(offer, offerLoading),
  ),
)(OfferManagementComponent);
