// @flow
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import {
  replace as replaceRouter,
  push as routerPush,
} from 'connected-react-router';
import { compose, withProps, withHandlers } from 'recompose';
import uniq from 'lodash/uniq';
import {
  revertQuickInvoice as revertQuickInvoiceAction,
  createQuickInvoice as createQuickInvoiceAction,
  fetchInvoiceItemList as fetchInvoiceItemListAction,
  createOrUpdateInvoice as createOrUpdateInvoiceAction,
  resetInvoiceList as resetInvoiceListAction,
  fetchSpecificInvoice as fetchInvoice,
  fetchInvoiceList as fetchInvoiceListAction,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
  fetchInvoiceConfiguration as fetchInvoiceConfigurationAction,
} from '#src/libs/invoice/actions';
import {
  fetchOfferById as fetchOfferByIdAction,
  toggleWaitingListFreeze as toggleWaitingListFreezeAction,
  fetchOfferStatus as fetchOfferStatusAction,
  postRollCall as postRollCallAction,
  updateInternalNote as updateInternalNoteAction,
  fetchOfferBulk as fetchOfferBulkAction,
  fetchOfferStatusList as fetchOfferStatusListAction,
} from '#src/libs/offer/actions';
import {
  getDetailedOffer,
  withSpecificCoach,
  withEstablishment,
  withCoach,
  withMetaActivity,
} from '#src/libs/offer/selectors';
import { getStripeReaders } from '#src/libs/terminal/selectors';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchCompanyUserRoles } from '#src/libs/role/actions';
import { fetchShopItemAsManager as fetchShopItems } from '#src/libs/shop/actions/shopitem';
import themeSelectors from '#src/libs/theme/selectors';
import {
  registerBooking as registerBookingAction,
  fetchBookingsByOffer as fetchBookingsByOfferAction,
  refreshBookingsByOffer as refreshBookingsByOfferAction,
  cancelBooking as cancelBookingAction,
  confirmAttendanceAndRollCallRetrieve as confirmBookingAttendanceAction,
  discardAttendanceAndRollCallRetrieve as discardBookingAttendanceAction,
  fetchRecurrenceRuleBooking as fetchRecurrenceRuleBookingAction,
  createRecurrenceRuleBooking,
  deleteRecurrenceRuleBooking,
  updateRecurrenceRuleBooking,
  setSpotForBooking as setSpotForBookingAction,
  fetchBookingsByConsumerPack,
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
  retrieveOfferWithCancelledBookings as retrieveOfferWithCancelledBookingsAction,
  updateOfferWithCancelledBookingsToRetry as updateOfferWithCancelledBookingsToRetryAction,
  refundBookingAsManager as refundBookingAsManagerAction,
} from '#src/libs/booking/actions';
import {
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
} from '#src/libs/spot-scheduling/actions';
import { fetchStripeReaders } from '#src/libs/terminal/actions';

import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifierFromState,
} from '#src/libs/spot-scheduling/selector';
import { getActiveCoaches } from '#src/libs/associated-coach/selectors';

import {
  fetchAllWaitingListPositions as fetchAllWaitingListPositionsAction,
  discardBookingOption as discardBookingOptionAction_,
  registerToWaitingList as registerToWaitingListAction_,
  fetchByOffer as fetchBookingOptionByOfferAction,
  fetchCompanyConfiguration as fetchCompanyWaitlistConfigurationAction,
  registerMultipleOptionsBackground as registerMultipleOptionsBackgroundAction,
} from '#src/libs/waiting-list/actions';
import {
  getOfferBookingListWithConsumerPack,
  getRecurrenceRuleBookingList,
  withStaffModificationHistory,
  getOffersDataList,
  getOffersIds,
  getUpdateOffersToRetryLoading,
  getOffersWithCancelledBookingsLoading,
  getIsRefundBookingLoading,
} from '#src/libs/booking/selectors';
import { getAllCustomLevels, withCustomLevel } from '#src/libs/level/selectors';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';

import {
  retrieveConsumerPackBulk as retrieveConsumerPackBulkAction,
  retrieveConsumerPackBulkBatched as retrieveConsumerPackBulkBatchedAction,
} from '#src/libs/consumer-payment-pack/actions';

