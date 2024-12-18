import {
  OFFER_WAITING_LIST_STATUS_OPEN,
  OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { OfferStatus } from '../types';

/**
 * Hook used to determine the offer's waiting list status state
 * @param offerStatus The offer current status
 * @example
 * const { isWaitlistFull, isWaitlistOpen } = useOfferWaitingListStatus(
 *   offerStatus,
 * )
 */
const useOfferWaitingListStatus = (offerStatus: OfferStatus) => {
  const isBookingLimitReached =
    offerStatus?.bookable_status === OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE;
  const isWaitlistOpen =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN;
  const isWaitlistFull =
    offerStatus?.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL;
  const isWaitlistAlreadyBooked =
    offerStatus?.waiting_list_status ===
    OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED;
  const isWaitingListLockedByPendingBookings =
    offerStatus?.waiting_list_status ===
    OFFER_WAITING_LIST_LOCKED_BY_PENDING_BOOKINGS;

  return {
    isBookingLimitReached,
    isWaitlistOpen,
    isWaitlistAlreadyBooked,
    isWaitlistFull,
    isWaitingListLockedByPendingBookings,
  };
};

export default useOfferWaitingListStatus;
