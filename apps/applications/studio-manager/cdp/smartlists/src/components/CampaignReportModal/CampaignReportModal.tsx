import { useState } from "react";

import {
  DatePicker,
  Modal,
  type SelectedDate,
  useDatePickerShortcuts,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type CampaignReportModalProps = {
  isOpen: boolean;
  onConfirm: (selectedRange: SelectedDate) => void;
  onClose: () => void;
};

const isRangeValid = (selectedRange: SelectedDate) => {
  return (
    Array.isArray(selectedRange) &&
    selectedRange[0] &&
    selectedRange[1] &&
    selectedRange[0] <= selectedRange[1]
  );
};

export const CampaignReportModal = ({
  isOpen,
  onConfirm,
  onClose,
}: CampaignReportModalProps) => {
  const { t } = useTranslation("campaign");
  const { lastWeek, last4weeks, lastQuarter, monthToDate, yearToDate } =
    useDatePickerShortcuts();
  const [selectedRange, setSelectedRange] = useState<SelectedDate>([
    null,
    null,
  ]);

  const handleConfirm = () => {
    if (isRangeValid(selectedRange)) {
      onConfirm(selectedRange);
    }
  };

  return (
    <Modal
      size="lg"
      title={t("generateReportModal.title")}
      description={t("generateReportModal.description")}
      open={isOpen}
      onClose={onClose}
      cancelButton={{
        label: t("generateReportModal.buttons.cancel"),
        onClick: onClose,
      }}
      confirmButton={{
        label: t("generateReportModal.buttons.confirm"),
        onClick: handleConfirm,
        disabled: !isRangeValid(selectedRange),
      }}
    >
      <DatePicker
        id="campaign-report-interval-picker"
        mode="range"
        displayAs="content"
        onSelect={setSelectedRange}
        shortcuts={[lastWeek, last4weeks, lastQuarter, monthToDate, yearToDate]}
        dateValue={selectedRange}
      />
    </Modal>
  );
};
