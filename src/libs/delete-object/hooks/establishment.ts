import type { RootState } from '#src/reducers';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DeleteObjectStatus } from '../constants';

import type { WarningMessagesHook } from '.';

export const useDeleteEstablishmentWarningMessages: WarningMessagesHook =
  () => {
    const { t } = useTranslation('establishment');

    const { canDestroy, checkData } = useSelector(
      (state: RootState) => state.deleteObject.establishment,
    );

    let warningMessages: string[] = [];
    let errorMessages: string[] = [];
    let infoMessages: string[] = [];

    infoMessages.push(t('deleteObject.infos.reportsDefault'));
    infoMessages.push(t('deleteObject.infos.widgetsDefault'));

    if (!checkData) {
      return {
        warningMessages,
        errorMessages,
        infoMessages,
        deleteObjectStatus: null,
      };
    }

    // ------- UPCOMING OFFERS & APPOINTMENTS -------

    if (checkData.has_upcoming_offers) {
      errorMessages.push(t('deleteObject.errors.hasUpcomingOffers'));
    } else {
      infoMessages.push(t('deleteObject.infos.offersDefault'));
    }

    if (checkData.has_upcoming_private_bookings) {
      errorMessages.push(t('deleteObject.errors.hasUpcomingPrivateBookings'));
    } else {
      infoMessages.push(t('deleteObject.infos.privateBookingsDefault'));
    }

    // ------- BILLING GROUPS & ESTABLISHMENT GROUPS -------

    if (checkData.establishment_billing_group.is_exclusive) {
      errorMessages.push(t('deleteObject.errors.hasExclusiveBillingGroup'));
    } else if (
      checkData.establishment_billing_group.establishment_billing_group_name
    ) {
      warningMessages.push(
        t('deleteObject.warnings.hasBillingGroup', {
          establishment_billing_group_name:
            checkData.establishment_billing_group
              .establishment_billing_group_name,
        }),
      );
    }

    if (checkData.establishment_group.exclusive_establishment_groups.length) {
      errorMessages.push(
        t('deleteObject.errors.exclusiveEstablishmentGroups', {
          count:
            checkData.establishment_group.exclusive_establishment_groups.length,
          pass_name:
            checkData.establishment_group.exclusive_establishment_groups
              .map(({ establishment_group_name }) => establishment_group_name)
              .join(', '),
        }),
      );
    }

    // ------- PRIVATE SERVICES --------

    if (checkData.private_service.exclusive_private_services.length) {
      warningMessages.push(
        t('deleteObject.warnings.exclusivePrivateServices', {
          count: checkData.private_service.exclusive_private_services.length,
          private_service_name:
            checkData.private_service.exclusive_private_services
              .map(({ private_service_name }) => private_service_name)
              .join(', '),
        }),
      );
    }

    // ------- PAYMENT PACKS --------

    if (checkData.payment_pack.exclusive_payment_packs.length) {
      errorMessages.push(
        t('deleteObject.errors.exclusivePaymentPacks', {
          count: checkData.payment_pack.exclusive_payment_packs.length,
          pass_name: checkData.payment_pack.exclusive_payment_packs
            .map(({ payment_pack_name }) => payment_pack_name)
            .join(', '),
        }),
      );
    } else if (checkData.payment_pack.related_payment_packs.length) {
      warningMessages.push(
        t('deleteObject.warnings.relatedPaymentPacks', {
          count: checkData.payment_pack.related_payment_packs.length,
          pass_name: checkData.payment_pack.related_payment_packs
            .map(({ payment_pack_name }) => payment_pack_name)
            .join(', '),
        }),
      );
    }

    // ------- STAFF LOCATIONS --------

    if (checkData.staff_location.has_related_staff_configurations) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedStaffConfigurations'),
      );
    } else if (checkData.staff_location.has_exclusive_staff_configurations) {
      warningMessages.push(
        t('deleteObject.errors.hasExclusiveStaffConfigurations'),
      );
    }

    // ------- COACHES & SCHEDULES --------

    if (checkData.coach_availability_slot.exclusive_coaches.length) {
      warningMessages.push(
        t('deleteObject.errors.exclusiveCoachAvailabilitySlots', {
          count: checkData.coach_availability_slot.exclusive_coaches.length,
          coach_name: checkData.coach_availability_slot.exclusive_coaches
            .map(({ coach_name }) => coach_name)
            .join(', '),
        }),
      );
    } else if (
      checkData.coach_availability_slot.has_related_coach_availability_slots
    ) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedCoachAvailabilitySlots'),
      );
    }

    if (checkData.associated_coach.exclusive_coaches.length) {
      warningMessages.push(
        t('deleteObject.errors.exclusiveAssociatedCoaches', {
          count: checkData.associated_coach.exclusive_coaches.length,
          coach_name: checkData.associated_coach.exclusive_coaches
            .map(({ coach_name }) => coach_name)
            .join(', '),
        }),
      );
    } else if (checkData.associated_coach.has_related_associated_coaches) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedAssociatedCoaches'),
      );
    }

    if (checkData.has_related_availability_slots) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedAvailabilitySlots'),
      );
    }

    // ------- MARKETPLACE COMPONENT CONFIGS --------

    if (
      checkData.marketplace_component_config
        .has_exclusive_marketplace_component_configs
    ) {
      errorMessages.push(
        t('deleteObject.errors.hasExclusiveMarketplaceComponentConfigs'),
      );
    } else if (
      checkData.marketplace_component_config
        .has_related_marketplace_component_configs
    ) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedMarketplaceComponentConfigs'),
      );
    }

    // ------- OTHERS --------

    if (checkData.has_related_zoom_establishment) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedZoomEstablishment'),
      );
    }

    if (checkData.is_integrated_in_partnership) {
      errorMessages.push(t('deleteObject.errors.isIntegratedInPartnership'));
    }

    if (checkData.has_related_marketing_notifications) {
      warningMessages.push(
        t('deleteObject.warnings.hasRelatedMarketingNotifications'),
      );
    }

    let deleteObjectStatus;
    if (!canDestroy) {
      deleteObjectStatus = DeleteObjectStatus.ERROR;
    } else if (warningMessages?.length) {
      deleteObjectStatus = DeleteObjectStatus.WARNING;
    } else {
      deleteObjectStatus = DeleteObjectStatus.INFO;
    }

    return { warningMessages, errorMessages, infoMessages, deleteObjectStatus };
  };
