import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ActivityCompatibility from './ActivityCompatibility.component';

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

const CompatibilitySection: React.FC<Props> = ({
  activityCompatibilities,
  timeSlots,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-consumer-payment-pack-details-card__compatibility-section',
      )}
      title={t(
        'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.main',
      )}
    >
      <ActivityCompatibility
        activityCompatibilities={activityCompatibilities}
        className={classNames(
          'bs-consumer-payment-pack-details-card__compatibility-section__container',
        )}
        isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
        isCompatibleWithVod={isCompatibleWithVod}
        timeSlots={timeSlots}
      />
    </ConsumerCardSection>
  );
};

export default React.memo(CompatibilitySection);
