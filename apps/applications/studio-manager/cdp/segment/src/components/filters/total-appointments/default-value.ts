import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "./constants";
import type { TotalAppointmentsNumberFilterFormValue } from "./types";

/**
 * Default form state for a new total appointments filter row (matches contract POST defaults).
 */
export const createDefaultTotalAppointmentsNumberFilter = (
  smartlistId: number,
): TotalAppointmentsNumberFilterFormValue => ({
  smartlist: smartlistId,
  type: TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
  value: 0,
  secondValue: null,
});
