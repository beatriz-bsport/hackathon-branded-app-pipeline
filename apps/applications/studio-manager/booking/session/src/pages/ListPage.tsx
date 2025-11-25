import { useState } from "react";

import { getLocalNow, toDate } from "@bsport/datetime-manipulation";
import { DatePicker, ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { AddSessionModal } from "#src/components/AddSessionModal/AddSessionModal";
import { useTranslation } from "#src/utils/i18n";

import { DisplaySettings } from "../components/SessionList/DisplaySettings";
import { SessionDayTitle } from "../components/SessionList/SessionDayTitle";
import { SessionTable } from "../components/SessionList/SessionTable";
import { useSessionListData } from "../hooks/useSessionListData";
import {
  selectCalendarView,
  useSessionListStore,
} from "../stores/session-list";

const ListPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const today = getLocalNow({ locale: intlLocale, zone: companyTimeZone });

  const [selectedDate, setSelectedDate] = useState<Date>(toDate(today));

  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);

  const { sessions: renderedSessions, isLoading } = useSessionListData({
    date: selectedDate,
  });

  const onDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  };

  const openAddSessionModal = () => {
    setAddSessionModalOpen(true);
  };

  const closeAddSessionModal = () => {
    setAddSessionModalOpen(false);
  };

  const calendarView = useSessionListStore(selectCalendarView);

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
          <div className="flex pt-sm px-sm justify-center">
            <DatePicker
              id="daily-sessions-picker"
              mode={calendarView === "daily" ? "single" : "range"}
              displayAs="popover"
              onSelect={onDateChange}
              dateFormat="medium"
              defaultValue={selectedDate}
            />
          </div>
          <div>
            <SessionDayTitle date={selectedDate} sessions={renderedSessions} />
            <SessionTable sessions={renderedSessions} isLoading={isLoading} />
            <AddSessionModal
              isOpen={addSessionModalOpen}
              onClose={closeAddSessionModal}
            />
          </div>
        </div>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
