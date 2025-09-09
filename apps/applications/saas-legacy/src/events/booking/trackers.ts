import { generateEvent } from '@bsport/analytics';

import {
  appointmentSlotViewedEventSchema,
  appointmentViewedEventSchema,
  bookingCancelledEventSchema,
  bookingConfirmedEventSchema,
  passSelectionForAppointmentViewedEventSchema,
  passSelectionForOfferViewedEventSchema,
  spotSchedulingViewedEventSchema,
  calendarViewedEventSchema,
  groupActivitySessionViewedEventSchema,
  paymentViewedEventSchema,
} from './schemas';

export const trackCalendarViewedEvent = generateEvent(
  calendarViewedEventSchema,
);

export const trackGroupActivitySessionViewedEvent = generateEvent(
  groupActivitySessionViewedEventSchema,
);

export const trackAppointmentViewedEvent = generateEvent(
  appointmentViewedEventSchema,
);

export const trackAppointmentSlotViewedEvent = generateEvent(
  appointmentSlotViewedEventSchema,
);

export const trackSpotSchedulingViewedEvent = generateEvent(
  spotSchedulingViewedEventSchema,
);

export const trackPassSelectionForOfferViewedEvent = generateEvent(
  passSelectionForOfferViewedEventSchema,
);

export const trackPassSelectionForAppointmentViewedEvent = generateEvent(
  passSelectionForAppointmentViewedEventSchema,
);

export const trackBookingConfirmedEvent = generateEvent(
  bookingConfirmedEventSchema,
);

export const trackBookingCancelledEvent = generateEvent(
  bookingCancelledEventSchema,
);

export const trackPaymentViewedEvent = generateEvent(paymentViewedEventSchema);
