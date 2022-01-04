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
} from '#libs/invoice/actions';
import {
  fetchOfferById as fetchOfferByIdAction,
  toggleWaitingListFreeze as toggleWaitingListFreezeAction,
  fetchCompatiblePacks as fetchCompatiblePacksAction,
  fetchOfferStatus as fetchOfferStatusAction,
} from '#libs/offer/actions';
import {
  compatiblePacksWithOfferAndEnabled,
  getDetailedOffer,
  withSpecificCoach,
} from '#libs/offer/selectors';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { sendCommunication } from '#libs/communication/actions';

import { fetchShopItemAsManager as fetchShopItems } from '#libs/shop/actions/shopitem';
import themeSelectors from '#libs/theme/selectors';
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
  setSpotForBooking as setSpotForBookingAction,
  fetchBookingsByConsumerPack,
} from '#libs/booking/actions';
import {
  discardBookingOption as discardBookingOptionAction,
  registerToWaitingList as registerToWaitingListAction_,
  fetchByOffer as fetchBookingOptionByOfferAction,
} from '#libs/waiting-list/actions';
import {
  getOfferBookingListWithConsumerPack,
  getRecurrenceRuleBookingList,
} from '#libs/booking/selectors';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';

import { fetchPrivatePassList } from '#libs/private-service/actions';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#libs/email-editor/actions';

import { fetchEstablishments } from '#libs/establishment/actions';
import { getAvailableEstablishmentList } from '#libs/establishment/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { snackbar } from '../../actions/snackbar.actions';
import { getEnabled as getPaymentPackEnabled } from '#libs/payment-packs/selectors';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  fetchMemberBulk as fetchMemberBulkAction,
  refreshFilteredMembers as refreshFilteredMembersAction,
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
  search as searchMembersAction,
} from '#libs/member/actions';
import {
  getSearchedMembers,
  getAllMembers,
  getMemberDetailData,
  getMemberHistory,
  withTags,
} from '#libs/member/selectors';

import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';

import {
  withInvoiceItem,
  withMember,
  getInvoiceListUnpaid,
  getBuyableItem,
  getAllQuickCreatedInvoices,
} from '#libs/invoice/selectors';

import withTitle from '#hocs/with-title.hoc';
import OfferManagementComponent from './OfferManagement.component';

import type { Offer } from '../../api/types';
import {
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
} from '#libs/spot-scheduling/actions';
import { RootState } from '../../reducers';
import { getAssetByBlueprintByIdentifier } from '#libs/spot-scheduling/selector';
import { Booking } from '#libs/booking/types';
import { fetchSignFormUpConfiguration } from '#libs/sign-up-form/actions';
import { getSignUpFormConfigurationDict } from '#libs/sign-up-form/selectors';

