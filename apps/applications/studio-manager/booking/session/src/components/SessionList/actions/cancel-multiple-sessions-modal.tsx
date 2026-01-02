import { FC, useState } from "react";

import { getLocalNow } from "@bsport/datetime-manipulation";
import {
  Body,
  DatePicker,
  Modal,
  SelectedDate,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

export const CancelMultipleSessionsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const currentSelectedDate = useSessionListStore(selectSelectedDate);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cancelRange, setCancelRange] = useState<SelectedDate>(null);

  const getDefaultDateRange = (): SelectedDate => {
    if (currentSelectedDate.type === "single" && currentSelectedDate.date) {
      return [currentSelectedDate.date, currentSelectedDate.date];
    }
    if (
      currentSelectedDate.type === "range" &&
      currentSelectedDate.minDate &&
      currentSelectedDate.maxDate
    ) {
      return [currentSelectedDate.minDate, currentSelectedDate.maxDate];
    }
    const today = getLocalNow({ zone: companyTimezone });
    return [today, today];
  };

  const handleDateChange = (date: SelectedDate) => {
    if (!date || !Array.isArray(date)) {
      return;
    }
    setCancelRange([date[0], date[1]]);
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("cancelMultipleSessionsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("cancelMultipleSessionsModal.confirmButton"),
        color: "critical",
      }}
      cancelButton={{
        label: t("cancelMultipleSessionsModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("cancelMultipleSessionsModal.description")}
        </Body>
        <div className="flex flex-col gap-xs">
          <Body size="md" htmlVariant="p">
            {t("cancelMultipleSessionsModal.dateRangeLabel")}
          </Body>
          <DatePicker
            id="bulk-cancel-date-picker"
            mode="range"
            displayAs="popover"
            defaultValue={getDefaultDateRange()}
            onSelect={handleDateChange}
          />
        </div>
      </div>
    </Modal>
  );
};
