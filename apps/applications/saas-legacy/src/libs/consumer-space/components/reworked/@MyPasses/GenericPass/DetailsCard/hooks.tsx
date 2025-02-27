import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DateTime } from 'luxon';
import { getAvailabilityInformation } from '#src/libs/consumer-space/components/reworked/@MyPasses/utils';
import {
  CalendarCheck02,
  CalendarDate,
  PauseCircle,
  X,
} from '#src/components/untitledui';

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

  const labels: Record<string, string | undefined> = {
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
  };
  const label = isSuspended
    ? labels[`suspended${suspensionDate ? 'WithDate' : 'WithoutDate'}`]
    : labels[availability ?? ''];

  const customClassNames: Record<string, string | null> = {
    suspended: `bs-${cssVariant}-details-card__header__list__item--warning`,
    expired: `bs-${cssVariant}-details-card__header__list__item--error`,
  };
  const customClassName =
    customClassNames[isSuspended ? 'suspended' : availability ?? ''];

  const customIconClassName =
    availability === 'future' || availability === 'active'
      ? `bs-${cssVariant}-details-card__header__list__item__icon--weak-color`
      : null;

  const getIcon = () => {
    if (isSuspended) {
      return <PauseCircle stroke="currentColor" />;
    }
    switch (availability) {
      case 'future':
        return <CalendarDate stroke="currentColor" />;
      case 'active':
        return <CalendarCheck02 stroke="currentColor" />;
      case 'expired':
        return <X stroke="currentColor" />;
      default:
        return undefined;
    }
  };

  const usedCredits = totalCredits - creditsLeft;
  const hideList =
    (!caption && availability === 'future') || !getIcon() || !label;

  return {
    caption,
    customClassName,
    customIconClassName,
    hideList,
    getIcon,
    label,
    usedCredits,
  };
};
