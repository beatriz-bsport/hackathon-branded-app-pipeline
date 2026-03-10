import { useState } from "react";

import { LuxonDateTime } from "@bsport/datetime-manipulation";
import { Alert, Body, Modal, Select } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useDownloadInvoiceBulkExport } from "#src/hooks/use-download-invoice-bulk-export";
import { useTranslation } from "#src/utils/i18n";

// The bulk export is available from March 2025 onwards.
const BULK_EXPORT_CUTOFF = { year: 2025, month: 3 };

export type BulkExportModalProps = {
  open: boolean;
  onClose: () => void;
};

export const BulkExportModal = ({ open, onClose }: BulkExportModalProps) => {
  const { t } = useTranslation("invoice");

  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const nowInCompanyTz = LuxonDateTime.now()
    .setZone(companyTimezone)
    .startOf("month");
  const cutoffDate = LuxonDateTime.fromObject(
    {
      year: BULK_EXPORT_CUTOFF.year,
      month: BULK_EXPORT_CUTOFF.month,
      day: 1,
    },
    { zone: companyTimezone },
  ).startOf("month");
  const lastAvailableMonth = nowInCompanyTz.minus({ months: 1 });

  const [year, setYear] = useState(() => String(lastAvailableMonth.year));
  const [month, setMonth] = useState(() => String(lastAvailableMonth.month));

  const startYear = BULK_EXPORT_CUTOFF.year;
  const endYear = lastAvailableMonth.year;
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => {
      const yearValue = endYear - i;
      return { id: String(yearValue), label: String(yearValue) };
    },
  );

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    return {
      id: String(monthNum),
      label: LuxonDateTime.fromObject({ month: monthNum }).toFormat("MMMM"),
    };
  });

  // Selected period as a date (start of month); null if year/month not both set.
  const requestedDate = (() => {
    if (!year || !month) return null;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    return LuxonDateTime.fromObject(
      { year: y, month: m, day: 1 },
      { zone: companyTimezone },
    ).startOf("month");
  })();

  // Export allowed only for past months from March 2025 onwards.
  const isBeforeCutoff = requestedDate !== null && requestedDate < cutoffDate;
  const isCurrentOrFutureMonth =
    requestedDate !== null && requestedDate >= nowInCompanyTz;
  const errorText = (() => {
    if (isBeforeCutoff) return t("bulkExport.monthErrorBeforeCutoff");
    if (isCurrentOrFutureMonth)
      return t("bulkExport.monthErrorCurrentOrFuture");
    return undefined;
  })();
  const canRequestExport =
    requestedDate !== null && !isCurrentOrFutureMonth && !isBeforeCutoff;

  // No need for useCallback in React 19+ (unless needed for deps)
  const handleClose = () => onClose();

  const { download, loading } = useDownloadInvoiceBulkExport({
    onCompleted: handleClose,
  });

  const handleDownload = () => {
    if (!canRequestExport || loading || !year || !month) return;
    const y = Number(year);
    const m = Number(month);
    if (!Number.isInteger(y) || !Number.isInteger(m)) return;
    void download({ year: y, month: m });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      title={t("bulkExport.modalTitle")}
      description={t("bulkExport.modalDescription")}
      cancelButton={{
        label: t("bulkExport.cancel"),
        onClick: handleClose,
      }}
      confirmButton={{
        label: loading ? t("bulkExport.downloading") : t("bulkExport.download"),
        onClick: handleDownload,
        disabled: !canRequestExport || loading,
        loading,
      }}
    >
      <div className="flex flex-col gap-md">
        <Alert status="info">
          <Body htmlVariant="p" size="md" weight="weak" color="inherit">
            {t("bulkExport.alertDescription")}
          </Body>
        </Alert>
        <div className="flex flex-col gap-sm">
          <div className="flex gap-lg">
            <Select
              label={t("bulkExport.month")}
              items={monthOptions}
              value={month}
              onChange={setMonth}
              required
              status={
                isCurrentOrFutureMonth || isBeforeCutoff
                  ? "critical"
                  : "default"
              }
            />
            <Select
              label={t("bulkExport.year")}
              items={yearOptions}
              value={year}
              onChange={setYear}
              required
            />
          </div>
          {errorText && (
            <Body
              htmlVariant="p"
              size="sm"
              color="inherit"
              className="text-onsurface-status-critical-strong"
            >
              {errorText}
            </Body>
          )}
        </div>
      </div>
    </Modal>
  );
};
