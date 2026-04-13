import { isEmpty } from "lodash";
import groupBy from "lodash/groupBy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import {
  ErrorFallback,
  ListLayout,
  useEmptyState,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import AppointmentDay from "#src/components/AppointmentList/AppointmentDay";
import { CancelMultipleSessionsModal } from "#src/components/SessionList/actions/cancel-multiple-sessions-modal";
import { ExportParticipantsModal } from "#src/components/SessionList/actions/export-participants-modal";
import { CancelSessionModal } from "#src/components/SessionList/detail-actions/cancel-session-modal";
import { DeleteSessionModal } from "#src/components/SessionList/detail-actions/delete-session-modal";
import { DuplicateSessionModal } from "#src/components/SessionList/detail-actions/duplicate-session-modal";
import { RestoreSessionModal } from "#src/components/SessionList/detail-actions/restore-session-modal";
import { MoreActionsButton } from "#src/components/SessionList/more-actions-button";
import { SearchClearSource } from "#src/events/constants";
import { useTrackSessionListViewed } from "#src/events/hooks/use-track-session-list-viewed";
import { sessionCreationOpensEvent } from "#src/events/session-creation/events";
import {
  sessionListSearchChangedEvent,
  sessionListSearchClearedEvent,
} from "#src/events/session-list/events";
import { useAppointmentListData } from "#src/hooks/appointment/fetch/useAppointmentListData";
import { useSearchAppointments } from "#src/hooks/appointment/fetch/useSearchAppointments";
import { useModal } from "#src/hooks/use-modal";
import type { CalendarTab } from "#src/types";
import { ModalType } from "#src/types";
import { flags, useBookingManagementFlag } from "#src/urls";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";
import { useAnyObjectLevelPermissions } from "#src/utils/permission";

import { DateNavigationHeader } from "../components/SessionList/DateNavigationHeader";
import { useFilterConfig } from "../components/SessionList/Filters/useFilterConfig";
import SessionDay from "../components/SessionList/SessionDay";
import { DisplaySettings } from "../components/shared/DisplaySettings";
import { useSearchSessions } from "../hooks/useSearchSessions";
import { useSessionListData } from "../hooks/useSessionListData";
import {
  closeModal,
  selectModalState,
  selectSelectedDate,
  selectSessionFilters,
  setLocale,
  useCalendarStore,
} from "../stores/calendar";
import { getDateStartKey } from "../utils/get-date-start-key";

const VALID_TABS: CalendarTab[] = ["classes", "appointments"];

const getActiveTab = (tabParam: string | null): CalendarTab =>
  VALID_TABS.includes(tabParam as CalendarTab)
    ? (tabParam as CalendarTab)
    : "classes";

export const DEFAULT_DEBOUNCE_DELAY = 200;

const CalendarPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const showAppointmentsTab = useBookingManagementFlag(
    flags.CALENDAR_APPOINTMENTS_TAB,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = showAppointmentsTab
    ? getActiveTab(searchParams.get("tab"))
    : "classes";

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchQuery("");
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const isClassesTab = activeTab === "classes";

  const selectedDate = useCalendarStore(selectSelectedDate);
  const detailsModalState = useCalendarStore(selectModalState);

  const [searchQuery, setSearchQuery] = useState("");

  const hasCreateSessionPermission = useAnyObjectLevelPermissions([
    "session.activity.allowed_actions.create",
    "session.workshop.allowed_actions.create",
  ]);

  const {
    isOpen: addSessionModalOpen,
    open: openAddSessionModal,
    close: closeAddSessionModal,
  } = useModal();
  const {
    isOpen: exportParticipantsModalOpen,
    open: openExportParticipantsModal,
    close: closeExportParticipantsModal,
  } = useModal();
  const {
    isOpen: cancelMultipleSessionsModal,
    open: openCancelMultipleSessionsModal,
    close: closeCancelMultipleSessionsModal,
  } = useModal();

  useEffect(() => {
    if (intlLocale) {
      setLocale(intlLocale);
    }
  }, [intlLocale]);

  // Determine fetch params based on selected date type
  const fetchParams =
    selectedDate.type === "single"
      ? { date: selectedDate.date }
      : selectedDate.minDate && selectedDate.maxDate
        ? { minDate: selectedDate.minDate, maxDate: selectedDate.maxDate }
        : null;

  const isAppointmentsTab = !isClassesTab;

  const {
    sessions,
    isLoading,
    error: sessionDataError,
  } = useSessionListData(fetchParams, isClassesTab);

  const {
    appointments,
    isLoading: isLoadingAppointments,
    error: appointmentDataError,
  } = useAppointmentListData(fetchParams, isAppointmentsTab);

  const filteredSessions = useSearchSessions(sessions, searchQuery);
  const filteredAppointments = useSearchAppointments(
    appointments,
    isAppointmentsTab ? searchQuery : "",
  );

  const sessionsByDate = useMemo(
    () => groupBy(filteredSessions, getDateStartKey),
    [filteredSessions],
  );

  const appointmentsByDate = useMemo(
    () => groupBy(filteredAppointments, getDateStartKey),
    [filteredAppointments],
  );

  const displaySettings = useCallback(
    () => <DisplaySettings activeTab={activeTab} />,
    [activeTab],
  );
  const endGroupActions = useMemo(() => {
    if (!isClassesTab) return undefined;
    return [
      <MoreActionsButton
        key="more-actions"
        onParticipantsExport={openExportParticipantsModal}
        onCancelMultipleSessions={openCancelMultipleSessionsModal}
      />,
    ];
  }, [
    isClassesTab,
    openExportParticipantsModal,
    openCancelMultipleSessionsModal,
  ]);

  const { filterConfig, resetFilters, sessionFiltersRef } = useFilterConfig();

  const filters = useCalendarStore(selectSessionFilters);
  const hasEmptyResults =
    !isLoading && !sessionDataError && Object.keys(sessionsByDate).length === 0;

  const onClickEmptySearchState = useCallback(() => {
    analyticsTrackSafeEvent(sessionListSearchClearedEvent, {
      search_value: searchQuery,
      source: SearchClearSource.CLEAR_FILTERS,
    });
    setSearchQuery("");
    resetFilters?.();
  }, [resetFilters, searchQuery]);

  const onClickAddSession = useCallback(() => {
    openAddSessionModal();
    analyticsTrackSafeEvent(sessionCreationOpensEvent, {});
  }, [openAddSessionModal]);

  // Tracks the display settings on Mixpanel when the user lands on the page.
  useTrackSessionListViewed();

  const isFilterEmpty = useMemo(() => {
    return (
      isEmpty(filters) ||
      Object.values(filters).every((filterValue) => {
        return (
          filterValue.field === null &&
          filterValue.filter === null &&
          filterValue.valueIds.length === 0
        );
      })
    );
  }, [filters]);

  const { shouldRenderEmptyState, EmptyState } = useEmptyState({
    isEmpty: hasEmptyResults,
    emptyConfig: {
      title: t("emptyState.title"),
      subtitle: t("emptyState.subtitle"),
      ctaButtonConfig: hasCreateSessionPermission
        ? {
            label: t("addSession"),
            onClick: onClickAddSession,
            iconLeft: "plus",
            intent: "call-to-action",
            color: "main",
          }
        : undefined,
    },
    isEmptySearch:
      hasEmptyResults && (!isFilterEmpty || searchQuery.length > 0),
    emptySearchConfig: {
      title: t("emptySearchState.title"),
      subtitle: t("emptySearchState.subtitle"),
      secondaryButtonConfig: {
        label: t("emptySearchState.action"),
        onClick: onClickEmptySearchState,
        iconLeft: "x-close",
        intent: "default",
        color: "main",
      },
    },
  });

  const hasEmptyAppointmentResults =
    !isLoadingAppointments &&
    !appointmentDataError &&
    Object.keys(appointmentsByDate).length === 0;

  const {
    shouldRenderEmptyState: shouldRenderAppointmentEmptyState,
    EmptyState: AppointmentEmptyState,
  } = useEmptyState({
    isEmpty: hasEmptyAppointmentResults,
    emptyConfig: {
      title: t("emptyAppointmentState.title"),
      subtitle: t("emptyAppointmentState.subtitle"),
    },
    isEmptySearch: hasEmptyAppointmentResults && searchQuery.length > 0,
    emptySearchConfig: {
      title: t("emptyAppointmentSearchState.title"),
      subtitle: t("emptyAppointmentSearchState.subtitle"),
      secondaryButtonConfig: {
        label: t("emptyAppointmentSearchState.action"),
        onClick: () => setSearchQuery(""),
        iconLeft: "x-close",
        intent: "default",
        color: "main",
      },
    },
  });

  const {
    shouldRenderLoadingState: shouldRenderAppointmentLoadingState,
    LoadingState: AppointmentLoadingState,
  } = useLoadingState({
    isLoading: isLoadingAppointments,
    message: t("appointmentTable.isLoading"),
  });

  const { shouldRenderLoadingState, LoadingState } = useLoadingState({
    isLoading,
    message: t("table.isLoading"),
  });

  const callToActionButton = useMemo(() => {
    if (!isClassesTab || !hasCreateSessionPermission) return null;
    return (
      <ListLayout.Button
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        label={t("addSession")}
        onClick={onClickAddSession}
      />
    );
  }, [t, onClickAddSession, hasCreateSessionPermission, isClassesTab]);

  const sessionDays = useMemo(
    () =>
      Object.entries(sessionsByDate).map(([date, sessions]) => (
        <SessionDay
          key={date}
          date={date}
          sessions={sessions}
          locale={intlLocale || "en-US"}
        />
      )),
    [sessionsByDate, intlLocale],
  );

  const appointmentDays = useMemo(
    () =>
      Object.entries(appointmentsByDate).map(([date, appointments]) => (
        <AppointmentDay
          key={date}
          date={date}
          appointments={appointments}
          locale={intlLocale || "en-US"}
        />
      )),
    [appointmentsByDate, intlLocale],
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header")}
        onDisplayPopover={displaySettings}
        callToActionButton={callToActionButton}
        filterConfig={isClassesTab ? filterConfig : undefined}
        filterRef={isClassesTab ? sessionFiltersRef : undefined}
        endGroupActions={endGroupActions}
        pageTabs={
          showAppointmentsTab
            ? {
                orientation: "horizontal",
                value: activeTab,
                onValueChange: handleTabChange,
                tabs: [
                  { id: "classes", label: t("tabs.classes") },
                  { id: "appointments", label: t("tabs.appointments") },
                ],
              }
            : undefined
        }
        searchConfig={{
          id: isClassesTab ? "session-search" : "appointment-search",
          inputValue: searchQuery,
          onInputValueChange: (value: string) => {
            if (isClassesTab) {
              analyticsTrackSafeEvent(sessionListSearchChangedEvent, {
                search_value: value,
              });
            }
            setSearchQuery(value);
          },
          debounceValue: DEFAULT_DEBOUNCE_DELAY,
          onClear: () => {
            if (isClassesTab) {
              analyticsTrackSafeEvent(sessionListSearchClearedEvent, {
                search_value: searchQuery,
                source: SearchClearSource.CLEAR_BUTTON,
              });
            }
            setSearchQuery("");
          },
        }}
      />
      <ListLayout.Content>
        <DateNavigationHeader />
        <div className="flex flex-col gap-xl h-full mt-md">
          {isClassesTab ? (
            <>
              {shouldRenderEmptyState ? (
                <EmptyState />
              ) : shouldRenderLoadingState ? (
                <LoadingState />
              ) : sessionDataError ? (
                <div className="flex flex-col items-center justify-center">
                  <ErrorFallback
                    actionProps={ErrorFallback.DEFAULT_ACTION_PROPS}
                  />
                </div>
              ) : (
                sessionDays
              )}
            </>
          ) : (
            <>
              {shouldRenderAppointmentEmptyState ? (
                <AppointmentEmptyState />
              ) : shouldRenderAppointmentLoadingState ? (
                <AppointmentLoadingState />
              ) : appointmentDataError ? (
                <div className="flex flex-col items-center justify-center">
                  <ErrorFallback
                    actionProps={ErrorFallback.DEFAULT_ACTION_PROPS}
                  />
                </div>
              ) : (
                appointmentDays
              )}
            </>
          )}
        </div>

        {isClassesTab && (
          <>
            <AddSessionModal
              isOpen={addSessionModalOpen}
              onClose={closeAddSessionModal}
            />
            <ExportParticipantsModal
              isOpen={exportParticipantsModalOpen}
              onClose={closeExportParticipantsModal}
            />
            <CancelMultipleSessionsModal
              isOpen={cancelMultipleSessionsModal}
              onClose={closeCancelMultipleSessionsModal}
            />
            {detailsModalState?.type === ModalType.CANCEL && (
              <CancelSessionModal
                session={detailsModalState.session}
                isOpen={detailsModalState.type === ModalType.CANCEL}
                onClose={closeModal}
              />
            )}
            {detailsModalState?.type === ModalType.RESTORE && (
              <RestoreSessionModal
                session={detailsModalState.session}
                isOpen={detailsModalState.type === ModalType.RESTORE}
                onClose={closeModal}
              />
            )}
            {detailsModalState?.type === ModalType.DELETE && (
              <DeleteSessionModal session={detailsModalState.session} />
            )}
            {detailsModalState?.type === ModalType.DUPLICATE && (
              <DuplicateSessionModal
                session={detailsModalState.session}
                isOpen={detailsModalState.type === ModalType.DUPLICATE}
                onClose={closeModal}
              />
            )}
          </>
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default CalendarPage;