import { showVaccinationStatus } from '../../libs/custom-form/selectors';
import { fetchVideoPurchase } from '../../libs/video/actions';

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
    (state: RootState) => ({
      // offer
      offer: withSpecificCoach(getDetailedOffer)(state),
      offerLoading: state.offer.retrieve.loading,
      // payment pack
      paymentPacksEnabled: getPaymentPackEnabled(state),
      compatiblePacks: compatiblePacksWithOfferAndEnabled(state),
      compatiblePacksLoading: state.offer.compatiblePacks.loading,
      // member
      membersloading: state.member.loading,
      members: withTags(getAllMembers)(state),
      memberDetails: getMemberDetailData(state),
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
      unpaidInvoiceList: withMember(withInvoiceItem(getInvoiceListUnpaid))(
        state,
      ),
      quickCreatedInvoices: withInvoiceItem(getAllQuickCreatedInvoices)(state),

      // buyable stuff
      availableBuyableItems: getBuyableItem(state),
      // theme
      company_theme: themeSelectors.getTheme(state),
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
      assetsForBlueprintById: getAssetByBlueprintByIdentifier(state),
      offerStatusById: state.offer.offerStatus.byId,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      companyId: state.theme.theme.company,
      showVaccinationStatus: showVaccinationStatus(state),
    }),
    {
      fetchOffer: fetchOfferByIdAction,
      snackbarSuccess: snackbar.success,

      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: emailTemplateDetail,

      fetchEstablishmentList: fetchEstablishments,
      fetchInvoice,
      fetchInvoiceList: fetchInvoiceListAction,

      toggleWaitingListFreeze: toggleWaitingListFreezeAction,
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
      fetchBookingsByConsumerPack,

      // modify booking
      registerBooking: registerBookingAction,
      cancelBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,

      // member
      fetchMember: fetchMemberAction,
      createMember: createOrUpdateMember,
      refreshFilteredMembers: refreshFilteredMembersAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchMemberBulk: fetchMemberBulkAction,
      searchMembers: (txt) => searchMembersAction(txt, { hide_archived: true }),

      sendCommunication,

      // invoice actions
      revertQuickInvoice: revertQuickInvoiceAction,
      createQuickInvoice: createQuickInvoiceAction,
      fetchInvoiceItemList: fetchInvoiceItemListAction,
      createOrUpdateInvoice: createOrUpdateInvoiceAction,
      resetQuickInvoices,
      fetchRoomBlueprintDetail: fetchRoomBlueprintDetailAction,
      fetchAssetForBlueprint: fetchAssetForBlueprintAction,
      fetchOfferStatus: fetchOfferStatusAction,

      // move
      goToCalendar: (date) =>
        replaceRouter(`/calendar/${date.year}/${date.month}/${date.day}`),
      goToOffer: (id) => replaceRouter(`/offer/${id}`),
      push: routerPush,
      goToMember: (id) => routerPush(`/member/${id}/`),
      setSpotForBooking: setSpotForBookingAction,
      fetchVideoPurchase,
      fetchSignFormUpConfiguration,
    },
  ),
  withHandlers({
    fetchBookingOptionByOffer:
      ({ fetchBookingOptionByOffer }) =>
      (offerId) => {
        return fetchBookingOptionByOffer(offerId, { show_cancelled: true });
      },
    fetchInvoiceListUnpaid:
      ({ fetchInvoiceList }) =>
      (params) => {
        fetchInvoiceList({
          is_v2: true,
          is_draft: false,
          unpaid: true,
          ...(params || {}),
        });
      },
  }),
  withProps(({ id }) => ({
    offerId: id,
  })),
  withHandlers({
    refresh:
      ({
        refreshBookingsByOffer,
        fetchFilteredMembers,
        retrieveConsumerPackBulk,
        id,
      }) =>
      (ordering_field) => {
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
    addBooking:
      ({ refresh, registerBooking, fetchOfferStatus, fetchOffer }) =>
      (consumerPaymentPackId, data, ordering_field) => {
        registerBooking(consumerPaymentPackId, data, {
          onSuccess: () => {
            fetchOffer(data.offer);
            fetchOfferStatus(data.offer);
            refresh(ordering_field);
          },
        });
      },
    deleteBooking:
      ({ refresh, cancelBooking, fetchOfferStatus, id }) =>
      (bookingId, ordering_field, options, data) => {
        cancelBooking(bookingId, data || {}, {
          onSuccess: () => {
            fetchOfferStatus(id);
            refresh(ordering_field);
            if (options && options.onSuccess) {
              options.onSuccess();
            }
          },
        });
      },
    fetchOfferData:
      ({
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
        fetchRoomBlueprintDetail,
        fetchAssetForBlueprint,
        fetchOfferStatus,
      }) =>
      (ordering_field) => {
        fetchOffer(offerId, {
          onSuccess: (offer: Offer) => {
            if (offer.room_blueprint) {
              fetchRoomBlueprintDetail(offer.room_blueprint);
              fetchAssetForBlueprint({
                blueprint: offer.room_blueprint,
              });
            }
          },
        });
        fetchOfferStatus(offerId);
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
              if (memberList && memberList.length) {
                fetchInvoiceListUnpaid({
                  member__in: memberList.map((m) => m.id),
                });
              }
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
    switchWaitingListFreeze:
      ({ toggleWaitingListFreeze, fetchOffer, fetchBookingOptionByOffer }) =>
      (offerId, newFreezeState) => {
        toggleWaitingListFreeze(offerId, newFreezeState, {
          onSuccess: () => {
            fetchOffer(offerId);
            fetchBookingOptionByOffer(offerId);
          },
        });
      },
    registerToWaitingList:
      ({ registerToWaitingListAction, refreshFilteredMembers }) =>
      (offerId, memberId) => {
        registerToWaitingListAction(offerId, memberId, {
          onSuccess: () => refreshFilteredMembers({ offer: offerId }),
        });
      },
    createQuickUnevenInvoice:
      ({
        createQuickInvoice,
        fetchInvoiceItemList,
        refresh,
        fetchInvoiceListUnpaid,
        id,
        fetchFilteredMembers,
        fetchOfferStatus,
        fetchOffer,
      }) =>
      (data) => {
        createQuickInvoice(data, {
          onSuccess: (invoice) => {
            fetchOffer(id);
            fetchOfferStatus(id);
            fetchFilteredMembers(
              { offer: id, withNotes: true },

              {
                onSuccess: (memberList) => {
                  if (memberList && memberList.length) {
                    fetchInvoiceListUnpaid({
                      member__in: memberList.map((m) => m.id),
                    });
                  }
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
    revertQuickInvoiceAndRefreshOffer:
      ({
        revertQuickInvoice,
        refreshBookingsByOffer,
        fetchInvoiceListUnpaid,
      }) =>
      (uuid, offerId, ordering_field) => {
        revertQuickInvoice(uuid, {
          onSuccess: () => {
            refreshBookingsByOffer(
              offerId,
              {
                onSuccess: (bookingList) => {
                  if (bookingList && bookingList.length) {
                    fetchInvoiceListUnpaid({
                      member__in: bookingList.map((b) => b.member),
                    });
                  }
                },
              },
              ordering_field,
            );
          },
        });
      },
    createInvoice:
      ({ createOrUpdateInvoice, refreshFilteredMembers }) =>
      (invoiceData, offer, options) => {
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
    setSpotForBooking:
      ({ setSpotForBooking, fetchOfferStatus, id }) =>
      (booking?: Booking, spot_id: number) => {
        setSpotForBooking(booking.id, spot_id, {
          onSuccess: () => {
            fetchOfferStatus(id);
          },
        });
      },
  }),
  withTitle(
    ({ offer, offerLoading }: { offer: Offer, offerLoading: boolean }) =>
      formatTitle(offer, offerLoading),
  ),
)(OfferManagementComponent);
