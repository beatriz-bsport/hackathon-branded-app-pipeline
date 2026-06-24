import { isEmpty } from "lodash";
import groupBy from "lodash/groupBy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import {
  Alert,
  ErrorFallback,
  ListLayout,
  useEmptyState,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import AppointmentDay from "#src/components/AppointmentList/AppointmentDay";
import { AppointmentFilterTypes } from "#src/components/AppointmentList/Filters/types";
import { CancelAppointmentModal } from "#src/components/AppointmentList/modals/CancelAppointmentModal";
import { RescheduleAppointmentModal } from "#src/components/AppointmentList/modals/RescheduleAppointmentModal";
import { SwapPassModal } from "#src/components/AppointmentList/modals/SwapPassModal";
import { SwapTeacherModal } from "#src/components/AppointmentList/modals/SwapTeacherModal";
import { CancelMultipleSessionsModal } from "#src/components/SessionList/actions/cancel-multiple-sessions-modal";
import { ExportParticipantsModal } from "#src/components/SessionList/actions/export-participants-modal";
import { CancelSessionModal } from "#src/components/SessionList/detail-actions/cancel-session-modal";
import { DeleteSessionModal } from "#src/components/SessionList/detail-actions/delete-session-modal";
import { DuplicateSessionModal } from "#src/components/SessionList/detail-actions/duplicate-session-modal";
import { RestoreSessionModal } from "#src/components/SessionList/detail-actions/restore-session-modal";
import { MoreActionsButton } from "#src/components/SessionList/more-actions-button";
import { WellhubProductModal } from "#src/components/WellhubProductModal/WellhubProductModal";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { SeriesAddModal } from "#src/components/series-add/series-add-modal";
import { useSeriesFilterConfig } from "#src/components/series-list/filters/use-series-filter-config";
import { SeriesListDisplaySettings } from "#src/components/series-list/series-list-display-settings";
import { SeriesListTable } from "#src/components/series-list/series-list-table";
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
import { useFetchOffersMissingWellhubProduct } from "#src/hooks/wellhub/use-fetch-offers-missing-wellhub-product";
import type { CalendarDataTab, CalendarTab } from "#src/types";
import { AppointmentModalType, ModalType } from "#src/types";
import { flags, useBookingManagementFlag } from "#src/urls";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";
import {
  useAnyObjectLevelPermissions,
  useObjectLevelPermission,
} from "#src/utils/permission";

import { useAppointmentFilterConfig } from "../components/AppointmentList/Filters/use-appointment-filter-config";
import { DateNavigationHeader } from "../components/SessionList/DateNavigationHeader";
import { useFilterConfig } from "../components/SessionList/Filters/useFilterConfig";
import SessionDay from "../components/SessionList/SessionDay";
import { DisplaySettings } from "../components/shared/DisplaySettings";
import { useSearchSessions } from "../hooks/useSearchSessions";
import { useSessionListData } from "../hooks/useSessionListData";
import {
  closeModal,
  selectAppointmentFilters,
  selectModalState,
  selectSelectedDate,
  selectSessionFilters,
  setLocale,
  useCalendarStore,
} from "../stores/calendar";
import { getDateStartKey } from "../utils/get-date-start-key";
import { scrollToCurrentSession } from "../utils/scroll";

const VALID_TABS: CalendarTab[] = ["classes", "appointments", "series"];

const getVisibleTabs = (
  showAppointmentsTab: boolean,
  showSeriesTab: boolean,
): CalendarTab[] => {
  return VALID_TABS.filter((tab) => {
    if (tab === "appointments") {
      return showAppointmentsTab;
    }

    if (tab === "series") {
      return showSeriesTab;
    }

    return true;
  });
};

const getActiveTab = (
  tabParam: string | null,
  visibleTabs: CalendarTab[],
): CalendarTab =>
  visibleTabs.includes(tabParam as CalendarTab)
    ? (tabParam as CalendarTab)
    : "classes";

export const DEFAULT_DEBOUNCE_DELAY = 200;

const CalendarPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const showAppointmentsTab = useBookingManagementFlag(
    flags.CALENDAR_APPOINTMENTS_TAB,
  );
  const showSeriesTab = useBookingManagementFlag(flags.CALENDAR_SERIES_TAB);

  const [searchParams, setSearchParams] = useSearchParams();
  const visibleTabs = useMemo(
    () => getVisibleTabs(showAppointmentsTab, showSeriesTab),
    [showAppointmentsTab, showSeriesTab],
  );
  const activeTab = getActiveTab(searchParams.get("tab"), visibleTabs);
  const isClassesTab = activeTab === "classes";
  const isAppointmentsTab = activeTab === "appointments";
  const isSeriesTabActive = activeTab === "series";

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

  const selectedDate = useCalendarStore(selectSelectedDate);
  const detailsModalState = useCalendarStore(selectModalState);

  const [searchQuery, setSearchQuery] = useState("");

  const hasCreateSessionPermission = useAnyObjectLevelPermissions([
    "session.activity.allowed_actions.create",
    "session.workshop.allowed_actions.create",
  ]);
  const hasCreateSeriesPermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.create",
  );

  const {
    isOpen: addSessionModalOpen,
    open: openAddSessionModal,
    close: closeAddSessionModal,
  } = useModal();
  const {
    isOpen: addSeriesModalOpen,
    open: openAddSeriesModal,
    close: closeAddSeriesModal,
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

  const [wellhubPage, setWellhubPage] = useState(1);
  const {
    isOpen: wellhubModalOpen,
    open: openWellhubModal,
    close: closeWellhubModal,
  } = useModal();
  const { data: wellhubOffersData, isLoading: wellhubOffersLoading } =
    useFetchOffersMissingWellhubProduct({
      page: wellhubPage,
      enabled: isClassesTab,
    });

  useEffect(() => {
    if (intlLocale) {
      setLocale(intlLocale);
    }
  }, [intlLocale]);

  // Determine fetch params based on selected date type
  const fetchParams =
    selectedDate.type === "single"
      ? { date: selectedDate.date }
      : selectedDate.minDate
        ? {
            minDate: selectedDate.minDate,
            maxDate: selectedDate.maxDate ?? selectedDate.minDate,
          }
        : null;

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
  const searchedAppointments = useSearchAppointments(
    appointments,
    isAppointmentsTab ? searchQuery : "",
  );

  const appointmentFilters = useCalendarStore(selectAppointmentFilters);
  // Unlike other appointment filters (teacher, establishment, participant) which are handled
  // server-side via query params, name and pass_used filters must be applied client-side
  // as the backend does not support filtering by these fields.
  const filteredAppointments = useMemo(() => {
    const nameFilter = appointmentFilters.find(
      (filter) => filter.field === AppointmentFilterTypes.NAME,
    );
    const passFilter = appointmentFilters.find(
      (filter) => filter.field === AppointmentFilterTypes.PASS_USED,
    );

    if (!nameFilter?.valueIds.length && !passFilter?.valueIds.length) {
      return searchedAppointments;
    }

    return searchedAppointments.filter((appt) => {
      if (
        nameFilter?.valueIds.length &&
        !nameFilter.valueIds.includes(appt.name)
      ) {
        return false;
      }
      if (
        passFilter?.valueIds.length &&
        !passFilter.valueIds.includes(appt.passUsedName)
      ) {
        return false;
      }
      return true;
    });
  }, [searchedAppointments, appointmentFilters]);

  const sessionsByDate = useMemo(
    () => groupBy(filteredSessions, getDateStartKey),
    [filteredSessions],
  );

  const scrollToNow = useCallback(() => {
    scrollToCurrentSession(filteredSessions, getCompanyTimezone());
  }, [filteredSessions]);

  const appointmentsByDate = useMemo(
    () => groupBy(filteredAppointments, getDateStartKey),
    [filteredAppointments],
  );

  const displaySettingsTab: CalendarDataTab | undefined =
    activeTab === "classes" || activeTab === "appointments"
      ? activeTab
      : undefined;
  const displaySettings = useMemo(() => {
    if (isSeriesTabActive) {
      return () => <SeriesListDisplaySettings />;
    }

    if (!displaySettingsTab) return undefined;

    return () => <DisplaySettings activeTab={displaySettingsTab} />;
  }, [displaySettingsTab, isSeriesTabActive]);
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

  const { filterConfig, sessionFiltersRef } = useFilterConfig();
  const { filterConfig: appointmentFilterConfig, appointmentFiltersRef } =
    useAppointmentFilterConfig(appointments);
  const { filterConfig: seriesFilterConfig, seriesFiltersRef } =
    useSeriesFilterConfig({ enabled: isSeriesTabActive });

  const filters = useCalendarStore(selectSessionFilters);
  const hasEmptyResults =
    !isLoading && !sessionDataError && Object.keys(sessionsByDate).length === 0;

  const onClickEmptySearchState = useCallback(() => {
    analyticsTrackSafeEvent(sessionListSearchClearedEvent, {
      search_value: searchQuery,
      source: SearchClearSource.CLEAR_FILTERS,
    });
    setSearchQuery("");
    sessionFiltersRef.current?.resetFilters();
  }, [searchQuery, sessionFiltersRef]);

  const onClickAddSession = useCallback(() => {
    openAddSessionModal();
    analyticsTrackSafeEvent(sessionCreationOpensEvent, {});
  }, [openAddSessionModal]);

  const onClickAddSeries = useCallback(() => {
    openAddSeriesModal();
  }, [openAddSeriesModal]);

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
        onClick: () => {
          setSearchQuery("");
          appointmentFiltersRef.current?.resetFilters();
        },
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

  const headerFilterConfig = isClassesTab
    ? filterConfig
    : isAppointmentsTab
      ? appointmentFilterConfig
      : seriesFilterConfig;
  const headerFilterRef = isClassesTab
    ? sessionFiltersRef
    : isAppointmentsTab
      ? appointmentFiltersRef
      : seriesFiltersRef;

  const headerSearchConfig = {
    id: isClassesTab
      ? "session-search"
      : isAppointmentsTab
        ? "appointment-search"
        : "series-search",
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
  };

  const seriesContent = isSeriesTabActive ? (
    <QueryBoundary>
      <SeriesListTable
        canCreateSeries={hasCreateSeriesPermission}
        onAddSeriesClick={onClickAddSeries}
        searchQuery={searchQuery}
      />
    </QueryBoundary>
  ) : null;

  const callToActionButton = useMemo(() => {
    if (isSeriesTabActive && hasCreateSeriesPermission) {
      return (
        <ListLayout.Button
          iconLeft="plus"
          intent="call-to-action"
          color="main"
          label={t("addSeries")}
          onClick={onClickAddSeries}
        />
      );
    }

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
  }, [
    t,
    isSeriesTabActive,
    hasCreateSeriesPermission,
    onClickAddSeries,
    isClassesTab,
    hasCreateSessionPermission,
    onClickAddSession,
  ]);

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
    <>
      <ListLayout>
        <ListLayout.Header
          key={activeTab}
          pageTitle={t("header")}
          onDisplayPopover={displaySettings}
          callToActionButton={callToActionButton}
          filterConfig={headerFilterConfig}
          filterRef={headerFilterRef}
          endGroupActions={endGroupActions}
          pageTabs={
            visibleTabs.length > 1
              ? {
                  orientation: "horizontal",
                  value: activeTab,
                  onValueChange: handleTabChange,
                  tabs: visibleTabs.map((tab) => ({
                    id: tab,
                    label: t(`tabs.${tab}`),
                  })),
                }
              : undefined
          }
          searchConfig={headerSearchConfig}
        />
        <ListLayout.Content>
          {!isSeriesTabActive && (
            <DateNavigationHeader
              onScrollToNow={isClassesTab ? scrollToNow : undefined}
            />
          )}
          {isClassesTab &&
            wellhubOffersData &&
            wellhubOffersData.total_count > 0 && (
              <div className="mt-md mx-md">
                <Alert
                  status="default"
                  title={t("wellhub.alert.title")}
                  buttonLabel={t("wellhub.alert.action")}
                  onButtonClick={openWellhubModal}
                >
                  {
                    // @ts-expect-error - The typing does not understand the count system
                    t("wellhub.alert.message", {
                      count: wellhubOffersData.total_count,
                    }) as string
                  }
                </Alert>
              </div>
            )}
          <div
            className={
              isSeriesTabActive
                ? "flex h-full min-h-0 flex-col"
                : "flex h-full flex-col gap-xl mt-md"
            }
          >
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
            ) : isAppointmentsTab ? (
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
            ) : (
              seriesContent
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
                <DeleteSessionModal
                  session={detailsModalState.session}
                  isOpen={detailsModalState.type === ModalType.DELETE}
                  onClose={closeModal}
                />
              )}
              {detailsModalState?.type === ModalType.DUPLICATE && (
                <DuplicateSessionModal
                  session={detailsModalState.session}
                  isOpen={detailsModalState.type === ModalType.DUPLICATE}
                  onClose={closeModal}
                />
              )}
              <WellhubProductModal
                isOpen={wellhubModalOpen}
                onClose={closeWellhubModal}
                offers={wellhubOffersData?.results ?? []}
                isLoading={wellhubOffersLoading}
                currentPage={wellhubPage}
                totalPages={wellhubOffersData?.total_pages ?? 1}
                onChangePage={setWellhubPage}
              />
            </>
          )}

          {detailsModalState?.tab === "appointments" &&
            detailsModalState?.type === AppointmentModalType.CANCEL && (
              <CancelAppointmentModal
                appointment={detailsModalState.appointment}
                isOpen
                onClose={closeModal}
              />
            )}

          {detailsModalState?.tab === "appointments" &&
            detailsModalState?.type === AppointmentModalType.RESCHEDULE && (
              <RescheduleAppointmentModal
                appointment={detailsModalState.appointment}
                isOpen
                onClose={closeModal}
              />
            )}

          {detailsModalState?.tab === "appointments" &&
            detailsModalState?.type === AppointmentModalType.SWAP_PASS && (
              <SwapPassModal
                appointment={detailsModalState.appointment}
                isOpen
                onClose={closeModal}
              />
            )}
          {detailsModalState?.tab === "appointments" &&
            detailsModalState?.type === AppointmentModalType.SWAP_TEACHER && (
              <SwapTeacherModal
                appointment={detailsModalState.appointment}
                isOpen
                onClose={closeModal}
              />
            )}
        </ListLayout.Content>
      </ListLayout>
      {addSeriesModalOpen ? (
        <SeriesAddModal onClose={closeAddSeriesModal} />
      ) : null}
    </>
  );
};

export default CalendarPage;
