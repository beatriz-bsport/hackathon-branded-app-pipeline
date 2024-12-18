import type { RootState } from '#src/reducers';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DeleteObjectStatus } from '../constants';

import type { WarningMessagesHook } from '.';

export const useDeleteEstablishmentGroupWarningMessages: WarningMessagesHook =
  () => {
    const { t } = useTranslation('establishment');

    const { canDestroy, checkData } = useSelector(
      (state: RootState) => state.deleteObject.establishmentGroup,
    );

    let warningMessages: string[] = [];
    let errorMessages: string[] = [];
    let infoMessages: string[] = [];

    infoMessages.push(
      t('establishmentGroup.deleteObject.infos.reportsDefault'),
    );
    infoMessages.push(
      t('establishmentGroup.deleteObject.infos.widgetsDefault'),
    );

    if (!checkData) {
      return {
        warningMessages,
        errorMessages,
        infoMessages,
        deleteObjectStatus: null,
      };
    }
    // ------- STAFF LOCATIONS --------

    if (checkData.has_related_staff_configurations) {
      warningMessages.push(
        t(
          'establishmentGroup.deleteObject.warnings.hasRelatedStaffConfigurations',
        ),
      );
    }

    // ------- COACHES --------

    if (checkData.associated_coach.exclusive_coaches.length) {
      warningMessages.push(
        t(
          'establishmentGroup.deleteObject.warnings.exclusiveAssociatedCoaches',
          {
            count: checkData.associated_coach.exclusive_coaches.length,
            coach_name: checkData.associated_coach.exclusive_coaches
              .map(({ coach_name }) => coach_name)
              .join(', '),
          },
        ),
      );
    } else if (checkData.associated_coach.has_related_associated_coaches) {
      warningMessages.push(
        t(
          'establishmentGroup.deleteObject.warnings.hasRelatedAssociatedCoaches',
        ),
      );
    }

    // ------- MARKETPLACE COMPONENT CONFIGS --------

    if (
      checkData.marketplace_component_config
        .has_exclusive_marketplace_component_configs
    ) {
      errorMessages.push(
        t(
          'establishmentGroup.deleteObject.errors.hasExclusiveMarketplaceComponentConfigs',
        ),
      );
    } else if (
      checkData.marketplace_component_config
        .has_related_marketplace_component_configs
    ) {
      warningMessages.push(
        t(
          'establishmentGroup.deleteObject.warnings.hasRelatedMarketplaceComponentConfigs',
        ),
      );
    }

    // ------- OTHERS --------

    if (checkData.has_related_marketing_notifications) {
      warningMessages.push(
        t(
          'establishmentGroup.deleteObject.warnings.hasRelatedMarketingNotifications',
        ),
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
