import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
  TOTAL_APPOINTMENTS_NUMBER_TYPE,
} from "./constants";
import type { TotalAppointmentsNumberFilterFormValue } from "./types";

export const DEFAULT_APPOINTMENTS_NUMBER_FIRST_VALUE = 1;
export const DEFAULT_APPOINTMENTS_NUMBER_SECOND_VALUE =
  DEFAULT_APPOINTMENTS_NUMBER_FIRST_VALUE + 1;

/**
 * Default form state for a new total appointments filter row (matches contract POST defaults).
 */
export const createDefaultTotalAppointmentsNumberFilter = (
  smartlistId: number,
): TotalAppointmentsNumberFilterFormValue => ({
  smartlist: smartlistId,
  type: TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
  value: DEFAULT_APPOINTMENTS_NUMBER_FIRST_VALUE,
  secondValue: DEFAULT_APPOINTMENTS_NUMBER_SECOND_VALUE,
  subFilters: [],
  bookingDate: createDefaultDateFilterValue(),
  bookingHourRange: {
    hour: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
    hourSecond: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
  },
  coach: {
    selectAllCoaches: false,
    selectedCoachIds: [],
  },
  establishment: {
    selectAllEstablishments: false,
    selectedEstablishmentIds: [],
    atHome: false,
  },
  appointmentPass: {
    selectAllAppointmentPasses: false,
    selectedAppointmentPassIds: [],
  },
  appointment: {
    selectAllAppointments: false,
    selectedAppointmentIds: [],
  },
});
