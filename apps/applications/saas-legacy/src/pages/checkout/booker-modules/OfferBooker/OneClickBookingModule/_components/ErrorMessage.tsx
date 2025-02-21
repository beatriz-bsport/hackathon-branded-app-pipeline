import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
} from '@bsport/common/lib/master-data/bookable-status';

import BigIcon from '#src/components/css-only/Fabrique/BigIcon';
import Typography from '#src/components/css-only/Fabrique/Typography';

import { Button } from '#src/components/css-only/Fabrique/ButtonV2/Button.component';
import './error-message.css';

export type ErrorCode =
  | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
  | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON
  | typeof OFFER_BOOKABLE_STATUS_FULL
  | typeof OFFER_BOOKABLE_STATUS_LOCKED;

type Props = {
  errorCode: ErrorCode;
  goBackToCalendar: () => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorCode,
  goBackToCalendar,
}) => {
  const { t } = useTranslation('booking');

  if (
    !errorCode ||
    ![
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
      OFFER_BOOKABLE_STATUS_FULL,
      OFFER_BOOKABLE_STATUS_LOCKED,
    ].includes(errorCode)
  )
    return null;

  const errorData = {
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE]: {
      title: t('oneClickBooking.bookableStatus.closeTooLate.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.closeTooLate.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON]: {
      title: t('oneClickBooking.bookableStatus.closeTooSoon.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.closeTooSoon.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_FULL]: {
      title: t('oneClickBooking.bookableStatus.full.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.full.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_LOCKED]: {
      title: t('oneClickBooking.bookableStatus.locked.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.locked.description" />
      ),
    },
  };

  return (
    <div className="bs-oneclick-booking-error-message__container">
      <BigIcon variant="error" />
      <div className="bs-oneclick-booking-error-message__text">
        <Typography
          className="bs-oneclick-booking-error-message__text__title"
          variant="title-md"
        >
          {errorData[errorCode].title}
        </Typography>
        <Typography
          className="bs-oneclick-booking-error-message__text__description"
          variant="body-md"
        >
          {errorData[errorCode].description}
        </Typography>
      </div>
      <Button
        className="bs-oneclick-booking-error-message__button"
        color="grey"
        onClick={goBackToCalendar}
        size="lg"
        variant="outlined"
      >
        {t('oneClickBooking.goToCalendar')}
      </Button>
    </div>
  );
};
