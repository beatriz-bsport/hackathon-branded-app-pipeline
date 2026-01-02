import groupBy from "lodash/groupBy";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getLocalNow } from "@bsport/datetime-manipulation";
import {
  ListLayout,
  useEmptyState,
  useLoadingState,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import { CancelMultipleSessionsModal } from "#src/components/SessionList/actions/cancel-multiple-sessions-modal";
import { ExportParticipantsModal } from "#src/components/SessionList/actions/export-participants-modal";
import { MoreActionsButton } from "#src/components/SessionList/more-actions-button";
import { useModal } from "#src/hooks/use-modal";
import { useTranslation } from "#src/utils/i18n";

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
  selectSelectedDate,
  setLocale,
  setSelectedDate,
  useSessionListStore,
} from "../stores/session-list";

const ListPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const selectedDate = useSessionListStore(selectSelectedDate);

  const [searchQuery, setSearchQuery] = useState("");

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

  const hasInitializedDate = useRef(false);

  useEffect(() => {
    if (intlLocale) {
      setLocale(intlLocale);
    }
  }, [intlLocale]);

  useEffect(() => {
    if (!hasInitializedDate.current && companyTimeZone && intlLocale) {
      setSelectedDate(
        getLocalNow({ locale: intlLocale, zone: companyTimeZone }),
      );
      hasInitializedDate.current = true;
    }
  }, [intlLocale, companyTimeZone]);

  // Determine fetch params based on selected date type
  const fetchParams =
    selectedDate.type === "single"
      ? { date: selectedDate.date }
      : selectedDate.minDate && selectedDate.maxDate
        ? { minDate: selectedDate.minDate, maxDate: selectedDate.maxDate }
        : null;

  const { sessions, isLoading } = useSessionListData(fetchParams);

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

  const { shouldRenderEmptyState, EmptyState } = useEmptyState({
    isEmpty: !isLoading && Object.keys(sessionsByDate).length === 0,
    emptyConfig: {
      title: t("emptyState.title"),
      subtitle: t("emptyState.subtitle"),
      ctaButtonConfig: {
        label: t("addSession"),
        onClick: openAddSessionModal,
        iconLeft: "plus",
        intent: "call-to-action",
        color: "main",
      },
    },
  });

  const { shouldRenderLoadingState, LoadingState } = useLoadingState({
    isLoading: isLoading && Object.keys(sessionsByDate).length === 0,
    message: t("table.isLoading"),
  });

  const callToActionButton = useMemo(
    () => (
      <ListLayout.Button
        iconLeft="plus"
        intent="call-to-action"
        color="main"
        label={t("addSession")}
        onClick={openAddSessionModal}
      />
    ),
    [t, openAddSessionModal],
  );

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

  const filterConfig = useFilterConfig();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header")}
        onDisplayPopover={displaySettings}
        callToActionButton={callToActionButton}
        filterConfig={filterConfig}
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
          {shouldRenderEmptyState ? <EmptyState /> : sessionDays}
          {shouldRenderLoadingState && <LoadingState />}
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
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
