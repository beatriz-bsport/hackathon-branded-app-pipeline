import useAsyncFn from '#src/hooks/useAsyncFn';
import { fetchOfferStatusPublic } from '#src/libs/offer/api';
import {
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_BOOKABLE,
} from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';

type BookableStatusResponse = {
  shouldRedirect: boolean;
  shouldDisplayErrorPage: boolean;
  statusCode: number;
};

const checkBookableStatus = async (
  offerId: number,
): Promise<BookableStatusResponse> => {
  const response = await fetchOfferStatusPublic(offerId, {});

  const { waiting_list_status, bookable_status, blocked_by_tags } =
    response.data;

  const fullSessionAndFullWaitingList =
    bookable_status === OFFER_BOOKABLE_STATUS_FULL &&
    waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL;

  const shouldDisplayErrorPage =
    [
      OFFER_BOOKABLE_STATUS_LOCKED,
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
      OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
    ].includes(bookable_status) || fullSessionAndFullWaitingList;

  const notHandledInOneClickBooking =
    (waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN &&
      bookable_status === OFFER_BOOKABLE_STATUS_FULL) ||
    bookable_status !== OFFER_BOOKABLE_STATUS_BOOKABLE ||
    blocked_by_tags;

  const shouldRedirect = !shouldDisplayErrorPage && notHandledInOneClickBooking;

  return {
    shouldRedirect,
    shouldDisplayErrorPage,
    statusCode: bookable_status,
  };
};

const useCheckBookableStatus = () => {
  return useAsyncFn(checkBookableStatus);
};

export default useCheckBookableStatus;
