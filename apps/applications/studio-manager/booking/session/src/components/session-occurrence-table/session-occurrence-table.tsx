import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useHref, useNavigate } from "react-router";

import {
  type PaginatedFetchSessionsParams,
  type Session,
} from "@bsport/api-book";
import { type PaginationProps, Table } from "@bsport/kaizen-primitive-core";
import type { PaginatedResponse } from "@bsport/store-base";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetchAllEstablishments } from "#src/hooks/use-fetch-establishments";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import { useOccurrenceTableLabels } from "#src/hooks/use-occurrence-table-labels";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

import { type OccurrenceRow, buildOccurrenceColumns } from "./columns";
import {
  type StatusFilter,
  mapStatusFilterToParams,
} from "./status-filter-mapping";

type SessionOccurrenceTableProps<TQueryKey extends readonly unknown[]> = {
  companyId: number;
  status: StatusFilter | null;
  /** Pagination query-param namespace; must match the page's own namespace. */
  paginationNamespace: string;
  /**
   * Builds the paginated-sessions query for the current page. The page owns the
   * data source (by group vs. by recurrence); the table owns pagination/status.
   * Generic over the query key so each page's `queryOptions(...)` (which brands
   * a distinct key tuple) stays assignable without widening to `unknown[]`.
   */
  getQueryOptions: (
    params: PaginatedFetchSessionsParams,
  ) => UseQueryOptions<
    PaginatedResponse<Session>,
    Error,
    PaginatedResponse<Session>,
    TQueryKey
  >;
  currentSessionId?: number;
  getSessionPath?: (sessionId: number) => string;
};

/**
 * Paginated, status-filtered table of session occurrences scoped to a
 * recurrence.
 */
export const SessionOccurrenceTable = <TQueryKey extends readonly unknown[]>({
  companyId,
  status,
  paginationNamespace,
  getQueryOptions,
  currentSessionId,
  getSessionPath,
}: SessionOccurrenceTableProps<TQueryKey>) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const parentPath = useHref("..");
  const navigate = useNavigate();

  // Page reset on status change is handled by the filter's onChange in the page,
  // since that's where the status state lives (the filter renders in the header).
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: paginationNamespace });

  const { data, isLoading } = useQuery(
    getQueryOptions({
      page: currentPage,
      page_size: currentPageSize,
      ...mapStatusFilterToParams(status),
    }),
  );

  const sessions = useMemo(() => data?.results ?? [], [data]);

  const { data: teachers } = useFetchTeachers({ company: companyId });
  const { data: establishments } = useFetchAllEstablishments({
    company: companyId,
  });

  const teachersById = useMemo(() => {
    const map = new Map<number, NonNullable<typeof teachers>[number]>();
    (teachers ?? []).forEach((teacher) => map.set(teacher.id, teacher));
    return map;
  }, [teachers]);

  const establishmentsById = useMemo(() => {
    const map = new Map<number, NonNullable<typeof establishments>[number]>();
    (establishments ?? []).forEach((est) => map.set(est.id, est));
    return map;
  }, [establishments]);

  const rows: OccurrenceRow[] = useMemo(
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
          detailPath: getSessionPath?.(session.id),
          detailUrl: getSessionPath ? undefined : `${parentPath}/${session.id}`,
          isCurrentSession: currentSessionId === session.id,
        };
      }),
    [
      sessions,
      teachersById,
      establishmentsById,
      getSessionPath,
      parentPath,
      currentSessionId,
    ],
  );

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      disabled: isLoading,
      totalItems: data?.count ?? 0,
      showRowsPerPageSelector: true,
      onPageSettingsChange: setPageSettings,
    }),
    [currentPage, currentPageSize, isLoading, data?.count, setPageSettings],
  );

  const labels = useOccurrenceTableLabels();

  const columns = useMemo(
    () =>
      buildOccurrenceColumns(
        {
          date: labels.date,
          time: labels.time,
          participants: labels.participants,
          teacher: labels.teacher,
          establishment: labels.establishment,
          status: labels.status,
          statusUpcoming: t("pageTabs.statusFilter.upcoming"),
          statusOngoing: t("pageTabs.statusFilter.ongoing"),
          statusPast: t("pageTabs.statusFilter.past"),
          statusCancelled: t("pageTabs.statusFilter.cancelled"),
          thisClass: labels.thisClass,
        },
        i18n.language,
      ),
    [t, i18n.language, labels],
  );

  return (
    <Table
      columns={columns}
      rowHeight="lg"
      rows={rows.map((row) => {
        const detailPath = row.detailPath;
        const detailUrl = row.detailUrl;
        const onRowClick =
          row.isCurrentSession || (!detailPath && !detailUrl)
            ? undefined
            : () => {
                if (detailPath) {
                  navigate(detailPath);
                  return;
                }
                if (detailUrl) {
                  window.open(detailUrl, "_blank", "noopener,noreferrer");
                }
              };

        return {
          ...row,
          onRowClick,
        };
      })}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !isLoading && rows.length === 0,
        emptyConfig: { title: labels.empty },
      }}
    />
  );
};
