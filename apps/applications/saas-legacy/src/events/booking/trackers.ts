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
  barcodeScanToggledEventSchema,
  barcodeScanSuccessEventSchema,
  tabletCheckInSignUpStartedEventSchema,
  tabletCheckInSessionClickedEventSchema,
  tabletCheckInCheckinButtonClickedEventSchema,
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

export const trackBarcodeScanToggledEvent = generateEvent(
  barcodeScanToggledEventSchema,
);

export const trackBarcodeScanSuccessEvent = generateEvent(
  barcodeScanSuccessEventSchema,
);

export const trackTabletCheckInSignUpStartedEvent = generateEvent(
  tabletCheckInSignUpStartedEventSchema,
);

export const trackTabletCheckInSessionClickedEvent = generateEvent(
  tabletCheckInSessionClickedEventSchema,
);

export const trackTabletCheckInCheckinButtonClickedEvent = generateEvent(
  tabletCheckInCheckinButtonClickedEventSchema,
);
