import { useQuery } from "@tanstack/react-query";
import { type FC, useMemo } from "react";
import { useHref } from "react-router";

import { fetchSessionsByRecurrenceIdQueryOptions } from "@bsport/api-book";
import { type PaginationProps, Table } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetchAllEstablishments } from "#src/hooks/use-fetch-establishments";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import { fetch } from "#src/utils/fetch";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

import { type AllOccurrencesRow, buildAllOccurrencesColumns } from "./columns";
import {
  type StatusFilter,
  mapStatusFilterToParams,
} from "./status-filter-mapping";

export const AllOccurrencesTable: FC<{
  recurrenceId: string;
  companyId: number;
  status: StatusFilter | null;
}> = ({ recurrenceId, companyId, status }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  // `window.open` and raw <a href> resolve relative URLs against
  // `window.location`, not React Router's route tree. We need the full href
  // INCLUDING the router basename so the browser navigates to the right place
  // in any environment. `useHref` returns the basename-prefixed URL.
  const parentPath = useHref("..");

  // Page reset on status change is handled by the filter's onChange in the page,
  // since that's where the status state lives (the filter renders in the header).
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({ namespace: `occurrences-${recurrenceId}` });

  const { data, isLoading } = useQuery(
    fetchSessionsByRecurrenceIdQueryOptions(fetch, recurrenceId, {
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

  const rows: AllOccurrencesRow[] = useMemo(
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
          detailUrl: `${parentPath}/${session.id}`,
        };
      }),
    [sessions, teachersById, establishmentsById, parentPath],
  );

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      disabled: isLoading,
      totalItems: data?.count ?? 0,
      onPageSettingsChange: setPageSettings,
    }),
    [currentPage, currentPageSize, isLoading, data?.count, setPageSettings],
  );

  const columns = useMemo(
    () =>
      buildAllOccurrencesColumns(
        {
          date: t("pageTabs.allOccurrencesTable.date"),
          time: t("pageTabs.allOccurrencesTable.time"),
          participants: t("pageTabs.allOccurrencesTable.participants"),
          teacher: t("pageTabs.allOccurrencesTable.teacher"),
          establishment: t("pageTabs.allOccurrencesTable.establishment"),
          status: t("pageTabs.allOccurrencesTable.status"),
          statusUpcoming: t("pageTabs.statusFilter.upcoming"),
          statusOngoing: t("pageTabs.statusFilter.ongoing"),
          statusPast: t("pageTabs.statusFilter.past"),
          statusCancelled: t("pageTabs.statusFilter.cancelled"),
          openSession: t("pageTabs.allOccurrencesTable.openSession"),
        },
        i18n.language,
      ),
    [t, i18n.language],
  );

  return (
    <Table
      // Inset the first column by `md` to align with the header; dividers stay edge-to-edge.
      className="cursor-pointer [&_.table-row>.table-cell:first-child]:pl-md"
      columns={columns}
      rowHeight="sm"
      rows={rows.map((row) => ({
        ...row,
        onRowClick: () => {
          window.open(row.detailUrl, "_blank", "noopener,noreferrer");
        },
      }))}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !isLoading && rows.length === 0,
        emptyConfig: { title: t("pageTabs.allOccurrencesTable.empty") },
      }}
    />
  );
};