import { fetchPrivatePassList } from '#src/libs/private-service/actions';
import { fetchPaymentComboList } from '#src/libs/payment-combo/actions';
import {
  emailTemplateDetail,
  emailTemplatesSummaries as fetchEmailTemplatesSummaries,
} from '#src/libs/email-editor/actions';

import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
} from '#src/libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
} from '#src/libs/establishment/selectors';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
  refreshFilteredMembers as refreshFilteredMembersAction,
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
  search as searchMembersAction,
} from '#src/libs/member/actions';
import {
  getSearchedMembers,
  getAllMembers,
  getMemberDetailData,
  getMemberHistory,
  withTags,
  withMemberProgram,
} from '#src/libs/member/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#src/libs/group-offer/actions';
import {
  getEnabledMetaActivities,
  getMetaActivity,
  getMetaActivityLoading,
} from '#src/libs/meta-activity/selectors';
import { getGroupListCount, withGroup } from '#src/libs/group-offer/selectors';

import {
  withInvoiceItem,
  getBuyableItem,
  getAllQuickCreatedInvoices,
  getUnpaidInvoiceListWithInvoiceItemAndMembers,
} from '#src/libs/invoice/selectors';

import withTitle from '#src/hocs/with-title.hoc';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import { Booking } from '#src/libs/booking/types';
import { fetchSignFormUpConfiguration } from '#src/libs/sign-up-form/actions';
import { getSignUpFormConfigurationDict } from '#src/libs/sign-up-form/selectors';
import {
  getBookingOptionPositionById,
  getWaitingListConfigurationData,
} from '#src/libs/waiting-list/selectors';
import {
  fetchMemberProgram as fetchMemberProgramAction,
  fetchProgram as fetchProgramAction,
  fetchMetric as fetchMetricAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
} from '#src/libs/performance-tracking/actions';
import { fetchVideoPurchase } from '#src/libs/video/actions';
import {
  getProgramList,
  getMemberProgramIdsList,
} from '#src/libs/performance-tracking/selector';
import {
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
  fetchGiftcardBulk as fetchGiftcardBulkAction,
  fetchGiftcardList as fetchGiftcardListAction,
} from '#src/libs/giftcard/actions';
import {
  getConsumerGiftcardList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
} from '#src/libs/giftcard/selectors';
import { getUnreadAnswersCount as getUnreadAnswersCountAction } from '#src/libs/communication-v2/actions';
import type { MemberMinimal } from '#src/libs/member/types';
import { getInvoicePaymentGroupIsProcessing } from '../../libs/payment/selectors';
import { submitInternalPaymentInBackground as submitInternalPaymentInBackgroundAction } from '../../libs/payment/actions';
import { RootState } from '../../reducers';
import type { Offer } from '../../api/types';
import OfferManagementComponent from './OfferManagement.component';
import { snackbar } from '../../actions/snackbar.actions';
import { getLocaleCountry } from '#src/utils/language';

const RECURRENT_BOOKING_PAGE_SIZE = 10;

