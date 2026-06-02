import type { AppointmentPass } from "@bsport/api-buyables/appointment-pass";

import type { PassOption } from "#src/components/filters/passes-filter/types";

/**
 * Maps an appointment pass API row into the shared pass picker option shape.
 */
export const mapAppointmentPassToPassOption = (
  appointmentPass: AppointmentPass,
): PassOption => ({
  id: appointmentPass.id,
  name: appointmentPass.name,
  credits: appointmentPass.credits,
  price: Number.parseFloat(appointmentPass.price) || 0,
});
