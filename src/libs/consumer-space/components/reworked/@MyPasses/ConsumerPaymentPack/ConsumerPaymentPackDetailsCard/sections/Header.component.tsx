import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';

import ListItem from '#Fabrique/ListItem';
import List from '#Fabrique/List';
import {
  CalendarCheck02,
  CalendarDate,
  PauseCircle,
  X,
} from '#components/untitledui';
import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerPaymentPackCreditStatus from '#libs/consumer-space/components/reworked/common/ConsumerPaymentPackCreditStatus';
import { getAvailabilityInformation } from '#libs/consumer-space/components/reworked/@MyPasses/utils';

type Props = {
  creditsLeft: number;
  expirationDate: string;
  isSuspended: boolean;
  isUnlimited: boolean;
  name: string;
  suspensionDate: string;
  startDate: string;
  totalCredits: number;
};

const Header: React.FC<Props> = ({
  creditsLeft,
  isUnlimited,
  name,
  totalCredits,
  expirationDate,
  isSuspended,
  startDate,
  suspensionDate,
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

  let caption = '';

  let label = '';

  let icon = null;

  let customClassName = '';
  let customIconClassName = '';

  if (isSuspended) {
    icon = <PauseCircle stroke="currentColor" />;
    customClassName =
      'bs-consumer-payment-pack-details-card__header__list__item--warning';
    if (suspensionDate) {
      label = t(
        'reworked.myPasses.consumerPassDetailsCard.availability.suspendedUntil',
        {
          endDate: moment(suspensionDate).format('L'),
          interpolation: { escapeValue: false },
        },
      );
    } else {
      label = t(
        'reworked.myPasses.consumerPassDetailsCard.availability.suspended',
      );
    }
  } else if (availability === 'future') {
    customIconClassName =
      'bs-consumer-payment-pack-details-card__header__list__item__icon--weak-color';
    caption = t(
      'reworked.myPasses.consumerPassDetailsCard.availability.validUntil',
      {
        expirationDate: formatedDates.expirationDate || '',
        interpolation: {
          escapeValue: false,
        },
      },
    );
    label = t('reworked.myPasses.consumerPassDetailsCard.availability.future', {
      startDate: formatedDates.startDate || '',
      interpolation: {
        escapeValue: false,
      },
    });

    icon = <CalendarDate stroke="currentColor" />;
  } else if (availability === 'active') {
    customIconClassName =
      'bs-consumer-payment-pack-details-card__header__list__item__icon--weak-color';
    label = t('reworked.myPasses.consumerPassDetailsCard.availability.active', {
      startDate: formatedDates.startDate || '',
      expirationDate: formatedDates.expirationDate || '',
      interpolation: {
        escapeValue: false,
      },
    });
    icon = <CalendarCheck02 stroke="currentColor" />;
  } else if (availability === 'expired') {
    customClassName =
      'bs-consumer-payment-pack-details-card__header__list__item--error';
    label = t(
      'reworked.myPasses.consumerPassDetailsCard.availability.expired',
      {
        expirationDate: formatedDates.expirationDate || '',
        interpolation: {
          escapeValue: false,
        },
      },
    );
    icon = <X stroke="currentColor" />;
  }

  const usedCredits = totalCredits - creditsLeft;

  return (
    <ConsumerCardSection
      classes={{
        title: 'bs-consumer-payment-pack-details-card__header__title',
      }}
      className="bs-consumer-payment-pack-details-card__header"
      title={name}
    >
      <ConsumerPaymentPackCreditStatus
        consumerPaymentPackAvailableCredits={creditsLeft}
        consumerPaymentPackUsedCredits={usedCredits}
        isPaymentPackUnlimited={isUnlimited}
        paymentPackTotalCredits={totalCredits}
      />
      <List
        className={classNames(
          'bs-consumer-payment-pack-details-card__header__list',
          {
            'bs-consumer-payment-pack-details-card__header__list--hidden':
              !caption || !icon || !label,
          },
        )}
      >
        <ListItem
          captionText={caption}
          classes={{ label: customClassName, icon: customIconClassName }}
          className={classNames(
            'bs-consumer-payment-pack-details-card__header__list__item',
            customClassName,
          )}
          icon={icon}
          label={label}
        />
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(Header);
