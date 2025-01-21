import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ActivityCompatibility from './ConsumerPaymentPackDetailsCardActivityCompatibility.component';

import type { ConsumerPaymentPackDetailsCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerPaymentPackDetailsCardProps,
    | 'activityCompatibilities'
    | 'isCompatibleWithBookingForGuest'
    | 'isCompatibleWithVod'
    | 'timeSlots'
  >
>;

const ConsumerPaymentPackDetailsCardCompatibilitySection: React.FC<Props> = ({
  activityCompatibilities,
  timeSlots,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={clsx(
        'bs-consumer-payment-pack-details-card__compatibility-section',
      )}
      title={t(
        'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.main',
      )}
    >
      <ActivityCompatibility
        activityCompatibilities={activityCompatibilities}
        className={clsx(
          'bs-consumer-payment-pack-details-card__compatibility-section__container',
        )}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        timeSlots={timeSlots}
      />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPaymentPackDetailsCardCompatibilitySection);
