import { useState } from "react";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { getLocalNow, toDate, toDateTime } from "@bsport/datetime-manipulation";
import {
  Body,
  DatePicker,
  ListLayout,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { SessionTable } from "../components/SessionList/SessionTable";
import { useTableRowData } from "../hooks/stores-interface";
import { useFetchEstablishments } from "../hooks/useFetchEstablishments";
import { useFetchSessions } from "../hooks/useFetchSessions";
import { useFetchTeachers } from "../hooks/useFetchTeachers";

const ListPage: React.FC = () => {
  const { t, i18n } = useTranslation("sessionList");
  const intlLocale = i18n?.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const today = getLocalNow({ locale: intlLocale, zone: companyTimeZone });

  const [selectedDate, setSelectedDate] = useState<Date>(toDate(today));

  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();
  const { isLoading: isLoadingEstablishments, fetchEstablishments } =
    useFetchEstablishments();
  const { isLoading: isLoadingSessions } = useFetchSessions({
    date: selectedDate,
    onSuccess: ({ teacherIds, establishmentIds }) => {
      if (teacherIds.length > 0) {
        fetchTeachers({ teacherIds });
      }
      if (establishmentIds.length > 0) {
        fetchEstablishments({ establishmentIds });
      }
    },
  });

  // TODO: merge all the fetching hooks together for clarity.
  const renderedSessions = useTableRowData();

  const todayTitle = formatDateTimeFromDate(
    toDateTime(selectedDate),
    DATETIME_FORMATS.HUGE_DATE,
  );

  const totalEffectif = renderedSessions.reduce(
    (acc, session) => acc + session.effectif,
    0,
  );
  const totalOccupancy = renderedSessions.reduce(
    (acc, session) => acc + session.nb_bookings,
    0,
  );

  const occupancyRate = totalEffectif
    ? Math.round((totalOccupancy / totalEffectif) * 100)
    : 0;

  const onDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  };

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("header")} />
      <ListLayout.Content>
        <div className="flex flex-col gap-xl">
          <DatePicker
            id="daily-sessions-picker"
            mode="single"
            displayAs="popover"
            onSelect={onDateChange}
          />
          <div>
            <div className="mb-sm flex items-center gap-xs px-md">
              <Title htmlVariant="h2" weight="strong">
                {todayTitle}
              </Title>
              <Body size="md" weight="weak" color="weak" htmlVariant="span">
                · {t("title.occupancyRate", { rate: occupancyRate })}
              </Body>
            </div>
            <SessionTable
              sessions={renderedSessions}
              isLoading={
                isLoadingSessions ||
                isLoadingTeachers ||
                isLoadingEstablishments
              }
            />
          </div>
        </div>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
