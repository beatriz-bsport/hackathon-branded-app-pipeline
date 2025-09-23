import { buildById } from "@bsport/store-base";

import { appointmentPassStore } from "#src/store";
import type { AppointmentPass } from "#src/types";

export const setPaginatedAppointmentPassesList = ({
  appointmentPasses,
  count,
  page,
}: {
  appointmentPasses: AppointmentPass[];
  count: number;
  page: number;
}) => {
  appointmentPassStore.setState((state) => {
    const sanitizedPasses = appointmentPasses.filter(Boolean);

    const newIds = sanitizedPasses.map((pass) => pass.id);

    return {
      byId: buildById<AppointmentPass>({
        initial: state.byId,
        newItems: sanitizedPasses,
      }),
      list: {
        ids: newIds,
        count,
        page,
      },
    };
  });
};

export const setSearchedAppointmentPasses = ({
  appointmentPasses,
  count,
  page,
}: {
  appointmentPasses: AppointmentPass[];
  count: number;
  page: number;
}) => {
  appointmentPassStore.setState((state) => {
    const sanitizedPasses = appointmentPasses.filter(Boolean);

    const newIds = sanitizedPasses.map((pass) => pass.id);

    return {
      byId: buildById<AppointmentPass>({
        initial: state.byId,
        newItems: sanitizedPasses,
      }),
      search: {
        ids: newIds,
        count,
        page,
      },
    };
  });
};
