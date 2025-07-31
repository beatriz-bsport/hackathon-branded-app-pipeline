import React from 'react';
import { useTranslation } from 'react-i18next';

import ModalConfirm from '#src/components/ModalConfirm.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type {
  Establishment,
  EstablishmentBillingGroup,
  EstablishmentGroupAPI,
} from '#src/libs/establishment/types';
import AdvancedRoleSettingsForm from './AdvancedRoleSettingsForm.component';
import { FranchiseRole, Role, UserRole } from '../types';
import { useAdvancedRoleSettings } from '../hooks/advancedRoleSettings';

export type Props = {
  coachList: Coach[];
  coachListLoading: boolean;
  establishmentGroupList?: Array<EstablishmentGroupAPI>;
  establishmentGroupListLoading?: boolean;
  establishmentList?: Array<Establishment>;
  establishmentListLoading?: boolean;
  hasAccessMonitoringUpsell: boolean;
  hasMultiLocationUpsell: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  customRole: Role;
  updateUserRole: (
    userId: number,
    params: {
      roleId?: number;
      coaches?: number[];
      establishments?: number[];
      staff_establishment_billing_group?: number | null;
    },
  ) => void;
  userRole?: UserRole<number, FranchiseRole>;
  establishmentBillingGroups: EstablishmentBillingGroup[];
};

const AdvancedRoleSettingsModal: React.FC<Props> = ({
  coachList,
  coachListLoading,
  establishmentGroupList,
  establishmentGroupListLoading,
  establishmentList,
  establishmentListLoading,
  hasAccessMonitoringUpsell,
  hasMultiLocationUpsell,
  onClose,
  onConfirm,
  customRole,
  updateUserRole,
  userRole,
  establishmentBillingGroups,
}) => {
  const { t } = useTranslation('role');

  const {
    coachOptions,
    establishmentOptions,
    handleSelectCoaches,
    handleSelectEstablishments,
    handleSelectSite,
    handleSubmit,
    selectedCoaches,
    selectedEstablishments,
    selectedSite,
    siteOptions,
    establishmentBillingGroupOptions,
    handleSelectEstablishmentBillingGroup,
    selectedEstablishmentBillingGroup,
  } = useAdvancedRoleSettings({
    coachList,
    establishmentGroupList,
    establishmentList,
    hasMultiLocationUpsell,
    onConfirm,
    updateUserRole,
    userRole,
    establishmentBillingGroups,
  });

  return (
    <ModalConfirm
      disableConfirm={
        hasAccessMonitoringUpsell &&
        customRole?.permissions?.navigationMenu?.accessMonitoring?.perform &&
        !selectedEstablishments?.length
      }
      handleCancel={onClose}
      handleConfirm={handleSubmit}
      open={!!userRole}
      options={{
        title: t('forms.user.advancedSettingsModal.title'),
        cancel: t('commmon:back'),
        confirm: t('common:save'),
      }}
    >
      <AdvancedRoleSettingsForm
        coachListLoading={coachListLoading}
        coachOptions={coachOptions}
        customRole={customRole}
        establishmentBillingGroupOptions={establishmentBillingGroupOptions}
        establishmentBillingGroups={establishmentBillingGroups}
        establishmentGroupListLoading={establishmentGroupListLoading}
        establishmentListLoading={establishmentListLoading}
        establishmentOptions={establishmentOptions}
        handleSelectCoaches={handleSelectCoaches}
        handleSelectEstablishmentBillingGroup={
          handleSelectEstablishmentBillingGroup
        }
        handleSelectEstablishments={handleSelectEstablishments}
        handleSelectSite={handleSelectSite}
        hasAccessMonitoringUpsell={hasAccessMonitoringUpsell}
        hasMultiLocationUpsell={hasMultiLocationUpsell}
        selectedCoaches={selectedCoaches}
        selectedEstablishmentBillingGroup={selectedEstablishmentBillingGroup}
        selectedEstablishments={selectedEstablishments}
        selectedSite={selectedSite}
        sitesOptions={siteOptions}
      />
    </ModalConfirm>
  );
};

export default React.memo(AdvancedRoleSettingsModal);
