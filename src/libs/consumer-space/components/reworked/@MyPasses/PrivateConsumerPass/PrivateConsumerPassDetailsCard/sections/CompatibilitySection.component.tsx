import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import AppointmentCompatibility from './AppointmentCompatibility.component';

import type { PrivateConsumerPassDetailsCardProps } from '..';

type Props = Required<
  Pick<
    PrivateConsumerPassDetailsCardProps,
    'appointmentCompatibilities' | 'isCompatibleWithVod'
  >
>;

const ConsumerPassDetailsCompatibilitySection: React.FC<Props> = ({
  appointmentCompatibilities,
  isCompatibleWithVod,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className={classNames(
        'bs-private-consumer-pass-details-card__compatibility-section',
      )}
      title={t(
        'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.main',
      )}
    >
      <AppointmentCompatibility
        appointmentCompatibilities={appointmentCompatibilities}
        className={classNames(
          'bs-private-consumer-pass-details-card__compatibility-section__container',
        )}
        isCompatibleWithVod={isCompatibleWithVod}
      />
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerPassDetailsCompatibilitySection);
