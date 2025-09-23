import { buildById } from "@bsport/store-base";

import { appointmentStore } from "#src/store";
import type { Appointment } from "#src/types";

export const setAppointments = ({
  appointments,
  count,
  page,
}: {
  appointments: Appointment[];
  count: number;
  page: number;
}) => {
  appointmentStore.setState((state) => {
    if (!appointments) return state;
    const sanitizedAppointments = appointments.filter(Boolean);

    return {
      byId: buildById<Appointment>({
        initial: state.byId,
        newItems: sanitizedAppointments,
      }),
      list: {
        ids: sanitizedAppointments.map((model) => model.id),
        count,
        page,
      },
    };
  });
};

export const setSearchedAppointments = ({
  appointments,
  count,
  page,
}: {
  appointments: Appointment[];
  count: number;
  page: number;
}) => {
  appointmentStore.setState((state) => {
    if (!appointments) return state;
    const sanitizedAppointments = appointments.filter(Boolean);

    return {
      byId: buildById<Appointment>({
        initial: state.byId,
        newItems: sanitizedAppointments,
      }),
      search: {
        ids: sanitizedAppointments.map((model) => model.id),
        count,
        page,
      },
    };
  });
};
