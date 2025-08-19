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
import {
  PASS_ERROR_INVALID,
  PassErrorCode,
} from '#src/pages/checkout/express-checkouts/pass/hooks/useCheckPassValidity';
import './error-message.css';

export type ErrorCode =
  | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE
  | typeof OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON
  | typeof OFFER_BOOKABLE_STATUS_FULL
  | typeof OFFER_BOOKABLE_STATUS_LOCKED
  | PassErrorCode;

type Props = {
  errorCode: ErrorCode;
  goBack: () => void;
  goBackButtonLabel: string;
};

export const ErrorMessage: React.FC<Props> = ({
  errorCode,
  goBack,
  goBackButtonLabel,
}) => {
  const { t } = useTranslation(['booking', 'checkout']);

  const unhandledError = {
    title: t('booking:oneClickBooking.bookableStatus.unhandled.title'),
    description: t(
      'booking:oneClickBooking.bookableStatus.unhandled.description',
    ),
  };

  const errorData = {
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE]: {
      title: t('booking:oneClickBooking.bookableStatus.closeTooLate.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.closeTooLate.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON]: {
      title: t('booking:oneClickBooking.bookableStatus.closeTooSoon.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.closeTooSoon.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_FULL]: {
      title: t('booking:oneClickBooking.bookableStatus.full.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.full.description" />
      ),
    },
    [OFFER_BOOKABLE_STATUS_LOCKED]: {
      title: t('booking:oneClickBooking.bookableStatus.locked.title'),
      description: (
        <Trans i18nKey="booking:oneClickBooking.bookableStatus.locked.description" />
      ),
    },
    [PASS_ERROR_INVALID]: {
      title: t('checkout:passExpressCheckout.errors.unavailable.title'),
      description: (
        <Trans i18nKey="checkout:passExpressCheckout.errors.unavailable.description" />
      ),
    },
  };

  const currentError =
    errorData?.[errorCode as keyof typeof errorData] ?? unhandledError;

  return (
    <div className="bs-oneclick-booking-error-message__container">
      <BigIcon variant="error" />
      <div className="bs-oneclick-booking-error-message__text">
        <Typography
          className="bs-oneclick-booking-error-message__text__title"
          variant="title-md"
        >
          {currentError.title}
        </Typography>
        <Typography
          className="bs-oneclick-booking-error-message__text__description"
          variant="body-md"
        >
          {currentError.description}
        </Typography>
      </div>
      <Button
        className="bs-oneclick-booking-error-message__button"
        color="grey"
        onClick={goBack}
        size="lg"
        variant="outlined"
      >
        {goBackButtonLabel}
      </Button>
    </div>
  );
};
