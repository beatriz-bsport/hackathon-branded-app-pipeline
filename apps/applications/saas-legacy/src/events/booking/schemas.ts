import { z } from 'zod';
import { PRODUCT_TYPES, SESSION_TYPES, sessionTypeValues } from '../constants';

export const calendarViewedEventSchema = z
  .object({
    eventType: z.string().default('calendar_viewed'),
  })
  .describe('When the calendar page is displayed to the user');

export const groupActivitySessionViewedEventSchema = z
  .object({
    eventType: z.string().default('group_activity_session_viewed'),
    activity_id: z
      .number()
      .describe('The unique identifier for the group activity'),
    activity_name: z.string().describe('The name of the group activity'),
    offer_id: z.number().describe('The unique identifier for the session'),
    is_waiting_list: z
      .boolean()
      .describe(
        'Indicates if the session that the user is viewing is on the waiting list or not',
      ),
    session_type: z
      .enum([SESSION_TYPES.groupActivity, SESSION_TYPES.workshop])
      .describe('The type of session being viewed'),
  })
  .describe('When the user views the group activity details');

export const appointmentViewedEventSchema = z
  .object({
    eventType: z.string().default('appointment_viewed'),
    activity_id: z
      .number()
      .describe('The unique identifier for the appointment'),
    activity_name: z.string().describe('The name of the appointment'),
  })
  .describe('When the user views the appointment details');

export const appointmentSlotViewedEventSchema = z
  .object({
    eventType: z.string().default('appointment_slot_viewed'),
    activity_id: z
      .number()
      .describe('The unique identifier for the appointment'),
    activity_name: z.string().describe('The name of the appointment'),
  })
  .describe('When the user views the appointment slot details');

export const spotSchedulingViewedEventSchema = z
  .object({
    eventType: z.string().default('spot_scheduling_viewed'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe('The unique identifier for the group activity'),
    activity_name: z.string().describe('The name of the group activity'),
  })
  .describe('When the user views the spot scheduling');

export const passSelectionForOfferViewedEventSchema = z
  .object({
    eventType: z.string().default('pass_selection_viewed'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe('The unique identifier for the group activity'),
    activity_name: z.string().describe('The name of the group activity'),
    is_waiting_list: z
      .boolean()
      .describe(
        'Indicates if the session that the user is viewing is on the waiting list or not',
      ),
    session_type: z
      .enum([SESSION_TYPES.groupActivity, SESSION_TYPES.workshop])
      .describe('The type of session being booked'),
  })
  .describe(
    'When the user views the pass selection for an offer (workshop or group activity)',
  );

export const passSelectionForAppointmentViewedEventSchema = z
  .object({
    eventType: z.string().default('pass_selection_viewed'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe('The unique identifier for the appointment'),
    activity_name: z.string().describe('The name of the appointment'),
    session_type: z
      .enum([SESSION_TYPES.appointment])
      .describe('The type of session being booked'),
  })
  .describe('When the user views the pass selection for an appointment');

export const paymentViewedEventSchema = z
  .object({
    eventType: z.string().default('payment_viewed'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe('The unique identifier for the group activity'),
    activity_name: z.string().describe('The name of the group activity'),
    session_type: z
      .enum(sessionTypeValues)
      .describe('The type of session being booked'),
    product_type: z
      .enum([
        PRODUCT_TYPES.pass,
        PRODUCT_TYPES.subscription,
        PRODUCT_TYPES.pack,
      ])
      .describe(
        'The type of product being purchased. Can be a pass, a subscription or a pack',
      ),
  })
  .describe('When the user views the payment module');

export const bookingConfirmedEventSchema = z
  .object({
    eventType: z.string().default('booking_confirmed'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe(
        'The unique identifier for the activity (group activity, workshop or appointment)',
      ),
    activity_name: z
      .string()
      .describe(
        'The name of the activity (group activity, workshop or appointment)',
      ),
    session_type: z
      .enum(sessionTypeValues)
      .describe('The type of session being booked'),
  })
  .describe('When the user successfully completes a booking');

export const bookingCancelledEventSchema = z
  .object({
    eventType: z.string().default('booking_cancelled'),
    offer_id: z.number().describe('The unique identifier for the session'),
    activity_id: z
      .number()
      .describe(
        'The unique identifier for the activity (group activity, workshop or appointment)',
      ),
    activity_name: z
      .string()
      .describe(
        'The name of the activity (group activity, workshop or appointment)',
      ),
    session_type: z
      .enum(sessionTypeValues)
      .describe('The type of session being cancelled'),
  })
  .describe('When the user successfully completes a booking cancellation');

export const barcodeScanToggledEventSchema = z
  .object({
    eventType: z.string().default('barcode_scan_toggled'),
  })
  .describe(
    'When a user toggles the barcode scanner on/off during tablet check-in',
  );

export const barcodeScanSuccessEventSchema = z
  .object({
    eventType: z.string().default('barcode_scan_success'),
    member_id: z
      .number()
      .describe('The unique identifier of the member found via barcode scan'),
    barcode: z.string().describe('The scanned barcode value'),
  })
  .describe(
    'When a barcode scan successfully identifies a member during tablet check-in',
  );

export const tabletCheckInSignUpStartedEventSchema = z
  .object({
    eventType: z.string().default('tablet_check_in_sign_up_started'),
  })
  .describe(
    'When a user starts the sign-up process during tablet check-in by clicking the Create Member button',
  );

export const tabletCheckInSessionClickedEventSchema = z
  .object({
    eventType: z.string().default('tablet_check_in_session_clicked'),
    nb_attendants: z.number().describe('The number of attendants to check in'),
    nb_bookings: z.number().describe('The number of bookings for the session'),
    nb_non_attendants: z
      .number()
      .describe('The number of non-attendants for the session'),
    offer_id: z.number().describe('The unique identifier for the session'),
  })
  .describe(
    'When the user clicks on a session from the session management page',
  );

export const tabletCheckInCheckinButtonClickedEventSchema = z
  .object({
    eventType: z.string().default('tablet_check_in_checkin_button_clicked'),
    offer_id: z.number().describe('The unique identifier for the session'),
  })
  .describe(
    'When the user clicks on the check-in button from the session management page',
  );
