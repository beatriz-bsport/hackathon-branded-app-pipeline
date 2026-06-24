import { type UseQueryOptions, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type Establishment,
  type PaginatedFetchSessionsParams,
  type Session,
  type Teacher,
} from "@bsport/api-book";
import { type PaginationProps, Table } from "@bsport/kaizen-primitive-core";
import type { PaginatedResponse } from "@bsport/store-base";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import {
  type OccurrenceRow as SeriesClassRow,
  buildOccurrenceColumns as buildSeriesClassColumns,
} from "#src/components/session-occurrence-table/columns";
import {
  type StatusFilter,
  mapStatusFilterToParams,
} from "#src/components/session-occurrence-table/status-filter-mapping";
import { allEstablishmentsQueryOptions } from "#src/hooks/use-fetch-establishments";
import { allTeachersQueryOptions } from "#src/hooks/use-fetch-teachers";
import { useOccurrenceTableLabels as useSeriesClassesTableLabels } from "#src/hooks/use-occurrence-table-labels";
import { resolveBookingsManagementRevampPath } from "#src/urls";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

type SeriesClassesTableProps<TQueryKey extends readonly unknown[]> = {
  companyId: number;
  status: StatusFilter | null;
  paginationNamespace: string;
  getQueryOptions: (
    params: PaginatedFetchSessionsParams,
  ) => UseQueryOptions<
    PaginatedResponse<Session>,
    Error,
    PaginatedResponse<Session>,
    TQueryKey
  >;
};

type SeriesClassesQueryResults = [
  { data?: PaginatedResponse<Session>; isLoading: boolean },
  { data?: Teacher[]; isLoading: boolean },
  { data?: Establishment[]; isLoading: boolean },
];

const EMPTY_SESSIONS: Session[] = [];
const EMPTY_TEACHERS: Teacher[] = [];
const EMPTY_ESTABLISHMENTS: Establishment[] = [];

const combineSeriesClassesQueries = ([
  sessionsQuery,
  teachersQuery,
  establishmentsQuery,
]: SeriesClassesQueryResults) => ({
  establishments: establishmentsQuery.data ?? EMPTY_ESTABLISHMENTS,
  isLoading:
    sessionsQuery.isLoading ||
    teachersQuery.isLoading ||
    establishmentsQuery.isLoading,
  sessions: sessionsQuery.data?.results ?? EMPTY_SESSIONS,
  teachers: teachersQuery.data ?? EMPTY_TEACHERS,
  totalItems: sessionsQuery.data?.count ?? 0,
});

export const SeriesClassesTable = <TQueryKey extends readonly unknown[]>({
  companyId,
  status,
  paginationNamespace,
  getQueryOptions,
}: SeriesClassesTableProps<TQueryKey>) => {
  const { t, i18n } = useTranslation("sessionManagement");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: paginationNamespace });

  const { establishments, isLoading, sessions, teachers, totalItems } =
    useQueries({
      queries: [
        getQueryOptions({
          page: currentPage,
          page_size: currentPageSize,
          ...mapStatusFilterToParams(status),
        }),
        allTeachersQueryOptions({ company: companyId }),
        allEstablishmentsQueryOptions({
          company: companyId,
          enabled: true,
          page_size: 1000,
        }),
      ],
      combine: combineSeriesClassesQueries,
    });

  const teachersById = useMemo(() => {
    const teachersMap = new Map<number, Teacher>();
    teachers.forEach((teacher) => teachersMap.set(teacher.id, teacher));
    return teachersMap;
  }, [teachers]);

  const establishmentsById = useMemo(() => {
    const establishmentsMap = new Map<number, Establishment>();
    establishments.forEach((establishment) =>
      establishmentsMap.set(establishment.id, establishment),
    );
    return establishmentsMap;
  }, [establishments]);

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      disabled: isLoading,
      totalItems,
      showRowsPerPageSelector: true,
      onPageSettingsChange: setPageSettings,
    }),
    [currentPage, currentPageSize, isLoading, totalItems, setPageSettings],
  );

  const classTableLabels = useSeriesClassesTableLabels();

  const columns = useMemo(
    () =>
      buildSeriesClassColumns(
        {
          date: classTableLabels.date,
          time: classTableLabels.time,
          participants: classTableLabels.participants,
          teacher: classTableLabels.teacher,
          establishment: classTableLabels.establishment,
          status: classTableLabels.status,
          statusUpcoming: t("pageTabs.statusFilter.upcoming"),
          statusOngoing: t("pageTabs.statusFilter.ongoing"),
          statusPast: t("pageTabs.statusFilter.past"),
          statusCancelled: t("pageTabs.statusFilter.cancelled"),
        },
        i18n.language,
      ),
    [t, i18n.language, classTableLabels],
  );

  const rows: SeriesClassRow[] = useMemo(
    () =>
      sessions.map((session) => {
        const displayedTeacher = teachersById.get(
          session.coach_override ?? session.coach,
        );
        const originalTeacher = teachersById.get(session.coach);
        const establishment = establishmentsById.get(session.establishment);

        return {
          id: session.id,
          date_start: session.date_start,
          duration_minute: session.duration_minute,
          timezone_name: session.timezone_name,
          validated_booking_count: session.validated_booking_count,
          effectif: session.effectif,
          nb_option: session.nb_option,
          waiting_list_max_size: session.waiting_list_max_size,
          coach: session.coach,
          coach_override: session.coach_override,
          establishment: session.establishment,
          available: session.available,
          teacherName: displayedTeacher?.name,
          originalTeacherName: session.coach_override
            ? originalTeacher?.name
            : undefined,
          teacherAvatar: displayedTeacher?.photo ?? undefined,
          teacherInitials: getTeacherInitials({
            teacher: originalTeacher,
            teacherOverride: session.coach_override ? displayedTeacher : null,
          }),
          establishmentName: establishment?.title,
          detailUrl: resolveBookingsManagementRevampPath(session.id),
        };
      }),
    [sessions, teachersById, establishmentsById],
  );

  return (
    <Table
      columns={columns}
      rowHeight="lg"
      rows={rows.map((row) => ({
        ...row,
        onRowClick: () => {
          window.open(row.detailUrl, "_blank", "noopener,noreferrer");
        },
      }))}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !isLoading && rows.length === 0,
        emptyConfig: { title: classTableLabels.empty },
      }}
    />
  );
};
