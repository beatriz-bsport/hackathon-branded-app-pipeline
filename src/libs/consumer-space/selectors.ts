import { RootState } from '../../reducers';

import {
  getOfferDataList,
  withEstablishment,
  withMetaActivity,
  withCoach,
  // @ts-ignore
} from '../offer/selectors';
import { Booking } from '../booking/types';
import { PrivateBooking } from '../private-service/types';

const getAllBookingAndPrivateBookingWithIds = (state: RootState) => {
  return state.consumer.bookingAndPrivateBooking.allObj;
};

export const getAllBookingAndPrivateBooking = (state: RootState) => {
  const bookingsAndPrivateBookings =
    getAllBookingAndPrivateBookingWithIds(state);

  const bookingById = state.consumer.bookingAndPrivateBooking.booking.byId;
  const privateBookingById =
    state.consumer.bookingAndPrivateBooking.privateBooking.byId;

  const offerData = withEstablishment(
    withMetaActivity(withCoach(getOfferDataList)),
  )(state);

  const all: {
    type: 'booking' | 'privateBooking';
    booking?: Booking;
    privateBooking?: PrivateBooking;
  }[] = [];

  bookingsAndPrivateBookings.forEach((item) => {
    if (item.type === 'booking' && item.booking) {
      if (bookingById[item.booking]) {
        all.push({
          type: 'booking',
          booking: {
            ...bookingById[item.booking],
            offer: offerData.find(
              (o: any) => o.id === bookingById[item.booking].offer,
            ),
          },
        });
      }
    }

    if (item.type === 'privateBooking' && item.privateBooking) {
      if (privateBookingById[item.privateBooking]) {
        all.push({
          type: 'privateBooking',
          privateBooking: privateBookingById[item.privateBooking],
        });
      }
    }
  });

  return all;
};
