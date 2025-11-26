import { useCallback, useEffect, useMemo, useState } from "react";

import { getLocalNow, toDate } from "@bsport/datetime-manipulation";
import { ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import { useTranslation } from "#src/utils/i18n";

import { DisplaySettings } from "../components/SessionList/DisplaySettings";
import { SessionDatePicker } from "../components/SessionList/SessionDatePicker";
import { SessionDay } from "../components/SessionList/SessionDay";
import { useSessionListData } from "../hooks/useSessionListData";
import {
  selectSelectedDate,
  setSelectedDate,
  useSessionListStore,
} from "../stores/session-list";

const ListPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const selectedDate = useSessionListStore(selectSelectedDate);

  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);

  // Initialize selectedDate on first render
  useEffect(() => {
    const today = getLocalNow({ locale: intlLocale, zone: companyTimeZone });
    setSelectedDate(toDate(today));
  }, [intlLocale, companyTimeZone]);

  // Determine fetch params based on selected date type
  const fetchParams =
    selectedDate.type === "single"
      ? { date: selectedDate.date }
      : { minDate: selectedDate.minDate, maxDate: selectedDate.maxDate };

  const { sessionsByDate, isLoading } = useSessionListData(fetchParams);

  const openAddSessionModal = useCallback(() => {
    setAddSessionModalOpen(true);
  }, []);

  const closeAddSessionModal = useCallback(() => {
    setAddSessionModalOpen(false);
  }, []);

  const displaySettings = useCallback(() => <DisplaySettings />, []);

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
        />
      )),
    [sessionsByDate, isLoading],
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header")}
        onDisplayPopover={displaySettings}
        callToActionButton={callToActionButton}
      />
      <ListLayout.Content>
        <div className="flex flex-col gap-xl">
          <SessionDatePicker />
          {sessionDays}
        </div>
        <AddSessionModal
          isOpen={addSessionModalOpen}
          onClose={closeAddSessionModal}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
