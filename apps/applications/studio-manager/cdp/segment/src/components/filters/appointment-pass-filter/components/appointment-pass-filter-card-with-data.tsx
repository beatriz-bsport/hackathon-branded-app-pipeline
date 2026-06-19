import type { AppointmentPass } from "@bsport/api-buyables/appointment-pass";

import { useAppointmentPassesQuery } from "#src/api/use-appointment-passes-query";
import type { PassOption } from "#src/components/filters/passes-filter/types";

import type { AppointmentPassFilterCardProps } from "../types";
import { AppointmentPassFilterCard } from "./appointment-pass-filter-card";

type AppointmentPassFilterCardWithDataProps = Omit<
  AppointmentPassFilterCardProps,
  "passOptions"
>;

const mapAppointmentPassToPassOption = (
  appointmentPass: AppointmentPass,
): PassOption => ({
  id: appointmentPass.id,
  name: appointmentPass.name,
  credits: appointmentPass.credits,
  price: Number.parseFloat(appointmentPass.price) || 0,
});

/**
 * Loads appointment pass catalog options and renders {@link AppointmentPassFilterCard}.
 */
export const AppointmentPassFilterCardWithData = ({
  smartlistId,
  filterValue,
  cleanDraftComponent,
}: AppointmentPassFilterCardWithDataProps) => {
  const { data } = useAppointmentPassesQuery("");
  const passOptions = (data?.results ?? []).map(mapAppointmentPassToPassOption);

  return (
    <AppointmentPassFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      passOptions={passOptions}
      cleanDraftComponent={cleanDraftComponent}
    />
  );
};
