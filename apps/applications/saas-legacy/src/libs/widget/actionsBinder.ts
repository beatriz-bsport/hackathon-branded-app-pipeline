import { BridgeWidgetActions } from '#src/pages/widget/BridgeWidget.page';
import { bridgeAPIActionsRegistry } from './actionsRegistry';
import type { WidgetApiMessageType } from './types';
import { captureException } from '@sentry/react';

const actionsBinder = (actions: BridgeWidgetActions) => {
  const localKeys = new Set<WidgetApiMessageType>();

  const safeRegister = (key: WidgetApiMessageType, value: any) => {
    if (localKeys.has(key)) {
      const error = new Error(
        `Duplicate key "${key}" detected in a single actionsBinder flow`,
      );
      // Don't break the flow
      captureException(error);
    } else {
      localKeys.add(key);
      bridgeAPIActionsRegistry.register(key, value);
    }
  };

  // MEMBERSHIP
  safeRegister('MEMBERSHIP_BY_COMPANY', actions.fetchMembershipByCompany);

  // MEMBER
  safeRegister('FETCH_MEMBER_BY_ID', actions.fetchMember);
  safeRegister('RETRIEVE_MY_USER_PROFILE', actions.fetchMyUserProfile);

  // REFERRAL
  safeRegister(
    'FETCH_REFERRAL_PROGRAM_MEMBER_STATUS',
    actions.retrieveReferralMemberStatus,
  );
  safeRegister(
    'FETCH_REFERRAL_PROGRAM_BY_COMPANY',
    actions.retrieveReferralProgramForCompany,
  );

  // CONSUMER BOOKING
  safeRegister(
    'FETCH_PAST_BOOKING_AS_MEMBER',
    actions.fetchMyPastBookingAsMember,
  );
  safeRegister(
    'FETCH_FUTURE_BOOKING_AS_MEMBER',
    actions.fetchMyFutureBookingAsMember,
  );
  safeRegister(
    'FETCH_BOOKING_OPTION_AS_MEMBER',
    actions.fetchMyBookingOptionAsMember,
  );
  safeRegister(
    'FETCH_BOOKING_OPTION_WORKSHOP_AS_MEMBER',
    actions.fetchMyBookingOptionWorkshopAsMember,
  );
  safeRegister(
    'FETCH_PAST_PRIVATE_BOOKING_AS_MEMBER',
    actions.fetchMyPastPrivateBookingAsMember,
  );
  safeRegister(
    'FETCH_FUTURE_PRIVATE_BOOKING_AS_MEMBER',
    actions.fetchMyFuturePrivateBookingAsMember,
  );
  safeRegister(
    'FETCH_PAST_BOOKING_WORKSHOP_AS_MEMBER',
    actions.fetchMyPastBookingWorkshopAsMember,
  );
  safeRegister(
    'FETCH_FUTURE_BOOKING_WORKSHOP_AS_MEMBER',
    actions.fetchMyFutureBookingWorkshopAsMember,
  );
  safeRegister('CANCEL_BOOKING_AS_MEMBER', actions.cancelBookingAsMember);
  safeRegister(
    'CANCEL_PRIVATE_BOOKING_AS_MEMBER',
    actions.cancelPrivateBookingAsMember,
  );
  safeRegister(
    'CANCEL_BOOKING_OPTION_AS_MEMBER',
    actions.cancelBookingOptionAsMember,
  );

  // CONSUMER INVOICES
  safeRegister(
    'FETCH_CONSUMER_INVOICES_COMPLEMENTARY',
    actions.fetchConsumerInvoicesComplementary,
  );
  safeRegister(
    'FETCH_CONSUMER_PAID_INVOICES',
    actions.fetchConsumerPaidInvoices,
  );
  safeRegister(
    'FETCH_CONSUMER_REFUNDED_INVOICES',
    actions.fetchConsumerRefundedInvoices,
  );
  safeRegister(
    'FETCH_CONSUMER_UNPAID_INVOICES',
    actions.fetchConsumerUnpaidInvoices,
  );

  // CONSUMER SUBSCRIPTIONS
  safeRegister(
    'FETCH_MY_FUTURE_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyFutureSubscriptionsAsMember,
  );
  safeRegister(
    'FETCH_MY_EXPIRED_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyExpiredSubscriptionsAsMember,
  );
  safeRegister(
    'FETCH_MY_ACTIVE_SUBSCRIPTIONS_AS_MEMBER',
    actions.fetchMyActiveSubscriptionsAsMember,
  );
  safeRegister(
    'FETCH_CONSUMER_SUBSCRIPTION_INVOICES_DETAILS',
    actions.fetchConsumerSubscriptionInvoicesDetails,
  );
  safeRegister(
    'FETCH_MY_SUBSCRIPTION_AS_MEMBER',
    actions.fetchMySubscriptionAsMember,
  );

  // CONSUMER SPACE
  safeRegister('RESET_CONSUMER_STATE', actions.resetConsumerState);

  // PAYMENT
  safeRegister('FETCH_PAYMENT_METHOD_LIST', actions.fetchPaymentMethodList);
  safeRegister('DETACH_PAYMENT_METHOD', actions.detachPaymentMethod);
  safeRegister('FETCH_PAYMENT_GROUP_STATUS', actions.fetchPaymentGroupStatus);
  safeRegister('SET_PAYMENT_STATUS', actions.setPaymentStatus);
  safeRegister(
    'SET_BACKEND_PROCESSING_AFTER_PAYMENT',
    actions.setBackendProcessingAfterPayment,
  );
  safeRegister('REQUEST_SETUP_INTENT_SECRET', actions.requestSetupIntentSecret);

  // INVOICE
  safeRegister('FETCH_INVOICE_LIST', actions.fetchInvoiceList);
  safeRegister('FETCH_SPECIFIC_INVOICE', actions.fetchSpecificInvoice);
  safeRegister('APPLY_BALANCE_TO_INVOICE', actions.applyBalanceToInvoice);
  safeRegister(
    'FETCH_INVOICE_CONFIGURATION_AS_MEMBER',
    actions.fetchInvoiceConfigurationAsMember,
  );
  safeRegister('GET_INVOICE_RECEIPT_URL', actions.getReceiptUrl);

  // COACH
  safeRegister('FETCH_COACH_BULK', actions.fetchCoachBulk);

  // GROUP OFFER
  safeRegister('FETCH_GROUP_OFFER', actions.fetchGroupOffer);

  // LEVEL
  safeRegister('FETCH_LEVEL_LIST', actions.fetchLevelList);

  // META-ACTIVITY
  safeRegister('FETCH_META_ACTIVITY_BULK', actions.fetchMetaActivityBulk);

  // OFFER
  safeRegister('FETCH_OFFER_BULK', actions.fetchOfferBulk);

  // ESTABLISHMENT
  safeRegister('FETCH_ESTABLISHMENT_BULK', actions.fetchEstablishmentBulk);

  // CONSUMER PACK
  safeRegister('FETCH_CONSUMER_PACK_BULK', actions.retrieveConsumerPackBulk);

  // CUSTOM FORM
  safeRegister(
    'FETCH_COMPANY_CUSTOM_MEMBER_FORM',
    actions.fetchCompanyCustomMemberForm,
  );
  safeRegister('SUBMIT_CUSTOM_FORM', actions.submitCustomForm);

  // PAYMENT PACK
  safeRegister('FETCH_PAYMENT_PACK_BULK', actions.fetchPaymentPackBulk);
  safeRegister('FETCH_ROOM_BLUE_PRINT', actions.fetchRoomBlueprints);

  // SPOT-SCHEDULING
  safeRegister('FETCH_SPOT_FOR_BLUEPRINT', actions.fetchSpotForBlueprint);
  safeRegister('ASSETS_FOR_BLUE_PRINT', actions.fetchAssetForBlueprint);

  // SUBSCRIPTION
  safeRegister(
    'DOWNLOAD_PDF_CONTRACT_TERMS_FOR_BILLING_PLAN',
    actions.downloadPDFContractTermsForBillingPlan,
  );
  safeRegister(
    'SWITCH_SUBSCRIPTION_PAYMENT_METHOD',
    actions.switchSubscriptionPaymentMethod,
  );

  // PRIVATE SERVICE
  safeRegister(
    'PRIVATE_CONSUMER_PASS_BULK',
    actions.fetchPrivateConsumerPassBulk,
  );
  safeRegister('PRIVATE_SLOT_BULK', actions.fetchPrivateSlotBulk);
  safeRegister('PRIVATE_SERVICE_BULK', actions.fetchPrivateServiceBulk);

  safeRegister('FETCH_PASSES_TABS', actions.fetchConsumerPassesTabDisplay);

  safeRegister(
    'FETCH_ACTIVE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyActiveConsumerPaymentPacksAsMember,
  );

  safeRegister(
    'FETCH_ACTIVE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyActivePrivateConsumerPassesAsMember,
  );

  safeRegister(
    'FETCH_ACTIVE_UNIVERSAL_PASSES_AS_MEMBER',
    actions.fetchMyActiveUniversalPassesAsMember,
  );

  safeRegister(
    'FETCH_EXPIRED_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyExpiredConsumerPaymentPacksAsMember,
  );

  safeRegister(
    'FETCH_EXPIRED_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyExpiredPrivateConsumerPassesAsMember,
  );

  safeRegister(
    'FETCH_EXPIRED_UNIVERSAL_PASS_AS_MEMBER',
    actions.fetchMyExpiredUniversalPassesAsMember,
  );

  safeRegister(
    'FETCH_FUTURE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
    actions.fetchMyFutureConsumerPaymentPacksAsMember,
  );

  safeRegister(
    'FETCH_FUTURE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
    actions.fetchMyFuturePrivateConsumerPassesAsMember,
  );

  safeRegister(
    'FETCH_FUTURE_UNIVERSAL_PASS_AS_MEMBER',
    actions.fetchMyFutureUniversalPassesAsMember,
  );

  safeRegister(
    'FETCH_RELATED_MEMBERS_NAMES_BY_CONSUMER_PAYMENT_PACK_LINK',
    actions.fetchRelatedMembersNamesByPrivateConsumerPassLinks,
  );

  safeRegister(
    'FETCH_RELATED_MEMBERS_NAMES_BY_PRIVATE_CONSUMER_PASS_LINK',
    actions.fetchRelatedMembersNamesByPrivateConsumerPassLinks,
  );

  safeRegister('FETCH_PRIVATE_PASS_BULK', actions.fetchPrivatePassBulk);

  safeRegister(
    'FETCH_PRIVATE_SERVICE_COMPATIBLE_PASS_LIST',
    actions.fetchPrivateServiceCompatiblePassList,
  );

  safeRegister(
    'FETCH_COMPANY_WAITLIST_CONFIGURATION',
    actions.fetchCompanyWaitlistConfiguration,
  );

  safeRegister(
    'FETCH_CONSUMER_GUEST_NUMBER_ELIGIBLE_LEFT_BY_OFFER_BULK',
    actions.fetchConsumerGuestNumberEligibleLeftByOfferBulk,
  );

  safeRegister(
    'FETCH_BOOKING_POSITION_AS_MEMBER_BY_OFFER_IDS',
    actions.fetchMyBookingOptionsPositionAsMemberByOfferIds,
  );
};

export default actionsBinder;
