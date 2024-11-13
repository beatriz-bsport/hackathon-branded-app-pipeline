import { BridgeWidgetActions } from '#src/pages/widget/BridgeWidget.page';
import { bridgeAPIActionsRegistry } from './actionsRegistry';

const actionsBinder = (actions: BridgeWidgetActions) => {
  // MEMBERSHIP
  bridgeAPIActionsRegistry.register(
    'MEMBERSHIP_BY_COMPANY',
    actions.fetchMembershipByCompany,
  );

  // MEMBER
  bridgeAPIActionsRegistry.register('FETCH_MEMBER_BY_ID', actions.fetchMember);
  bridgeAPIActionsRegistry.register(
    'RETRIEVE_MY_USER_PROFILE',
    actions.fetchMyUserProfile,
  );

  // REFERRAL
  bridgeAPIActionsRegistry.register(
    'FETCH_REFERRAL_PROGRAM_MEMBER_STATUS',
    actions.retrieveReferralMemberStatus,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_REFERRAL_PROGRAM_BY_COMPANY',
    actions.retrieveReferralProgramForCompany,
  );

  // CONSUMER BOOKING
  bridgeAPIActionsRegistry.register(
    'FETCH_PAST_BOOKING_AS_MEMBER',
    actions.fetchMyPastBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_BOOKING_AS_MEMBER',
    actions.fetchMyFutureBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_BOOKING_OPTION_AS_MEMBER',
    actions.fetchMyBookingOptionAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_BOOKING_OPTION_WORKSHOP_AS_MEMBER',
    actions.fetchMyBookingOptionWorkshopAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_PAST_PRIVATE_BOOKING_AS_MEMBER',
    actions.fetchMyPastPrivateBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_PRIVATE_BOOKING_AS_MEMBER',
    actions.fetchMyFuturePrivateBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_PAST_BOOKING_WORKSHOP_AS_MEMBER',
    actions.fetchMyPastBookingWorkshopAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_BOOKING_WORKSHOP_AS_MEMBER',
    actions.fetchMyFutureBookingWorkshopAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'CANCEL_BOOKING_AS_MEMBER',
    actions.cancelBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'CANCEL_PRIVATE_BOOKING_AS_MEMBER',
    actions.cancelPrivateBookingAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'CANCEL_BOOKING_OPTION_AS_MEMBER',
    actions.cancelBookingOptionAsMember,
  );

  // CONSUMER INVOICES
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_INVOICES_COMPLEMENTARY',
    actions.fetchConsumerInvoicesComplementary,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_PAID_INVOICES',
    actions.fetchConsumerPaidInvoices,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_REFUNDED_INVOICES',
    actions.fetchConsumerRefundedInvoices,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_UNPAID_INVOICES',
    actions.fetchConsumerUnpaidInvoices,
  );

  // CONSUMER SUBSCRIPTIONS
  bridgeAPIActionsRegistry.register(
    'FETCH_MY_FUTURE_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyFutureSubscriptionsAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_MY_EXPIRED_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyExpiredSubscriptionsAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_MY_ACTIVE_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyActiveSubscriptionsAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_SUBSCRIPTION_INVOICES_DETAILS',
    actions.fetchConsumerSubscriptionInvoicesDetails,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_MY_SUBSCRIPTION_AS_MEMBER',
    actions.fetchMySubscriptionAsMember,
  );

  // CONSUMER SPACE
  bridgeAPIActionsRegistry.register(
    'RESET_CONSUMER_STATE',
    actions.resetConsumerState,
  );

  // PAYMENT
  bridgeAPIActionsRegistry.register(
    'FETCH_PAYMENT_METHOD_LIST',
    actions.fetchPaymentMethodList,
  );
  bridgeAPIActionsRegistry.register(
    'DETACH_PAYMENT_METHOD',
    // @ts-expect-error
    actions.detachPaymentMethod,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_PAYMENT_GROUP_STATUS',
    actions.fetchPaymentGroupStatus,
  );
  bridgeAPIActionsRegistry.register(
    'SET_PAYMENT_STATUS',
    actions.setPaymentStatus,
  );
  bridgeAPIActionsRegistry.register(
    'SET_BACKEND_PROCESSING_AFTER_PAYMENT',
    actions.setBackendProcessingAfterPayment,
  );
  bridgeAPIActionsRegistry.register(
    'REQUEST_SETUP_INTENT_SECRET',
    actions.requestSetupIntentSecret,
  );

  // INVOICE
  bridgeAPIActionsRegistry.register(
    'FETCH_INVOICE_LIST',
    actions.fetchInvoiceList,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_SPECIFIC_INVOICE',
    actions.fetchSpecificInvoice,
  );
  bridgeAPIActionsRegistry.register(
    'APPLY_BALANCE_TO_INVOICE',
    actions.applyBalanceToInvoice,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_INVOICE_CONFIGURATION_AS_MEMBER',
    actions.fetchInvoiceConfigurationAsMember,
  );
  bridgeAPIActionsRegistry.register(
    'GET_INVOICE_RECEIPT_URL',
    actions.getReceiptUrl,
  );

  // COACH
  bridgeAPIActionsRegistry.register('FETCH_COACH_BULK', actions.fetchCoachBulk);

  // GROUP OFFER
  bridgeAPIActionsRegistry.register(
    'FETCH_GROUP_OFFER',
    actions.fetchGroupOffer,
  );

  // LEVEL
  bridgeAPIActionsRegistry.register('FETCH_LEVEL_LIST', actions.fetchLevelList);

  // META-ACTIVITY
  bridgeAPIActionsRegistry.register(
    'FETCH_META_ACTIVITY_BULK',
    actions.fetchMetaActivityBulk,
  );

  // OFFER
  bridgeAPIActionsRegistry.register('FETCH_OFFER_BULK', actions.fetchOfferBulk);

  // ESTABLISHMENT
  bridgeAPIActionsRegistry.register(
    'FETCH_ESTABLISHMENT_BULK',
    actions.fetchEstablishmentBulk,
  );

  // CONSUMER PACK
  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_PACK_BULK',
    actions.retrieveConsumerPackBulk,
  );

  // CUSTOM FORM
  bridgeAPIActionsRegistry.register(
    'FETCH_COMPANY_CUSTOM_MEMBER_FORM',
    actions.fetchCompanyCustomMemberForm,
  );
  bridgeAPIActionsRegistry.register(
    'SUBMIT_CUSTOM_FORM',
    actions.submitCustomForm,
  );

  // PAYMENT PACK
  bridgeAPIActionsRegistry.register(
    'FETCH_PAYMENT_PACK_BULK',
    actions.fetchPaymentPackBulk,
  );
  bridgeAPIActionsRegistry.register(
    'FETCH_ROOM_BLUE_PRINT',
    actions.fetchRoomBlueprints,
  );

  // SPOT-SCHEDULING
  bridgeAPIActionsRegistry.register(
    'FETCH_SPOT_FOR_BLUEPRINT',
    actions.fetchSpotForBlueprint,
  );
  bridgeAPIActionsRegistry.register(
    'ASSETS_FOR_BLUE_PRINT',
    actions.fetchAssetForBlueprint,
  );

  // SUBSCRIPTION
  bridgeAPIActionsRegistry.register(
    'DOWNLOAD_PDF_CONTRACT_TERMS_FOR_BILLING_PLAN',
    actions.downloadPDFContractTermsForBillingPlan,
  );
  bridgeAPIActionsRegistry.register(
    'SWITCH_SUBSCRIPTION_PAYMENT_METHOD',
    actions.switchSubscriptionPaymentMethod,
  );

  // PRIVATE SERVICE
  bridgeAPIActionsRegistry.register(
    'PRIVATE_CONSUMER_PASS_BULK',
    actions.fetchPrivateConsumerPassBulk,
  );
  bridgeAPIActionsRegistry.register(
    'PRIVATE_SLOT_BULK',
    actions.fetchPrivateSlotBulk,
  );
  bridgeAPIActionsRegistry.register(
    'PRIVATE_SERVICE_BULK',
    actions.fetchPrivateServiceBulk,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_PASSES_TABS',
    actions.fetchConsumerPassesTabDisplay,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_ACTIVE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyActiveConsumerPaymentPacksAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_ACTIVE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyActivePrivateConsumerPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_ACTIVE_UNIVERSAL_PASSES_AS_MEMBER',
    actions.fetchMyActiveUniversalPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_EXPIRED_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyExpiredConsumerPaymentPacksAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_EXPIRED_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyExpiredPrivateConsumerPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_EXPIRED_UNIVERSAL_PASS_AS_MEMBER',
    actions.fetchMyExpiredUniversalPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyFutureConsumerPaymentPacksAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyFuturePrivateConsumerPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_FUTURE_UNIVERSAL_PASS_AS_MEMBER',
    actions.fetchMyFutureUniversalPassesAsMember,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_RELATED_MEMBERS_NAMES_BY_CONSUMER_PAYMENT_PACK_LINK',
    actions.fetchRelatedMembersNamesByPrivateConsumerPassLinks,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_RELATED_MEMBERS_NAMES_BY_PRIVATE_CONSUMER_PASS_LINK',
    actions.fetchRelatedMembersNamesByPrivateConsumerPassLinks,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_PRIVATE_PASS_BULK',
    actions.fetchPrivatePassBulk,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_PRIVATE_SERVICE_COMPATIBLE_PASS_LIST',
    actions.fetchPrivateServiceCompatiblePassList,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_COMPANY_WAITLIST_CONFIGURATION',
    actions.fetchCompanyWaitlistConfiguration,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_CONSUMER_GUEST_NUMBER_ELIGIBLE_LEFT_BY_OFFER_BULK',
    actions.fetchConsumerGuestNumberEligibleLeftByOfferBulk,
  );

  bridgeAPIActionsRegistry.register(
    'FETCH_BOOKING_POSITION_AS_MEMBER_BY_OFFER_IDS',
    actions.fetchMyBookingOptionsPositionAsMemberByOfferIds,
  );
};

export default actionsBinder;
