import {
  type SearchAppointmentParams,
  fetchAppointmentsAction,
  searchAppointmentsAction,
} from "@bsport/store-booking-appointment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchAppointmentsBound = fetchAppointmentsAction.bind(null, fetch);

export const useFetchAppointments = () => {
  const [{ isLoading: isAppointmentsLoading }, fetchAppointments] = useAsync<
    typeof fetchAppointmentsBound
  >({
    asyncFn: fetchAppointmentsBound,
  });

  const handleSearchAppointments = async (
    query: string,
    params?: SearchAppointmentParams,
  ) => {
    return await searchAppointmentsAction(fetch, {
      q: query,
      ...params,
    });
  };

  return {
    handleFetchAppointments: fetchAppointments,
    handleSearchAppointments,
    isAppointmentsLoading,
  };
};
