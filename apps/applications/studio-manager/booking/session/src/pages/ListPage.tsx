import { useEffect, useState } from "react";

import {
  fromIsoString,
  getLocalNow,
  toDate,
} from "@bsport/datetime-manipulation";
import { ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import { useTranslation } from "#src/utils/i18n";

import { DisplaySettings } from "../components/SessionList/DisplaySettings";
import { SessionDatePicker } from "../components/SessionList/SessionDatePicker";
import { SessionDayTitle } from "../components/SessionList/SessionDayTitle";
import { SessionTable } from "../components/SessionList/SessionTable";
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

  const openAddSessionModal = () => {
    setAddSessionModalOpen(true);
  };

  const closeAddSessionModal = () => {
    setAddSessionModalOpen(false);
  };

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header")}
        onDisplayPopover={() => <DisplaySettings />}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("addSession")}
            onClick={openAddSessionModal}
          />
        }
      />
      <ListLayout.Content>
        <div className="flex flex-col gap-xl">
          <SessionDatePicker />
          {Object.entries(sessionsByDate).map(([date, sessions]) => (
            <div key={date}>
              <SessionDayTitle date={fromIsoString(date)} sessions={sessions} />
              <SessionTable sessions={sessions} isLoading={isLoading} />
            </div>
          ))}
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
