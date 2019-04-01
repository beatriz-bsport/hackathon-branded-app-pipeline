import {
  BOOKING_STATUS_CANCELLED_BY_MANAGER,
  BOOKING_STATUS_CANCELLED_BY_CONSUMER,
  BOOKING_STATUS_CANCELLED_BY_OFFER,
} from '@bsport/common/lib/master-data/booking_status_code';

export const getBookingStatusCode = (t, booking) => {
  switch (booking.booking_status_code) {
    case BOOKING_STATUS_CANCELLED_BY_MANAGER.id:
      return ` (${t('booking.statusCode.cancelledByManager')})`;
    case BOOKING_STATUS_CANCELLED_BY_CONSUMER.id:
      return ` (${t('booking.statusCode.cancelledByConsumer')})`;
    case BOOKING_STATUS_CANCELLED_BY_OFFER.id:
      return ` (${t('booking.statusCode.cancelledByOffer')})`;
    default:
      return '';
  }
};
