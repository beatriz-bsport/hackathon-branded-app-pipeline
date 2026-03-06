import {
  Button,
  Chip,
  type GenericTableColumn,
  Menu,
  Popover,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { InvoiceTableRow } from "./types";

type TableColumn = GenericTableColumn<InvoiceTableRow>;

export const useInvoiceTableColumns = ({
  onDownloadPdf,
  onDownloadReceipt,
}: {
  onDownloadPdf: (invoiceUuid: string) => void;
  onDownloadReceipt: (invoiceUuid: string) => void;
}) => {
  const { t } = useTranslation("invoice");

  const columns: TableColumn[] = [
    {
      id: "uuid",
      keyPath: "uuid",
      header: t("tableColumnLabel.number"),
      type: "string",
    },
    {
      id: "date",
      keyPath: "date",
      header: t("tableColumnLabel.date"),
      type: "date",
    },
    {
      id: "memberLink",
      keyPath: "member",
      header: t("tableColumnLabel.member"),
      type: "string",
    },
    {
      id: "amount",
      keyPath: "amount",
      header: t("tableColumnLabel.amount"),
      type: "price",
      align: "end",
      priceColoring: {
        negative: "critical",
      },
    },
    {
      id: "type",
      keyPath: "type",
      header: t("tableColumnLabel.type"),
      type: "string",
    },
    {
      id: "status",
      keyPath: "status",
      header: t("tableColumnLabel.status"),
      type: "custom",
      render: (row) => (
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
      ),
    },
    {
      id: "downloadPdf",
      keyPath: "downloadPdf",
      header: "",
      type: "custom",
      align: "center",
      render: (row) => {
        const button = (
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

        return row.downloadPdf.is_draft ? (
          <Tooltip
            label={t("download.explainPdfDraft")}
            placement="bottom-right"
          >
            {button}
          </Tooltip>
        ) : (
          button
        );
      },
    },
  ];

  return columns;
};
