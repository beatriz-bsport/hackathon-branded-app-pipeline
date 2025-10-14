import { buildById } from "@bsport/store-base";

import { appointmentPassStore } from "#src/store";
import type { AppointmentPass, AppointmentPassCategory } from "#src/types";

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

export const setAppointmentPassCategories = ({
  categories,
  count,
  page,
}: {
  categories: AppointmentPassCategory[];
  count: number;
  page: number;
}) => {
  appointmentPassStore.setState((state) => {
    if (!categories) return state;

    const sanitizedCategories = categories.filter(
      (item) => item.id !== null && item.id !== undefined,
    );

    return {
      categories: {
        byId: buildById<AppointmentPassCategory>({
          initial: state.categories.byId,
          newItems: sanitizedCategories,
        }),
        ids: sanitizedCategories.map((category) => category.id),
        count,
        page,
      },
    };
  });
};
