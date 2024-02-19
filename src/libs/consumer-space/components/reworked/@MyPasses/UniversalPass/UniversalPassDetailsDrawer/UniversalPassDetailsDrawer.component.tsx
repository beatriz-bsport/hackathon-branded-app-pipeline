import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';

import { parseUniversalPassData } from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/utils';
import ConsumerPaymentPackCreditStatus from '#libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';
import UniversalPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';

import type { UniversalPassReworked } from '#libs/universal-pass/types';

type Props = {
  handleTogglePassDetailsDrawer: () => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isOpen: boolean;
  selectedPass?: UniversalPassReworked;
};

const UniversalPassDetailsDrawer: React.FC<Props> = ({
  handleTogglePassDetailsDrawer,
  isLoading,
  isMetadataLoading,
  isOpen,
  selectedPass,
}) => {
  const { t } = useTranslation('common');

  if (!selectedPass) {
    return null;
  }

  const {
    activityCompatibilities,
    appointmentCompatibilities,
    creditsLeft,
    isCompatibleWithBookingForGuest,
    description,
    expirationDate,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
    isCompatibleWithVod,
  } = parseUniversalPassData(selectedPass);

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleTogglePassDetailsDrawer }}
      className="bs-consumer-pass-details-drawer__root"
      modalDialogProps={{
        subtitleElement: (
          <ConsumerPaymentPackCreditStatus
            consumerPaymentPackAvailableCredits={creditsLeft}
            consumerPaymentPackUsedCredits={totalCredits - creditsLeft}
            isPaymentPackUnlimited={isUnlimited}
            paymentPackTotalCredits={totalCredits}
          />
        ),
        title: name,
        onClose: handleTogglePassDetailsDrawer,
        onCancel: handleTogglePassDetailsDrawer,
        cancelLabel: t('close'),
      }}
    >
      <UniversalPassDetailsCard
        isMobile
        activityCompatibilities={activityCompatibilities}
        appointmentCompatibilities={appointmentCompatibilities}
        className="bs-universal-pass-details-card__root--mobile"
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        name={name}
        sharedBy={sharedBy}
        sharedWith={sharedWith}
        startDate={startDate}
        timeSlots={timeSlots}
        totalCredits={totalCredits}
      />
    </BottomDrawer>
  );
};

export default React.memo(UniversalPassDetailsDrawer);
