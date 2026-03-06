import type { FC } from "react";

import { formatPriceWithCurrency, getCurrencyDisplay } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Button,
  Chip,
  List,
  Menu,
  type PaginationProps,
  Popover,
  Tooltip,
  type UseEmptyStateProps,
  type UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";

import type { InvoiceTableRow } from "#src/components/InvoiceTable/types";
import { useTranslation } from "#src/utils/i18n";

export type InvoiceListProps = {
  rows: InvoiceTableRow[];
  paginationProps: PaginationProps;
  emptyStateProps: UseEmptyStateProps;
  loadingProps: UseLoadingStateProps;
  onDownloadPdf: (invoiceUuid: string) => void;
  onDownloadReceipt: (invoiceUuid: string) => void;
};

export const InvoiceList: FC<InvoiceListProps> = ({
  rows,
  paginationProps,
  emptyStateProps,
  loadingProps,
  onDownloadPdf,
  onDownloadReceipt,
}) => {
  const { t, i18n } = useTranslation("invoice");
  const currency = getCurrencyDisplay();

  const listItems = rows.map((row) => {
    const formattedAmount = formatPriceWithCurrency(row.amount, currency);
    const formattedDate = formatDateTime(
      row.date,
      DATETIME_FORMATS.MEDIUM_DATE,
      { locale: i18n.language },
    );

    const statusChips = (
      <div className="flex gap-sm">
        {row.status.map((status) => (
          <Chip
            key={`${row.id}-${status.label}`}
            label={status.label}
            color={status.color}
            size="lg"
            type="weak"
          />
        ))}
      </div>
    );

    const downloadButton = (
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              icon="download-01"
              intent="flat"
              kind="icon-button"
              label={t("download.label")}
              color="main"
              size="md"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                if (row.downloadPdf.is_receipt_available) {
                  setIsPopoverOpened(true);
                } else {
                  onDownloadPdf(row.downloadPdf.uuid);
                }
              }}
              disabled={row.downloadPdf.is_draft}
            />
          )}
        </Popover.Anchor>
        <Popover.Content placement="bottom-right">
          {({ setIsPopoverOpened }) => (
            <Menu
              items={[
                { type: "title", label: t("download.title") },
                { id: "download-pdf", label: t("download.pdf") },
                { id: "download-receipt", label: t("download.receipt") },
              ]}
              onSelectOption={(id) => {
                setIsPopoverOpened(false);
                if (id === "download-pdf") {
                  onDownloadPdf(row.downloadPdf.uuid);
                } else if (id === "download-receipt") {
                  onDownloadReceipt(row.downloadPdf.uuid);
                }
              }}
            />
          )}
        </Popover.Content>
      </Popover>
    );

    const customNode = (
      <div className="flex items-center gap-sm">
        {statusChips}
        {row.downloadPdf.is_draft ? (
          <Tooltip
            label={t("download.explainPdfDraft")}
            placement="bottom-right"
          >
            {downloadButton}
          </Tooltip>
        ) : (
          downloadButton
        )}
      </div>
    );

    return {
      id: row.id,
      title: row.member,
      description: `${formattedAmount}, ${formattedDate}`,
      customNode,
      buttons: [],
      link: row.link,
    };
  });

  return (
    <List
      id="invoice-mobile-list"
      items={listItems}
      paginationProps={paginationProps}
      emptyStateProps={emptyStateProps}
      loadingProps={loadingProps}
      isCompact={false}
    />
  );
};
