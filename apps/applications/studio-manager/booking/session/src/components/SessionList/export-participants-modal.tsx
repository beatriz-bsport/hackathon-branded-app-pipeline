import { FC, useEffect, useState } from "react";

import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";
import {
  Body,
  DatePicker,
  Modal,
  SelectedDate,
  Toggle,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useExportParticipantsList } from "#src/hooks/use-export-participants";
import {
  selectFilters,
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { getParamsFromFilters } from "./Filters/getParamsFromFilters";

export const ExportParticipantsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionList");
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const currentSelectedDate = useSessionListStore(selectSelectedDate);
  const defaultDatePickerValue =
    currentSelectedDate.type === "single"
      ? currentSelectedDate.date
      : currentSelectedDate.minDate || getLocalNow({ zone: companyTimeZone });

  const [applyFilters, setApplyFilters] = useState(false);
  const [exportDate, setExportDate] = useState<DateTime>(
    defaultDatePickerValue,
  );

  useEffect(() => {
    if (isOpen) {
      setExportDate(defaultDatePickerValue);
    }
  }, [isOpen, defaultDatePickerValue]);

  const handleDateChange = (date: SelectedDate) => {
    if (!!date && !Array.isArray(date)) {
      setExportDate(date);
    }
  };

  const exportParticipantList = useExportParticipantsList();
  const filters = useSessionListStore(selectFilters);
  const getFormattedFilters = () => {
    if (!applyFilters) {
      return {};
    }
    const {
      establishments,
      coaches,
      activity__in,
      levels: level_in,
    } = getParamsFromFilters(filters);
    return { establishments, coaches, activity__in, level_in };
  };

  const handleExport = () => {
    onClose();
    exportParticipantList.mutate({
      date: exportDate,
      filters: getFormattedFilters(),
    });
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("exportParticipantsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("exportParticipantsModal.confirmButton"),
        onClick: handleExport,
      }}
      cancelButton={{
        label: t("exportParticipantsModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="lg">
          {t("exportParticipantsModal.description")}
        </Body>
        <div className="flex flex-col gap-xs">
          <Body size="md" htmlVariant="p">
            {t("exportParticipantsModal.dayLabel")}
          </Body>
          <DatePicker
            id="export-participants-date-picker"
            mode="single"
            displayAs="popover"
            defaultValue={defaultDatePickerValue}
            onSelect={handleDateChange}
          />
        </div>
        <Toggle
          id="export-participants-apply-filters-toggle"
          label={t("exportParticipantsModal.applyFilterLabel")}
          helperText={t("exportParticipantsModal.applyFilterDescription")}
          checked={applyFilters}
          onChange={() => setApplyFilters(!applyFilters)}
        />
      </div>
    </Modal>
  );
};
