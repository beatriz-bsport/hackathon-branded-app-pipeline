import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';

import { parsePrivateConsumerPassData } from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import ConsumerPaymentPackCreditStatus from '#libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';
import PrivateConsumerPassDetailsCard from '#libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';

import type { PrivateConsumerPassReworked } from '#libs/private-service/types';

type Props = {
  handleTogglePassDetailsDrawer: () => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  isOpen: boolean;
  selectedPass?: PrivateConsumerPassReworked;
};

const PrivateConsumerPassDetailsDrawer: React.FC<Props> = ({
  handleTogglePassDetailsDrawer,
  isLoading,
  isMetadataLoading,
  isMobile,
  isOpen,
  selectedPass,
}) => {
  const { t } = useTranslation('common');

  const {
    appointmentCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    totalCredits,
  } = parsePrivateConsumerPassData(selectedPass);

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
      <PrivateConsumerPassDetailsCard
        appointmentCompatibilities={appointmentCompatibilities}
        className="bs-private-consumer-pass-details-card__root--mobile"
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isMobile={isMobile}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        name={name}
        sharedBy={sharedBy}
        sharedWith={sharedWith}
        showPlaceholder={!selectedPass}
        startDate={startDate}
        totalCredits={totalCredits}
      />
    </BottomDrawer>
  );
};

export default React.memo(PrivateConsumerPassDetailsDrawer);