const formatTitle = (offer: Offer, offerLoading: boolean) => {
  if (!offer || offerLoading) {
    return ' - ';
  }
  if (offer && offer.name) {
    const { coach, coach_override, name_override } = offer;
    return `${name_override || offer.name} - ${
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
      offer: withCustomLevel(withGroup(withSpecificCoach(getDetailedOffer)))(
        state,
      ),
      getBookingOffer: () => getDetailedOffer(state),
      offerLoading: state.offer.retrieve.loading,
      getOfferMetaActivity: (metaActivityId: number) =>
        getMetaActivity(state, metaActivityId),
      isMetaActivityLoading: getMetaActivityLoading(state),
      // member
      membersloading: state.member.loading,
      members: withMemberProgram(withTags(getAllMembers))(state),
      memberDetails: getMemberDetailData(state),
      memberHistory: getMemberHistory(state),
      memberSearchLoading: state.member.search.loading,
      searchedMembers: getSearchedMembers(state),
      memberCreationPending: state.member.upsert.loading,
      memberCreationErrors: state.member.upsert.error,
      country: getLocaleCountry(state.theme.theme.locale),
      coaches: getActiveCoaches(state),

      // booking
      bookings: withStaffModificationHistory(
        getOfferBookingListWithConsumerPack,
      )(state),
      bookingLoading: state.booking.loading,
      bookingOptionsPending: state.waitingList.option.items,
      recurrenceRuleBooking: getRecurrenceRuleBookingList(state),
      metaActivities: getEnabledMetaActivities(state),
      recurrentBookingCurrentPage: state.booking.recurrenceRule.page,
      recurrentBookingNextPage: state.booking.recurrenceRule.next_page,
      recurrentBookingCount: state.booking.recurrenceRule.count,
      email_templates_list: getAllEmailTemplatesSummaries(state),
      isRefundBookingLoading: getIsRefundBookingLoading(state),

      email_templates_details: getEmailTemplatesDetail(state),

      establishmentList: getAvailableEstablishmentList(state),
      offersWithCancelledBookings: withMetaActivity(
        withCoach(withEstablishment(withCustomLevel(getOffersDataList))),
      )(state),
      offersWithCancelledBookingsIdsList: getOffersIds(state),
      offersWithCancelledBookingsLoading:
        getOffersWithCancelledBookingsLoading(state),
      updateOffersToRetryLoading: getUpdateOffersToRetryLoading(state),
      // invoice
      unpaidInvoiceList: getUnpaidInvoiceListWithInvoiceItemAndMembers(state),
      quickCreatedInvoices: withInvoiceItem(getAllQuickCreatedInvoices)(state),
      invoiceConfiguration: state.invoice.configuration.result,
      isInvoiceConfigurationLoading: state.invoice.configuration.loading,

      // buyable stuff
      availableBuyableItems: getBuyableItem(state),
      // theme
      company_theme: themeSelectors.getTheme(state),
      revampedBackofficeEnabled:
        themeSelectors.getTheme(state)?.revamped_backoffice_enabled &&
        state.auth?.has_enabled_revamped_backoffice,
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
      assetsForBlueprintById: getAssetByBlueprintByIdentifierFromState(state),
      offerStatusById: state.offer.offerStatus.byId,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      companyId: state.theme.theme.company,
      programList: getProgramList(state),
      memberProgramIdsList: getMemberProgramIdsList(state),
      programDataLoading:
        state.performanceTracking.memberProgram.loading ||
        state.performanceTracking.metricList.loading ||
        state.performanceTracking.program.loading,
      consumerGiftcardList: withSender(
        withReceiver(onlyUsable(withGiftcard(getConsumerGiftcardList))),
      )(state),
      activityGroups: getGroupListCount(state),
      spotTypes: getSpotTypesOfCompany(state),
      stripeReaders: getStripeReaders(state),
      waitingListConfiguration: getWaitingListConfigurationData(state),
      bookingOptionPositionById: getBookingOptionPositionById(state),

      // unread answers
      numberOfUnreadAnswers: state.communicationV2.unreadAnswers.count,
      rollCallLoading: state.offer.rollCall.loading,
      // PaymentGroup

      getInvoicePaymentGroupIsProcessing: (invoiceUuid: string) =>
        getInvoicePaymentGroupIsProcessing(state, invoiceUuid),

      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      customLevels: getAllCustomLevels(state),
    }),
    {
      fetchOffer: fetchOfferByIdAction,
      snackbarSuccess: snackbar.success,

      fetchEstablishmentList: fetchEstablishments,

      toggleWaitingListFreeze: toggleWaitingListFreezeAction,
      registerToWaitingListAction: registerToWaitingListAction_,
      discardBookingOptionAction: discardBookingOptionAction_,
      fetchBookingOptionByOffer: fetchBookingOptionByOfferAction,
      fetchStripeReaders,

      // buyable stuff
      fetchShopItems,
      fetchPrivatePassList,
      fetchPaymentComboList,

      // fetch staff users
      fetchCompanyUserRoles,

      // fetch booking member and consumerpack
      fetchBookingsByOffer: fetchBookingsByOfferAction,
      refreshBookingsByOffer: refreshBookingsByOfferAction,
      retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
      retrieveConsumerPackBulkBatched: retrieveConsumerPackBulkBatchedAction,
      fetchRecurrenceRuleBooking: fetchRecurrenceRuleBookingAction,
      createRecurrenceRuleBooking,
      deleteRecurrenceRuleBooking,
      updateRecurrenceRuleBooking,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchBookingsByConsumerPack,

      // modify booking
      refundBookingAsManager: refundBookingAsManagerAction,
      registerBooking: registerBookingAction,
      registerMultipleOptionsBackground:
        registerMultipleOptionsBackgroundAction,
      cancelBooking: cancelBookingAction,
      discardBookingAttendance: discardBookingAttendanceAction,
      confirmBookingAttendance: confirmBookingAttendanceAction,
      retrieveOfferWithCancelledBookings:
        retrieveOfferWithCancelledBookingsAction,
      updateOfferWithCancelledBookingsToRetry:
        updateOfferWithCancelledBookingsToRetryAction,

      // member
      fetchMember: fetchMemberAction,
      createMember: createOrUpdateMember,
      refreshFilteredMembers: refreshFilteredMembersAction,
      fetchFilteredMembers: fetchFilteredMembersAction,
      fetchMemberBulkById: fetchMemberBulkByIdAction,
      searchMembers: (txt) => searchMembersAction(txt, { hide_archived: true }),

      // invoice actions
      revertQuickInvoice: revertQuickInvoiceAction,
      createQuickInvoice: createQuickInvoiceAction,
      fetchInvoiceItemList: fetchInvoiceItemListAction,
      createOrUpdateInvoice: createOrUpdateInvoiceAction,
      fetchRoomBlueprintDetail: fetchRoomBlueprintDetailAction,
      fetchAssetForBlueprint: fetchAssetForBlueprintAction,
      fetchOfferStatus: fetchOfferStatusAction,
      fetchOfferStatusList: fetchOfferStatusListAction,
      fetchOfferBulk: fetchOfferBulkAction,
      postRollCall: postRollCallAction,
      fetchInvoice,
      fetchInvoiceList: fetchInvoiceListAction,
      applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
      resetInvoiceList: resetInvoiceListAction,
      fetchInvoiceConfiguration: fetchInvoiceConfigurationAction,
      // giftcard actions

      fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
      fetchGiftcardBulk: fetchGiftcardBulkAction,
      fetchGiftcardList: fetchGiftcardListAction,
      // move
      goToCalendar: (date) =>
        replaceRouter(`/calendar/${date.year}/${date.month}/${date.day}`),
      goToOffer: (id) => replaceRouter(`/offer/${id}`),
      push: routerPush,
      goToMember: (id) => routerPush(`/member/${id}/`),
      setSpotForBooking: setSpotForBookingAction,
      fetchVideoPurchase,
      fetchSignFormUpConfiguration,

      fetchMemberProgram: fetchMemberProgramAction,
      fetchProgram: fetchProgramAction,
      fetchMetric: fetchMetricAction,

      updateMemberMetricValue: updateMemberMetricValueAction,
      createMemberProgram: createMemberProgramAction,

      fetchGroupOffer: fetchGroupOfferAction,
      fetchSimilarFuturBookingInGroup: fetchSimilarFuturBookingInGroupAction,

      fetchLevelList: fetchLevelListAction,
      fetchAssociatedCoachesList,

      fetchSpotForBlueprint: fetchSpotForBlueprintAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,

      // waitinglist
      fetchCompanyWaitlistConfiguration:
        fetchCompanyWaitlistConfigurationAction,

      fetchAllWaitingListPositions: fetchAllWaitingListPositionsAction,

      // PaymentGroup
      submitInternalPaymentInBackground:
        submitInternalPaymentInBackgroundAction,

      fetchAllEstablishmentBillingGroup:
        fetchAllEstablishmentBillingGroupAction,
      updateInternalNote: updateInternalNoteAction,
    },
  ),
  withHandlers({
    createMemberProgram:
      ({ programList, createMemberProgram, fetchMetric }) =>
      (data) => {
        createMemberProgram(data, {
          onSuccess: (memberProgram) => {
            const program = programList?.find(
              (p) => p.id === memberProgram?.program,
            );
            fetchMetric({ id__in: program?.metric_list });
          },
        });
      },
    fetchPerformanceTrackingData:
      ({ fetchMemberProgram, fetchProgram, fetchMetric }) =>
      (member) => {
        fetchMemberProgram(
          {
            member,
          },
          {
            onSuccess: (data) => {
              const programsToFetch = uniq(
                data.results.map((memberProgram) => memberProgram?.program),
              );
              fetchProgram(
                { is_disabled: false, id__in: programsToFetch },
                {
                  onSuccess: (programData) => {
                    const metricToFetch = programData.reduce(
                      (acc, program) => acc.concat(program?.metric_list),
                      [],
                    );

                    if (metricToFetch?.length) {
                      fetchMetric({ id__in: metricToFetch });
                    }
                  },
                },
              );
            },
          },
        );
      },
    fetchBookingOptionByOffer:
      ({ fetchBookingOptionByOffer }) =>
      (offerId) => {
        return fetchBookingOptionByOffer(offerId, { show_cancelled: true });
      },
    fetchInvoiceListUnpaid:
      ({ fetchInvoiceList, bookings }) =>
      (params, options) => {
        if (!bookings || bookings.length === 0) return;
        const uniqMemberIds = uniq(bookings.map((b) => b.member)).filter(
          (id) => !!id,
        );
        if (uniqMemberIds.length === 0) return;
        fetchInvoiceList(
          {
            is_v2: true,
            is_draft: false,
            unpaid: true,
            ...(params || {}),
            member__in: uniqMemberIds,
          },
          options,
        );
      },
    fetchConsumerGiftcardList:
      ({ fetchConsumerGiftcardList, fetchGiftcardBulk, fetchMemberBulkById }) =>
      (memberIdsList, options?: OptionCallback) => {
        fetchConsumerGiftcardList(
          {
            page: 1,
            page_size: 100,
            active: true,
            reverted: false,
            member_id__in: memberIdsList,
            in_timeframe: true,
          },
          {
            onSuccess: (consumerGiftcardList: Array<ConsumerGiftcard>) => {
              fetchGiftcardBulk(consumerGiftcardList.map((cg) => cg.giftcard));
              fetchMemberBulkById([
                ...consumerGiftcardList.map((cg) => cg.src_member),
                ...consumerGiftcardList.map((cg) => cg.dst_member),
              ]);
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: () => {
              if (options && options.onError) options.onError();
            },
          },
        );
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
        retrieveConsumerPackBulkBatched,
        id,
        fetchPaymentPackBulk,
      }) =>
      (
        ordering_field,
        options: { members: OptionCallback<MemberMinimal[]> },
      ) => {
        refreshBookingsByOffer(
          id,
          {
            onSuccess: (bookings) => {
              fetchFilteredMembers(
                { offer: id, withNotes: true },
                {
                  onSuccess: (memberList: MemberMinimal[]) => {
                    if (
                      options &&
                      options.members &&
                      options.members.onSuccess
                    ) {
                      options.members.onSuccess(memberList);
                    }
                  },
                },
              );
              retrieveConsumerPackBulkBatched(
                bookings.map((b) => b.consumer_payment_pack),
                {
                  onSuccess: (cppList) =>
                    fetchPaymentPackBulk(
                      cppList.map((cpp) => cpp.payment_pack),
                    ),
                },
              );
            },
          },
          ordering_field,
        );
      },
  }),

  withHandlers({
    addBooking:
      ({
        refresh,
        registerBooking,
        fetchOfferStatus,
        fetchOffer,
        fetchOfferBulk,
        fetchOfferStatusList,
        offerId,
      }) =>
      (consumerPaymentPackId, data, ordering_field) => {
        const refreshOfferAndBookings = () => {
          fetchOffer(offerId);
          fetchOfferStatus(offerId);
          refresh(ordering_field);
          if (Array.isArray(data.offer)) {
            fetchOfferBulk(data.offer);
            fetchOfferStatusList(data.offer);
          }
        };
        registerBooking(consumerPaymentPackId, data, {
          onSuccess: refreshOfferAndBookings,
          onError: refreshOfferAndBookings,
        });
      },
    deleteBooking:
      ({ refresh, cancelBooking, fetchOfferStatus, fetchOffer, id }) =>
      (bookingId, ordering_field, options, data) => {
        cancelBooking(bookingId, data || {}, {
          onSuccess: () => {
            fetchOffer(id);
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
        retrieveConsumerPackBulkBatched,
        fetchFilteredMembers,
        fetchMemberBulkById,
        offerId,
        fetchInvoiceListUnpaid,
        fetchRoomBlueprintDetail,
        fetchAssetForBlueprint,
        fetchOfferStatus,
        fetchConsumerGiftcardList,
        fetchGroupOffer,
        fetchPaymentPackBulk,
        fetchAllWaitingListPositions,
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
            if (offer.group) {
              fetchGroupOffer(offer.group);
            }
          },
        });
        fetchOfferStatus(offerId);
        fetchBookingsByOffer(
          offerId,
          {
            onSuccess: (bookings) => {
              retrieveConsumerPackBulkBatched(
                bookings.map((b) => b.consumer_payment_pack),
                {
                  onSuccess: (cppList) => {
                    fetchPaymentPackBulk(
                      cppList.map((cpp) => cpp.payment_pack),
                    );
                  },
                },
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
                fetchConsumerGiftcardList(memberList.map((m) => m.id));
              }
            },
          },
        );
        fetchBookingOptionByOffer(offerId);
        fetchAllWaitingListPositions(offerId);
        fetchRecurrenceRuleBooking(
          { offer: offerId, page: 1, page_size: RECURRENT_BOOKING_PAGE_SIZE },
          {
            onSuccess: (recurrenceRuleList) => {
              if (recurrenceRuleList.length) {
                fetchMemberBulkById(recurrenceRuleList.map((nr) => nr.member));
              }
            },
          },
        );
      },
    switchWaitingListFreeze:
      ({
        toggleWaitingListFreeze,
        fetchOffer,
        fetchBookingOptionByOffer,
        fetchAllWaitingListPositions,
      }) =>
      (offerId, newFreezeState) => {
        toggleWaitingListFreeze(offerId, newFreezeState, {
          onSuccess: () => {
            fetchOffer(offerId);
            fetchBookingOptionByOffer(offerId);
            fetchAllWaitingListPositions(offerId);
          },
        });
      },
    registerToWaitingList:
      ({
        registerToWaitingListAction,
        refreshFilteredMembers,
        fetchAllWaitingListPositions,
      }) =>
      (offerId, memberId) => {
        registerToWaitingListAction(offerId, memberId, {
          onSuccess: () => {
            refreshFilteredMembers({ offer: offerId });
            fetchAllWaitingListPositions(offerId);
          },
        });
      },
    discardOption:
      ({ discardBookingOptionAction, fetchAllWaitingListPositions }) =>
      (bookingOptionId, params, options, offerId) => {
        discardBookingOptionAction(bookingOptionId, params, {
          onSuccess: () => {
            options?.onSuccess?.();
            fetchAllWaitingListPositions(offerId);
          },
          onError: options?.onError,
        });
      },
    createQuickUnevenInvoice:
      ({
        createQuickInvoice,
        fetchInvoiceItemList,
        refresh,
        fetchInvoiceListUnpaid,
        id,
        fetchOfferStatus,
        fetchOffer,
      }) =>
      (data) => {
        createQuickInvoice(data, {
          onSuccess: (invoice) => {
            fetchOffer(id, {
              onSuccess: () => {
                fetchOfferStatus(
                  id,
                  {}, // Empty parameters
                  {
                    onSuccess: () => {
                      refresh(null, {
                        members: {
                          onSuccess: (memberList: MemberMinimal[]) => {
                            if (memberList && memberList.length) {
                              fetchInvoiceListUnpaid(
                                {
                                  member__in: memberList.map((m) => m.id),
                                },
                                {
                                  onSuccess: () => {
                                    fetchInvoiceItemList({
                                      invoice__uuid: invoice.uuid,
                                      page_size: 10,
                                    });
                                  },
                                },
                              );
                            }
                          },
                        },
                      });
                    },
                  },
                );
              },
            });
          },
          onError: () => {
            fetchOffer(id);
            fetchOfferStatus(id);
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
                    if (bookingList?.length) {
                      fetchInvoiceListUnpaid({
                        member__in: bookingList.map((b) => b.member),
                      });
                    }
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
    applyGiftcardOnInvoice:
      ({
        applyGiftcardOnInvoice,
        fetchInvoiceListUnpaid,
        fetchConsumerGiftcardList,
        bookings,
      }) =>
      (
        invoice_uuid: string,
        consumerGiftCardId: number,
        amount: number,
        options?: OptionCallback,
      ) => {
        applyGiftcardOnInvoice(invoice_uuid, consumerGiftCardId, amount, {
          onSuccess: () => {
            const member_ids = bookings?.map((b) => b.member);
            if (member_ids && member_ids.length !== 0) {
              fetchInvoiceListUnpaid({
                member__in: member_ids,
              });
              fetchConsumerGiftcardList(member_ids);
            }
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),

  withTitle(
    ({ offer, offerLoading }: { offer: Offer, offerLoading: boolean }) =>
      formatTitle(offer, offerLoading),
  ),
)(OfferManagementComponent);
