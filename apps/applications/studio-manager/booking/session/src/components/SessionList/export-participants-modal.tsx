import { FC, useState } from "react";

import { getTodayJSDate } from "@bsport/datetime-manipulation";
import { Body, DatePicker, Modal, Toggle } from "@bsport/kaizen-primitive-core";

import {
  selectSelectedDate,
  useSessionListStore,
} from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

export const ExportParticipantsModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionList");

  const currentSelectedDate = useSessionListStore(selectSelectedDate);
  const defaultDatePickerValue =
    currentSelectedDate.type === "single"
      ? currentSelectedDate.date
      : currentSelectedDate.minDate || getTodayJSDate();

  const [applyFilters, setApplyFilters] = useState(false);

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("exportParticipantsModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("exportParticipantsModal.confirmButton"),
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
