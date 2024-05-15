import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DateTime } from 'luxon';
import { getAvailabilityInformation } from '#libs/consumer-space/components/reworked/@MyPasses/utils';
import {
  CalendarCheck02,
  CalendarDate,
  PauseCircle,
  X,
} from '#components/untitledui';

export const useConsumerPassDetailsCardHeaderData = ({
  creditsLeft,
  cssVariant,
  expirationDate,
  isSuspended,
  suspensionDate,
  startDate,
  totalCredits,
}: {
  creditsLeft: number;
  cssVariant:
    | 'consumer-payment-pack'
    | 'universal-pass'
    | 'private-consumer-pass';
  expirationDate: string;
  isSuspended: boolean;
  suspensionDate: string;
  startDate: string;
  totalCredits: number;
}) => {
  const { t } = useTranslation('consumerSpace');

  const { availability, formatedDates } = useMemo(
    () =>
      getAvailabilityInformation({
        startDate,
        expirationDate,
      }),
    [startDate, expirationDate],
  );

  const caption =
    availability === 'future'
      ? t('reworked.myPasses.consumerPassDetailsCard.availability.validUntil', {
          expirationDate: formatedDates.expirationDate ?? '',
          interpolation: {
            escapeValue: false,
          },
        })
      : '';

  const label = {
    suspendedWithDate: t(
      'reworked.myPasses.consumerPassDetailsCard.availability.suspendedUntil',
      {
        endDate: DateTime.fromISO(suspensionDate).toFormat('D'),
        interpolation: { escapeValue: false },
      },
    ),
    suspendedWithoutDate: t(
      'reworked.myPasses.consumerPassDetailsCard.availability.suspended',
    ),
    future: t('reworked.myPasses.consumerPassDetailsCard.availability.future', {
      startDate: formatedDates.startDate ?? '',
      interpolation: {
        escapeValue: false,
      },
    }),
    active: t('reworked.myPasses.consumerPassDetailsCard.availability.active', {
      startDate: formatedDates.startDate ?? '',
      expirationDate: formatedDates.expirationDate ?? '',
      interpolation: {
        escapeValue: false,
      },
    }),
    expired: t(
      'reworked.myPasses.consumerPassDetailsCard.availability.expired',
      {
        expirationDate: formatedDates.expirationDate ?? '',
        interpolation: {
          escapeValue: false,
        },
      },
    ),
  }?.[
    isSuspended
      ? `suspended${suspensionDate ? 'WithDate' : 'WithoutDate'}`
      : availability
  ];

  const customClassName = {
    suspended: `bs-${cssVariant}-details-card__header__list__item--warning`,
    expired: `bs-${cssVariant}-details-card__header__list__item--error`,
  }?.[isSuspended ? 'suspended' : availability];

  const customIconClassName =
    availability === ('future' || 'active')
      ? `bs-${cssVariant}-details-card__header__list__item__icon--weak-color`
      : null;

  const Icon = {
    suspended: PauseCircle,
    future: CalendarDate,
    active: CalendarCheck02,
    expired: X,
  }?.[isSuspended ? 'suspended' : availability];

  const usedCredits = totalCredits - creditsLeft;
  const hideList = (!caption && availability === 'future') || !Icon || !label;

  return {
    caption,
    customClassName,
    customIconClassName,
    hideList,
    Icon,
    label,
    usedCredits,
  };
};
