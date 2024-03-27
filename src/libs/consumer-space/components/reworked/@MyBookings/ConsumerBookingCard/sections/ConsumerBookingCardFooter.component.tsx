import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ConsumerBookingCardProps } from '..';

import { ConsumerGenericCardFooter } from '#libs/consumer-space/components/reworked/common/ConsumerCard';

import {
  Calendar,
  CalendarMinus02,
  UserPlus01,
  VideoRecorder,
} from '#components/untitledui';

import type { ButtonColor, ButtonVariant } from '#Fabrique/ButtonV2/types';

type Props = Required<
  Pick<
    ConsumerBookingCardProps,
    | 'onBookingCancelClick'
    | 'isCancellable'
    | 'isCancelDisabled'
    | 'onBookingForAGuestClick'
    | 'isBookableForAGuest'
    | 'onBookClick'
    | 'isBookable'
    | 'isBookableDisabled'
    | 'onJoinOnlineClick'
    | 'isJoinableOnline'
    | 'isJoinableOnlineDisabled'
    | 'isMoreDisabled'
  >
> & { isMoreDisplayed: boolean; menuId: string };

const ConsumerBookingCardFooter: React.FC<Props> = ({
  isBookable,
  isBookableDisabled,
  isBookableForAGuest,
  isCancelDisabled,
  isCancellable,
  isJoinableOnline,
  isJoinableOnlineDisabled,
  isMoreDisplayed,
  onBookingCancelClick,
  isMoreDisabled,
  onBookingForAGuestClick,
  onBookClick,
  onJoinOnlineClick,
  menuId,
}) => {
  const { t } = useTranslation('consumerSpace');

  const secondaryButtonsList = React.useMemo(
    () => [
      {
        shouldDisplay: !isMoreDisplayed,
        color: 'grey' as ButtonColor,
        onClick: onBookingCancelClick,
        leftIcon: <CalendarMinus02 stroke="currentColor" />,
        variant: 'outlined' as ButtonVariant,
        isDisabled: isCancelDisabled,
        label: t('reworked.myBookings.consumerBookingCard.buttonsLabel.cancel'),
        buttonClassName: 'bs-consumer-booking-card__footer__secondary-button',
        typographyClassName:
          'bs-consumer-booking-card__footer__secondary-button__label',
      },
    ],
    [isCancelDisabled, onBookingCancelClick, isMoreDisplayed, t],
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
    ],
    [
      isBookable,
      isBookableDisabled,
      onBookClick,
      isJoinableOnline,
      isJoinableOnlineDisabled,
      onJoinOnlineClick,
      t,
    ],
  );

  // NEED TO GIVE DISABLED STATE WHEN MENUITEMLIST HAVE DISABLED STATE
  const menuItemsList = React.useMemo(
    () => [
      {
        menuItemClassName: 'bs-consumer-booking-card__menu-item',
        shouldDisplay: isBookableForAGuest,
        label: t(
          'reworked.myBookings.consumerBookingCard.buttonsLabel.bookForAGuest',
        ),
        leftIcon: <UserPlus01 stroke="currentColor" />,
        onClick: onBookingForAGuestClick,
      },
      {
        menuItemClassName: 'bs-consumer-booking-card__menu-item',
        shouldDisplay: isCancellable,
        label: t('reworked.myBookings.consumerBookingCard.buttonsLabel.cancel'),
        leftIcon: <CalendarMinus02 stroke="currentColor" />,
        onClick: onBookingCancelClick,
      },
    ],
    [
      isCancellable,
      onBookingCancelClick,
      isBookableForAGuest,
      onBookingForAGuestClick,
      t,
    ],
  );
  return (
    <ConsumerGenericCardFooter
      className="bs-consumer__booking-card__footer"
      isMenuButtonDisabled={isMoreDisabled}
      mainButtonsList={mainButtonsList}
      menuButtonClassName="bs-consumer__booking-card__footer__menu-button"
      menuButtonLabel={t(
        'reworked.myBookings.consumerBookingCard.buttonsLabel.more',
      )}
      menuClassName="bs-consumer__booking-card__footer__menu"
      menuId={menuId}
      menuItemsList={menuItemsList}
      secondaryButtonsHidden={isMoreDisplayed}
      secondaryButtonsList={secondaryButtonsList}
    />
  );
};

export default React.memo(ConsumerBookingCardFooter);
