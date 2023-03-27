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
  resetQuickInvoices,
  resetInvoiceList as resetInvoiceListAction,
  fetchSpecificInvoice as fetchInvoice,
  fetchInvoiceList as fetchInvoiceListAction,
  applyGiftcardOnInvoice as applyGiftcardOnInvoiceAction,
} from '#libs/invoice/actions';
import {
  fetchOfferById as fetchOfferByIdAction,
  toggleWaitingListFreeze as toggleWaitingListFreezeAction,
  fetchOfferStatus as fetchOfferStatusAction,
} from '#libs/offer/actions';
import { getDetailedOffer, withSpecificCoach } from '#libs/offer/selectors';
import { getStripeReaders } from '#libs/terminal/selectors';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { sendCommunication } from '#libs/communication/actions';
import { fetchCompanyUserRoles } from '#libs/role/actions';
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
  fetchSimilarFuturBookingInGroup as fetchSimilarFuturBookingInGroupAction,
} from '#libs/booking/actions';
import {
  fetchSpotForBlueprint as fetchSpotForBlueprintAction,
  fetchAssetForBlueprint as fetchAssetForBlueprintAction,
  fetchRoomBlueprintDetail as fetchRoomBlueprintDetailAction,
} from '#libs/spot-scheduling/actions';
import { fetchStripeReaders } from '#libs/terminal/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';

import {
  getSpotTypesOfCompany,
  getAssetByBlueprintByIdentifierFromState,
} from '#libs/spot-scheduling/selector';

import {
  discardBookingOption as discardBookingOptionAction,
  registerToWaitingList as registerToWaitingListAction_,
  fetchByOffer as fetchBookingOptionByOfferAction,
} from '#libs/waiting-list/actions';
import {
  getOfferBookingListWithConsumerPack,
  getRecurrenceRuleBookingList,
  withStaffModificationHistory,
} from '#libs/booking/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';

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
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#libs/payment-packs/actions';

import {
  fetchFilteredMembers as fetchFilteredMembersAction,
  fetchMemberBulkById as fetchMemberBulkByIdAction,
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
  withMemberProgram,
} from '#libs/member/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#libs/group-offer/actions';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';
import { getGroupListCount, withGroup } from '#libs/group-offer/selectors';

import {
  withInvoiceItem,
  getBuyableItem,
  getAllQuickCreatedInvoices,
  getUnpaidInvoiceListWithInvoiceItemAndMembers,
} from '#libs/invoice/selectors';

import withTitle from '#hocs/with-title.hoc';
import OfferManagementComponent from './OfferManagement.component';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';
import type { Offer } from '../../api/types';
import { RootState } from '../../reducers';
import { Booking } from '#libs/booking/types';
import { fetchSignFormUpConfiguration } from '#libs/sign-up-form/actions';
import { getSignUpFormConfigurationDict } from '#libs/sign-up-form/selectors';
import {
  fetchMemberProgram as fetchMemberProgramAction,
  fetchProgram as fetchProgramAction,
  fetchMetric as fetchMetricAction,
  updateMemberMetricValue as updateMemberMetricValueAction,
  createMemberProgram as createMemberProgramAction,
} from '#libs/performance-tracking/actions';
import { showVaccinationStatus } from '#libs/custom-form/selectors';
import { fetchVideoPurchase } from '#libs/video/actions';
import {
  getProgramList,
  getMemberProgramIdsList,
} from '#libs/performance-tracking/selector';
import {
  fetchConsumerGiftcardList as fetchConsumerGiftcardListAction,
  fetchGiftcardBulk as fetchGiftcardBulkAction,
} from '#libs/giftcard/actions';
import {
  getConsumerGiftcardList,
  withGiftcard,
  withSender,
  withReceiver,
  onlyUsable,
} from '#libs/giftcard/selectors';

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
      offer: withCustomLevel(withGroup(withSpecificCoach(getDetailedOffer)))(
        state,
      ),
      offerLoading: state.offer.retrieve.loading,
      // member
      membersloading: state.member.loading,
      members: withMemberProgram(withTags(getAllMembers))(state),
      memberDetails: getMemberDetailData(state),
      memberHistory: getMemberHistory(state),
      memberSearchLoading: state.member.search.loading,
      searchedMembers: getSearchedMembers(state),
      memberCreationPending: state.member.upsert.loading,
      memberCreationErrors: state.member.upsert.error,
      country: state.theme.theme.locale.split('_')[1],

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

      email_templates_details: getEmailTemplatesDetail(state),
      resolvedGenericTags: getResolvedGenericTags(state),

      establishmentList: getAvailableEstablishmentList(state),
      // invoice
      unpaidInvoiceList: getUnpaidInvoiceListWithInvoiceItemAndMembers(state),
      quickCreatedInvoices: withInvoiceItem(getAllQuickCreatedInvoices)(state),

      // buyable stuff
      availableBuyableItems: getBuyableItem(state),
      // theme
      company_theme: themeSelectors.getTheme(state),
      payment_method_available_manager:
        state.theme.theme.payment_method_available_manager,
      roomBlueprintById: state.spotScheduling.roomBlueprint.byId,
      assetsForBlueprintById: getAssetByBlueprintByIdentifierFromState(state),
      offerStatusById: state.offer.offerStatus.byId,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      companyId: state.theme.theme.company,
      showVaccinationStatus: showVaccinationStatus(state),
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
    }),
    {
      fetchOffer: fetchOfferByIdAction,
      snackbarSuccess: snackbar.success,

      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail: emailTemplateDetail,
      fetchResolvedGenericTags: fetchResolvedGenericTagsAction,

      fetchEstablishmentList: fetchEstablishments,

      toggleWaitingListFreeze: toggleWaitingListFreezeAction,
      registerToWaitingListAction: registerToWaitingListAction_,
      discardOption: discardBookingOptionAction,
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
      fetchMemberBulkById: fetchMemberBulkByIdAction,
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
      fetchInvoice,
      fetchInvoiceList: fetchInvoiceListAction,
      applyGiftcardOnInvoice: applyGiftcardOnInvoiceAction,
      resetInvoiceList: resetInvoiceListAction,
      // giftcard actions

      fetchConsumerGiftcardList: fetchConsumerGiftcardListAction,
      fetchGiftcardBulk: fetchGiftcardBulkAction,
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
      (params) => {
        if (!bookings || bookings.length === 0) return;
        const uniqMemberIds = uniq(bookings.map((b) => b.member)).filter(
          (id) => !!id,
        );
        if (uniqMemberIds.length === 0) return;
        fetchInvoiceList({
          is_v2: true,
          is_draft: false,
          unpaid: true,
          ...(params || {}),
          member__in: uniqMemberIds,
        });
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
        id,
        fetchPaymentPackBulk,
      }) =>
      (ordering_field) => {
        refreshBookingsByOffer(
          id,
          {
            onSuccess: (bookings) => {
              retrieveConsumerPackBulk(
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

        fetchFilteredMembers({ offer: id, withNotes: true });
      },
  }),

  withHandlers({
    addBooking:
      ({ refresh, registerBooking, fetchOfferStatus, fetchOffer }) =>
      (consumerPaymentPackId, data, ordering_field) => {
        const refreshOfferAndBookings = () => {
          fetchOffer(data.offer);
          fetchOfferStatus(data.offer);
          refresh(ordering_field);
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
        fetchResolvedGenericTags,
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
              retrieveConsumerPackBulk(
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
        fetchResolvedGenericTags();
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
      ({ applyGiftcardOnInvoice, fetchInvoiceListUnpaid, bookings }) =>
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
