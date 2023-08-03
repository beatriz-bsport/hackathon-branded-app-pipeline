import { useTranslation } from 'react-i18next';

import useOfferWaitingListStatus from './useOfferWaitingListStatus';
import { OfferStatus } from '#libs/offer/types';

/**
 * Hook used for the text within offer booking waiting list
 * @param offerStatus The offer current status
 * @param isNoPassCompatibleForBooking Set to `true` if the logged member has no pass compatible for booking
 * @example
 * const { title, message } = useOfferWaitingListStatusText(
 *   offerStatus,
 *   isNoPassCompatibleForBooking
 * )
 */
const useOfferWaitingListStatusText = (
  offerStatus: OfferStatus,
  isNoPassCompatibleForBooking: boolean,
) => {
  const { t } = useTranslation('booking');
  const {
    isWaitlistOpen,
    isWaitlistAlreadyBooked,
    isWaitlistFull,
    isWaitingListLockedByPendingBookings,
  } = useOfferWaitingListStatus(offerStatus);

  let headerTitle = '';
  let title = '';
  let message = '';

  if (isNoPassCompatibleForBooking) {
    return {
      title: t('booking:newBookingModule.blockedReasons.noPassAvailable.title'),
      message: t(
        'booking:newBookingModule.blockedReasons.noPassAvailable.message',
      ),
    };
  }

  if (isWaitlistOpen) {
    headerTitle = 'booking:newBookingModule.reviewAndConfirm';
    title = 'booking:newBookingModule.blockedReasons.waitingListOpen.title';
    message = 'booking:newBookingModule.blockedReasons.waitingListOpen.message';
  }

  if (isWaitlistFull) {
    title = 'booking:newBookingModule.blockedReasons.isWaitingListFull.title';
    message =
      'booking:newBookingModule.blockedReasons.isWaitingListFull.message';
  }

  if (isWaitlistAlreadyBooked) {
    title =
      'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.title';
    message =
      'booking:newBookingModule.blockedReasons.isAlreadyOnWaitingList.message';
  }

  if (isWaitingListLockedByPendingBookings) {
    title =
      'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.title';
    message =
      'booking:newBookingModule.blockedReasons.waitingListLockedByPendingBookings.message';
  }

  return {
    headerTitle: t(headerTitle),
    title: t(title),
    message: t(message),
  };
};

export default useOfferWaitingListStatusText;
