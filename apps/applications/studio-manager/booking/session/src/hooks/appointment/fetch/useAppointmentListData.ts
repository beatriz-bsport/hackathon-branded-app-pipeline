import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  PRIVATE_BOOKING_STALE_TIME,
  type PrivateBooking,
  type PrivateBookingFilterParams,
  PrivateBookingStatusCode,
  type PrivateConsumerPass,
  fetchPrivateBookingsAPI,
  privateBookingKeys,
} from "@bsport/api-book";
import type { Establishment, Teacher } from "@bsport/api-book";
import type { Member } from "@bsport/api-cdp/member";
import type { DateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { getAppointmentParamsFromFilters } from "#src/components/AppointmentList/Filters/get-appointment-params-from-filters";
import {
  selectAppointmentFilters,
  selectAppointmentShowCancelled,
  useCalendarStore,
} from "#src/stores/calendar";
import type { EnrichedAppointment } from "#src/types";
import { extractDateRangeParams } from "#src/utils/extract-date-range-params";
import { fetch } from "#src/utils/fetch";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";

import { useFetchEstablishments } from "../../useFetchEstablishments";
import { useFetchTeachers } from "../../useFetchTeachers";
import { useFetchMembersByIds } from "./useFetchMembersByIds";
import { useFetchPrivateConsumerPasses } from "./useFetchPrivateConsumerPasses";

const APPOINTMENTS_PAGE_SIZE = 1000;

const processAppointment =
  (
    teachersById: Record<number, Teacher>,
    establishmentsById: Record<number, Establishment>,
    membersById: Record<number, Member>,
    consumerPassesById: Record<number, PrivateConsumerPass>,
  ) =>
  (booking: PrivateBooking): EnrichedAppointment => {
    const teacher = teachersById[booking.coach];
    const establishment = establishmentsById[booking.establishment];
    const member = membersById[booking.member];
    const consumerPass =
      booking.private_consumer_pass !== null
        ? consumerPassesById[booking.private_consumer_pass]
        : undefined;

    const teacherInitials = getTeacherInitials({
      teacher: teacher ?? null,
      teacherOverride: null,
    });

    return {
      ...booking,
      teacherName: teacher?.name ?? "",
      teacherAvatar: teacher?.photo ?? null,
      teacherInitials,
      participantName: member?.name ?? "",
      isUnpaid: booking.is_unpaid,
      passUsedName: consumerPass?.private_pass?.name ?? "",
      establishmentName: establishment?.title ?? "",
      isRecurring: booking.recurrence_rule_private_booking !== null,
      isCancelled: booking.booking_status_code !== PrivateBookingStatusCode.OK,
    };
  };

const extractRelatedIds = (bookings: PrivateBooking[]) => {
  const teacherIds = new Set<number>();
  const establishmentIds = new Set<number>();
  const memberIds = new Set<number>();
  const consumerPassIds = new Set<number>();

  bookings.forEach((booking) => {
    teacherIds.add(booking.coach);
    establishmentIds.add(booking.establishment);
    memberIds.add(booking.member);
    if (booking.private_consumer_pass) {
      consumerPassIds.add(booking.private_consumer_pass);
    }
  });

  return {
    teacherIds: Array.from(teacherIds),
    establishmentIds: Array.from(establishmentIds),
    memberIds: Array.from(memberIds),
    consumerPassIds: Array.from(consumerPassIds),
  };
};

const appointmentsQueryOptions = (
  minDateKey: string | null,
  maxDateKey: string | null,
  filterParams: PrivateBookingFilterParams,
  showCancelled: boolean,
) => {
  const params: PrivateBookingFilterParams = {
    ...filterParams,
    date_start__gte: minDateKey ?? undefined,
    date_start__lte: maxDateKey ?? undefined,
    page_size: APPOINTMENTS_PAGE_SIZE,
    ordering: "date_start",
    ...(!showCancelled && {
      booking_status_code__in: [PrivateBookingStatusCode.OK],
    }),
  };

  return queryOptions({
    queryKey: privateBookingKeys.list(params),
    queryFn: async () => {
      if (!params.date_start__gte || !params.date_start__lte) {
        return [];
      }

      const response = await fetchPrivateBookingsAPI(fetch, params);
      return response.results;
    },
    staleTime: PRIVATE_BOOKING_STALE_TIME,
  });
};

export const useAppointmentListData = (
  params: { date: DateTime } | { minDate: DateTime; maxDate: DateTime } | null,
  enabled = true,
) => {
  const { minDateKey, maxDateKey } = extractDateRangeParams(params);

  const filters = useCalendarStore(selectAppointmentFilters);
  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();
  const filterParams = useMemo(() => {
    const params = getAppointmentParamsFromFilters(filters);
    // Enforce restricted teacher access. An active teacher filter already only
    // offers allowed teachers, so don't overwrite it — only constrain to the
    // full restricted set when the user hasn't narrowed it down themselves.
    if (restrictedTeachers.length > 0 && params.coach__in === undefined) {
      params.coach__in = restrictedTeachers;
    }
    return params;
  }, [filters, restrictedTeachers]);

  const showCancelled = useCalendarStore(selectAppointmentShowCancelled);

  const {
    data: rawBookings = [],
    isLoading: isLoadingBookings,
    error,
  } = useQuery({
    ...appointmentsQueryOptions(
      minDateKey,
      maxDateKey,
      filterParams,
      showCancelled,
    ),
    enabled: enabled && !!minDateKey && !!maxDateKey,
  });

  const { teacherIds, establishmentIds, memberIds, consumerPassIds } = useMemo(
    () => extractRelatedIds(rawBookings),
    [rawBookings],
  );

  const shouldFetchAppointmentData = enabled && !isLoadingBookings;

  const { data: teachersById = {}, isLoading: isLoadingTeachers } =
    useFetchTeachers(teacherIds, shouldFetchAppointmentData);
  const { data: establishmentsById = {}, isLoading: isLoadingEstablishments } =
    useFetchEstablishments(establishmentIds, shouldFetchAppointmentData);
  const { data: membersById = {}, isLoading: isLoadingMembers } =
    useFetchMembersByIds(memberIds, shouldFetchAppointmentData);
  const { data: consumerPassesById = {}, isLoading: isLoadingPasses } =
    useFetchPrivateConsumerPasses(consumerPassIds, shouldFetchAppointmentData);

  const appointments = useMemo(() => {
    return rawBookings.map(
      processAppointment(
        teachersById as Record<number, Teacher>,
        establishmentsById as Record<number, Establishment>,
        membersById as Record<number, Member>,
        consumerPassesById as Record<number, PrivateConsumerPass>,
      ),
    );
  }, [
    rawBookings,
    teachersById,
    establishmentsById,
    membersById,
    consumerPassesById,
  ]);

  return {
    appointments,
    isLoading:
      isLoadingBookings ||
      isLoadingTeachers ||
      isLoadingEstablishments ||
      isLoadingMembers ||
      isLoadingPasses,
    error,
  };
};
