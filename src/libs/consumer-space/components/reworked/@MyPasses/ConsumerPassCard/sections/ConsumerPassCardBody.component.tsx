import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '#Fabrique/Typography';
import Chip from '#Fabrique/Chip/Chip.component';
import Button from '#Fabrique/ButtonV2';
import { ChipSizeEnum } from '#Fabrique/Chip/constants';
import { AlarmClock, ChevronRight } from '#components/untitledui';
import { ConsumerGenericCardBodyContainer } from '#libs/consumer-space/components/reworked/common/ConsumerCard';

import { getAvailabilityInformation } from '#libs/consumer-space/components/reworked/@MyPasses/utils';

import type { ConsumerPassCardProps } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';

type Props = Required<
  Pick<
    ConsumerPassCardProps,
    'expirationDate' | 'handleSeeDetails' | 'startDate'
  >
>;

/**
 * `ConsumerPassCardBody` is a React component that displays the body information for a consumer's pass.
 *
 * The component displays the start and expiration dates of the pass, and calculates the remaining days if the expiration date is within 3 days.
 * It also provides a "See Details" button that calls the `handleSeeDetails` function when clicked.
 */
const ConsumerPassCardBody: React.FC<Props> = ({
  expirationDate,
  handleSeeDetails,
  startDate,
}) => {
  const { t } = useTranslation('consumerSpace');

  const [availabilityInfo, setAvailabilityInfo] = useState('');

  const [displayDaysRemaining, setDisplayDaysRemaining] = useState(false);

  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    const { availability, daysBeforeExpiration, formatedDates } =
      getAvailabilityInformation({ startDate, expirationDate });
    const {
      startDate: formatedStartDate,
      expirationDate: formatedExpirationDate,
    } = { ...formatedDates };

    if (availability === 'active') {
      setAvailabilityInfo(
        t('reworked.myPasses.consumerPassCard.availability.active', {
          expirationDate: formatedExpirationDate || '',
          interpolation: { escapeValue: false },
        }),
      );
    } else if (availability === 'expired') {
      setAvailabilityInfo(
        t('reworked.myPasses.consumerPassCard.availability.expired', {
          expirationDate: formatedExpirationDate || '',
          interpolation: { escapeValue: false },
        }),
      );
    } else if (availability === 'future') {
      setAvailabilityInfo(
        t('reworked.myPasses.consumerPassCard.availability.future', {
          startDate: formatedStartDate || '',
          interpolation: { escapeValue: false },
        }),
      );
    }

    setDaysRemaining(daysBeforeExpiration);
    setDisplayDaysRemaining(
      availability === 'active' &&
        daysBeforeExpiration >= 0 &&
        daysBeforeExpiration <= 3,
    );
  }, [
    expirationDate,
    startDate,
    setAvailabilityInfo,
    setDaysRemaining,
    setDisplayDaysRemaining,
    t,
  ]);

  return (
    <ConsumerGenericCardBodyContainer className="bs-consumer__pass-card__body__container">
      {availabilityInfo && (
        <div className="bs-consumer__pass-card__body__availability-info">
          <Typography
            className="bs-consumer__pass-card__body__availability-info__label"
            variant="body-md"
          >
            {availabilityInfo}
          </Typography>
          {displayDaysRemaining && (
            <Chip
              className="bs-consumer__pass-card__body__availability-info__chip"
              color="warning"
              leftIcon={<AlarmClock stroke="currentColor" />}
              size={ChipSizeEnum.SM}
              variant="weak"
            >
              {daysRemaining === 0
                ? t(
                    'reworked.myPasses.consumerPassCard.availability.expiresToday',
                  )
                : t(
                    'reworked.myPasses.consumerPassCard.availability.expiresIn',
                    {
                      daysRemaining,
                    },
                  )}
            </Chip>
          )}
        </div>
      )}
      <Button
        className="bs-consumer-pass-card__body__button"
        color="primary"
        onClick={handleSeeDetails}
        rightIcon={<ChevronRight stroke="currentColor" />}
        size="md"
        variant="text"
      >
        {t('reworked.myPasses.consumerPassCard.buttonsLabel.seeDetails')}
      </Button>
    </ConsumerGenericCardBodyContainer>
  );
};

export default React.memo(ConsumerPassCardBody);
