import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ActivityCompatibility from './ActivityCompatibility.component';
import AppointmentCompatibility from './AppointmentCompatibility.component';

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

const CompatibilitySection: React.FC<Props> = ({
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
        className={classNames(
          'bs-universal-pass-details-card__compatibility-section',
          'bs-universal-pass-details-card__compatibility-section--activity',
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.activity',
        )}
      >
        <ActivityCompatibility
          activityCompatibilities={activityCompatibilities}
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__container',
            'bs-universal-pass-details-card__compatibility-section__container--activity',
          )}
          isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
          isCompatibleWithVod={isCompatibleWithVod}
          timeSlots={timeSlots}
        />
      </ConsumerCardSection>
      <ConsumerCardSection
        className={classNames(
          'bs-universal-pass-details-card__compatibility-section',
          'bs-universal-pass-details-card__compatibility-section--appointment',
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.titles.appointment',
        )}
      >
        <AppointmentCompatibility
          appointmentCompatibilities={appointmentCompatibilities}
          className={classNames(
            'bs-universal-pass-details-card__compatibility-section__container',
            'bs-universal-pass-details-card__compatibility-section__container--appointment',
          )}
          isCompatibleWithVod={false}
        />
      </ConsumerCardSection>
    </>
  );
};

export default React.memo(CompatibilitySection);
