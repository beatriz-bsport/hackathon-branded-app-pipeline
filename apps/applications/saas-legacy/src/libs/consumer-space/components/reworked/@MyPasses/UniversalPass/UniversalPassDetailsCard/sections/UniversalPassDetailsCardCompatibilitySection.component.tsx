import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import UniversalPassDetailsCardActivityCompatibility from './UniversalPassDetailsCardActivityCompatibility.component';
import UniversalPassDetailsCardAppointmentCompatibility from './UniversalPassDetailsCardAppointmentCompatibility.component';

import type { UniversalPassDetailsCardProps } from '..';

type Props = Required<
  Pick<
    UniversalPassDetailsCardProps,
    | 'activityCompatibilities'
    | 'appointmentCompatibilities'
    | 'isCompatibleWithBookingForGuest'
    | 'isCompatibleWithVod'
    | 'timeSlots'
  >
>;

const UniversalPassDetailsCardCompatibilitySection: React.FC<Props> = ({
  activityCompatibilities,
  appointmentCompatibilities,
  timeSlots,
  isCompatibleWithBookingForGuest,
  isCompatibleWithVod,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <>
      <ConsumerCardSection
        className={clsx(
          'bs-universal-pass-details-card__compatibility-section',
          'bs-universal-pass-details-card__compatibility-section--activity',
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.activity',
        )}
      >
        <UniversalPassDetailsCardActivityCompatibility
          activityCompatibilities={activityCompatibilities}
          className={clsx(
            'bs-universal-pass-details-card__compatibility-section__container',
            'bs-universal-pass-details-card__compatibility-section__container--activity',
          )}
          isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
          isCompatibleWithVod={isCompatibleWithVod}
          timeSlots={timeSlots}
        />
      </ConsumerCardSection>
      <ConsumerCardSection
        className={clsx(
          'bs-universal-pass-details-card__compatibility-section',
          'bs-universal-pass-details-card__compatibility-section--appointment',
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.appointment',
        )}
      >
        <UniversalPassDetailsCardAppointmentCompatibility
          appointmentCompatibilities={appointmentCompatibilities}
          className={clsx(
            'bs-universal-pass-details-card__compatibility-section__container',
            'bs-universal-pass-details-card__compatibility-section__container--appointment',
          )}
          isCompatibleWithVod={false}
        />
      </ConsumerCardSection>
    </>
  );
};

export default React.memo(UniversalPassDetailsCardCompatibilitySection);
