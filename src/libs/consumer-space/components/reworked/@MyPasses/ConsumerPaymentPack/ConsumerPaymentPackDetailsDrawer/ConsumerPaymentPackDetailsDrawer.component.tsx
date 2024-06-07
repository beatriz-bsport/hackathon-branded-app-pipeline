import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';

import { parseConsumerPaymentPackData } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/utils';
import ConsumerPaymentPackCreditStatus from '#src/libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';
import ConsumerPaymentPackDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPaymentPack/ConsumerPaymentPackDetailsCard';

import type { ConsumerPaymentPackReworked } from '#src/libs/consumer-payment-pack/types';

type Props = {
  handleTogglePassDetailsDrawer: () => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  isOpen: boolean;
  selectedPass?: ConsumerPaymentPackReworked;
};

const ConsumerPaymentPackDetailsDrawer: React.FC<Props> = ({
  handleTogglePassDetailsDrawer,
  isLoading,
  isMetadataLoading,
  isMobile,
  isOpen,
  selectedPass,
}) => {
  const { t } = useTranslation('common');

  const {
    activityCompatibilities,
    creditsLeft,
    isCompatibleWithBookingForGuest,
    description,
    expirationDate,
    isSuspended,
    isUnlimited,
    name,
    restrictions,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
    isCompatibleWithVod,
  } = parseConsumerPaymentPackData(selectedPass);

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
      <ConsumerPaymentPackDetailsCard
        activityCompatibilities={activityCompatibilities}
        className="bs-consumer-payment-pack-details-card__root--mobile"
        // TODO: Out of scope, needs product specs
        compatibleEstablishments={null}
        creditsLeft={creditsLeft}
        description={description}
        expirationDate={expirationDate}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        isLoading={isLoading || isMetadataLoading}
        isMobile={isMobile}
        isSuspended={isSuspended}
        isUnlimited={isUnlimited}
        name={name}
        restrictions={restrictions}
        sharedBy={sharedBy}
        sharedWith={sharedWith}
        showPlaceholder={!selectedPass}
        startDate={startDate}
        timeSlots={timeSlots}
        totalCredits={totalCredits}
      />
    </BottomDrawer>
  );
};

export default React.memo(ConsumerPaymentPackDetailsDrawer);
