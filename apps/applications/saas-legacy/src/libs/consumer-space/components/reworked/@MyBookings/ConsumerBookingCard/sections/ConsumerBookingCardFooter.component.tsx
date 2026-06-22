import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerGenericCardFooter } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';

import {
  Calendar,
  CalendarMinus02,
  UserPlus01,
  VideoRecorder,
} from '#src/components/untitledui';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';
import type { ConsumerBookingCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerBookingCardProps,
    | 'onBookingCancelClick'
    | 'isCancellable'
    | 'onBookingForAGuestClick'
    | 'isBookableForAGuest'
    | 'onBookClick'
    | 'isBookable'
    | 'isBookableDisabled'
    | 'onJoinOnlineClick'
    | 'isJoinableOnline'
    | 'isJoinableOnlineDisabled'
    | 'isMobile'
  >
> & { isCancelDisabled: boolean };

const ConsumerBookingCardFooter: React.FC<Props> = ({
  isBookable,
  isBookableDisabled,
  isBookableForAGuest,
  isCancelDisabled,
  isCancellable,
  isJoinableOnline,
  isJoinableOnlineDisabled,
  onBookingCancelClick,
  onBookingForAGuestClick,
  onBookClick,
  onJoinOnlineClick,
  isMobile,
}) => {
  const { t } = useTranslation('consumerSpace');

  const secondaryButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay: isBookableForAGuest,
        color: 'grey' as ButtonColor,
        onClick: onBookingForAGuestClick,
        leftIcon: <UserPlus01 stroke="currentColor" />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: false,
        label: t(
          'reworked.myBookings.consumerBookingCard.buttonsLabel.bookForAGuest',
        ),
        buttonClassName: 'bs-consumer-booking-card__footer__secondary-button',
        typographyClassName:
          'bs-consumer-booking-card__footer__secondary-button__label',
      },
    ],
    [isBookableForAGuest, onBookingForAGuestClick, t],
  );

  const mainButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay: isBookable,
        color: 'primary' as ButtonColor,
        onClick: onBookClick,
        leftIcon: <Calendar stroke="currentColor" />,
        variant: 'contained' as ButtonVariant,
        isDisabled: isBookableDisabled,
        label: t('reworked.myBookings.consumerBookingCard.buttonsLabel.book'),
        buttonClassName: 'bs-consumer-booking-card__footer__primary-button',
        typographyClassName:
          'bs-consumer-booking-card__footer__primary-button__label',
      },
      {
        shouldDisplay: isJoinableOnline,
        color: 'primary' as ButtonColor,
        onClick: onJoinOnlineClick,
        leftIcon: <VideoRecorder stroke="currentColor" />,
        variant: 'contained' as ButtonVariant,
        isDisabled: isJoinableOnlineDisabled,
        label: t(
          'reworked.myBookings.consumerBookingCard.buttonsLabel.joinOnline',
        ),
        buttonClassName: 'bs-consumer-booking-card__footer__primary-button',
        typographyClassName:
          'bs-consumer-booking-card__footer__primary-button__label',
      },
      {
        shouldDisplay: isCancellable,
        color: 'error' as ButtonColor,
        onClick: onBookingCancelClick,
        leftIcon: <CalendarMinus02 stroke="currentColor" />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: isCancelDisabled,
        label: t('reworked.myBookings.consumerBookingCard.buttonsLabel.cancel'),
        buttonClassName: 'bs-consumer-booking-card__footer__cancel-button',
        typographyClassName:
          'bs-consumer-booking-card__footer__cancel-button__label',
      },
    ],
    [
      isBookable,
      isBookableDisabled,
      onBookClick,
      isJoinableOnline,
      isJoinableOnlineDisabled,
      onJoinOnlineClick,
      isCancellable,
      isCancelDisabled,
      onBookingCancelClick,
      t,
    ],
  );

  return (
    <ConsumerGenericCardFooter
      className="bs-consumer__booking-card__footer"
      isMobile={isMobile}
      mainButtonsList={mainButtonsList}
      secondaryButtonsList={secondaryButtonsList}
    />
  );
};

export default React.memo(ConsumerBookingCardFooter);
