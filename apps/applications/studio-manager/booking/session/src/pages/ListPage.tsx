import { isEmpty } from "lodash";
import groupBy from "lodash/groupBy";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ErrorFallback,
  ListLayout,
  useEmptyState,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import { CancelMultipleSessionsModal } from "#src/components/SessionList/actions/cancel-multiple-sessions-modal";
import { ExportParticipantsModal } from "#src/components/SessionList/actions/export-participants-modal";
import { CancelSessionModal } from "#src/components/SessionList/detail-actions/cancel-session-modal";
import { DeleteSessionModal } from "#src/components/SessionList/detail-actions/delete-session-modal";
import { RestoreSessionModal } from "#src/components/SessionList/detail-actions/restore-session-modal";
import { MoreActionsButton } from "#src/components/SessionList/more-actions-button";
import { useModal } from "#src/hooks/use-modal";
import { useTranslation } from "#src/utils/i18n";
import { useAnyObjectLevelPermissions } from "#src/utils/permission";

import { DateNavigationHeader } from "../components/SessionList/DateNavigationHeader";
import { DisplaySettings } from "../components/SessionList/DisplaySettings";
import { useFilterConfig } from "../components/SessionList/Filters/useFilterConfig";
import SessionDay from "../components/SessionList/SessionDay";
import { useSearchSessions } from "../hooks/useSearchSessions";
import {
  getSessionDateStart,
  useSessionListData,
} from "../hooks/useSessionListData";
import {
  ModalType,
  selectFilters,
  selectModalState,
  selectSelectedDate,
  setLocale,
  useSessionListStore,
} from "../stores/session-list";

const ListPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;

  const selectedDate = useSessionListStore(selectSelectedDate);
  const detailsModalState = useSessionListStore(selectModalState);

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

  const {
    sessions,
    isLoading,
    error: sessionDataError,
  } = useSessionListData(fetchParams);

  const filteredSessions = useSearchSessions(sessions, searchQuery);

  const sessionsByDate = useMemo(
    () => groupBy(filteredSessions, getSessionDateStart),
    [filteredSessions],
  );

  const displaySettings = useCallback(() => <DisplaySettings />, []);
  const endGroupActions = useMemo(() => {
    return [
      <MoreActionsButton
        key="more-actions"
        onParticipantsExport={openExportParticipantsModal}
        onCancelMultipleSessions={openCancelMultipleSessionsModal}
      />,
    ];
  }, [openExportParticipantsModal, openCancelMultipleSessionsModal]);

  const { filterConfig, resetFilters, sessionFiltersRef } = useFilterConfig();

  const filters = useSessionListStore(selectFilters);
  const hasEmptyResults =
    !isLoading && !sessionDataError && Object.keys(sessionsByDate).length === 0;

  const onClickEmptySearchState = useCallback(() => {
    setSearchQuery("");
    resetFilters?.();
  }, [resetFilters]);

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
            onClick: openAddSessionModal,
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

  const { shouldRenderLoadingState, LoadingState } = useLoadingState({
    isLoading: isLoading && Object.keys(sessionsByDate).length === 0,
    message: t("table.isLoading"),
  });

  const callToActionButton = useMemo(() => {
    if (!hasCreateSessionPermission) return null;
    return (
      <ListLayout.Button
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        label={t("addSession")}
        onClick={openAddSessionModal}
      />
    );
  }, [t, openAddSessionModal, hasCreateSessionPermission]);

  const sessionDays = useMemo(
    () =>
      Object.entries(sessionsByDate).map(([date, sessions]) => (
        <SessionDay
          key={date}
          date={date}
          sessions={sessions}
          isLoading={isLoading}
          locale={intlLocale || "en-US"}
        />
      )),
    [sessionsByDate, isLoading, intlLocale],
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header")}
        onDisplayPopover={displaySettings}
        callToActionButton={callToActionButton}
        filterConfig={filterConfig}
        filterRef={sessionFiltersRef}
        endGroupActions={endGroupActions}
        searchConfig={{
          id: "session-search",
          inputValue: searchQuery,
          onInputValueChange: setSearchQuery,
          onClear: () => setSearchQuery(""),
        }}
      />
      <ListLayout.Content>
        <DateNavigationHeader />
        <div className="flex flex-col gap-xl h-full mt-md">
          {shouldRenderEmptyState && <EmptyState />}
          {!shouldRenderEmptyState && !sessionDataError && sessionDays}
          {shouldRenderLoadingState && <LoadingState />}
          {sessionDataError && (
            <div className="flex flex-col items-center justify-center">
              <ErrorFallback actionProps={ErrorFallback.DEFAULT_ACTION_PROPS} />
            </div>
          )}
        </div>

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
          <CancelSessionModal session={detailsModalState.session} />
        )}
        {detailsModalState?.type === ModalType.RESTORE && (
          <RestoreSessionModal session={detailsModalState.session} />
        )}
        {detailsModalState?.type === ModalType.DELETE && (
          <DeleteSessionModal session={detailsModalState.session} />
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
