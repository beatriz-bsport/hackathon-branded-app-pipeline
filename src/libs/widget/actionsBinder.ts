import { BridgeWidgetActions } from '#pages/widget/BridgeWidget.page';
import { bridgeAPIActionsRegistry } from './actionsRegistry';


const actionsBinder = (actions: BridgeWidgetActions) => {
  // MEMBERSHIP
  bridgeAPIActionsRegistry.register(
    'MEMBERSHIP_BY_COMPANY',
    actions.fetchMembershipByCompany,
  );

  // MEMBER
  bridgeAPIActionsRegistry.register('FETCH_MEMBER_BY_ID', actions.fetchMember);

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
};

export default actionsBinder;
