import { useCallback, useEffect, useMemo } from "react";

import {
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_REVERSE,
} from "@bsport/common/lib/master-data/invoice-type.js";
import {
  Button,
  Chip,
  type GenericTableColumn,
  ListLayout,
  Menu,
  Popover,
  Table,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import {
  type Invoice,
  InvoiceStatusEnum,
  fetchInvoicesAction,
  finalizeInvoiceAction,
  getReceiptUrlAction,
  selectCount,
  selectInvoices,
  useInvoiceStore,
} from "@bsport/store-financial-services-invoice";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type TableDataRow = {
  id: string;
  uuid: string;
  date: string;
  member: string;
  amount: number;
  type: string;
  status: Array<{
    label: string;
    color: "positive" | "critical" | "warning" | "default";
  }>;
  downloadPdf: {
    uuid: string;
    is_draft: boolean;
    is_receipt_available: boolean;
  };
};

export const InvoiceListPage = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const invoices = useInvoiceStore(selectInvoices);
  const count = useInvoiceStore(selectCount);
  const { t } = useTranslation("invoice");

  const _fetchInvoicesPage = useCallback(async () => {
    return fetchInvoicesAction(fetch, {
      page: currentPage,
      pageSize: currentPageSize,
    });
  }, [currentPage, currentPageSize]);

  const [{ isLoading }, fetchData] = useAsync<typeof _fetchInvoicesPage>({
    asyncFn: _fetchInvoicesPage,
    dependencies: [_fetchInvoicesPage],
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClickDownload = useCallback((invoiceUuid: string) => {
    const newWindow = window.open("", "_blank");
    finalizeInvoiceAction(fetch, invoiceUuid).then((response) => {
      response.fold(
        ({ stripe_invoice_pdf }) => {
          if (stripe_invoice_pdf && newWindow) {
            newWindow.location.href = stripe_invoice_pdf;
          } else {
            newWindow?.close();
          }
        },
        (error) => {
          console.error(error);
          newWindow?.close();
        },
      );
    });
  }, []);

  const getInvoiceType = useCallback((invoice: Invoice) => {
    switch (invoice.invoice_type) {
      case INVOICE_TYPE_MIGRATION:
        return "migration";
      case INVOICE_TYPE_REVERSE:
        return "return";
      case INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER:
        return "credit_payment";
      default:
        return [InvoiceStatusEnum.VOIDED, InvoiceStatusEnum.REFUNDED].includes(
          invoice.status,
        )
          ? "reversed"
          : "regular";
    }
  }, []);

  const columns: GenericTableColumn<TableDataRow>[] = useMemo(
    () => [
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
            {row.status.map((status, index) => (
              <Chip
                key={index}
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
                        handleClickDownload(row.downloadPdf.uuid);
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
                        handleClickDownload(row.downloadPdf.uuid);
                      } else if (id === "download-receipt") {
                        getReceiptUrlAction(fetch, row.downloadPdf.uuid).then(
                          (response) => {
                            response.fold(
                              (value) => window.open(value, "_blank"),
                              (error) => console.error(error),
                            );
                          },
                        );
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
    ],
    [handleClickDownload, t],
  );

  const getStatusColor = (
    status: InvoiceStatusEnum,
  ): "positive" | "critical" | "warning" | "default" => {
    const statusColorMap: Record<
      InvoiceStatusEnum,
      "positive" | "critical" | "warning" | "default"
    > = {
      [InvoiceStatusEnum.PAID]: "positive",
      [InvoiceStatusEnum.REFUNDED]: "critical",
      [InvoiceStatusEnum.VOIDED]: "warning",
      [InvoiceStatusEnum.OPEN]: "default",
      [InvoiceStatusEnum.DRAFT]: "default",
    };
    return statusColorMap[status] ?? "default";
  };

  const rows: TableDataRow[] = useMemo(
    () =>
      invoices.map((invoice) => ({
        id: `row-${invoice.uuid}`,
        link: `/invoice/${invoice.uuid}`,
        uuid: invoice.uuid.slice(0, 8),
        date: invoice.date,
        member: invoice.memberName,
        amount:
          // Balance adjustment are not real invoices, so we use the paid amount instead of the total due amount
          invoice.invoice_type !== INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER
            ? invoice.amount_due_cts / 100
            : invoice.amount_paid_cts / 100,
        type: t(`invoiceType.${getInvoiceType(invoice)}`),
        status: [
          {
            label: t(`invoiceStatus.${invoice.status}`),
            color: getStatusColor(invoice.status),
          },
        ],
        downloadPdf: {
          uuid: invoice.uuid,
          is_draft: invoice.is_draft,
          is_receipt_available: invoice.is_v2 && invoice.payments.length > 0,
        },
      })),
    [invoices, getInvoiceType, t],
  );

  return (
    <ListLayout className="w-full">
      <ListLayout.Header
        // TODO: Uncomment when backend work is done
        /*callToActionButton={
          <Button
            iconLeft="bell-03"
            intent="call-to-action"
            color="main"
            size="md"
            label="Export invoices"
            onClick={() => console.log("Export invoices clicked")}
          />
        }
        filterConfig={{
          filters: [
            { id: "is", label: t("filters.is") },
            { id: "is-not", label: t("filters.is-not") },
          ],
          fields: {
            status: {
              id: "status",
              label: t("tableColumnLabel.status"),
              availableFilters: ["is", "is-not"],
              values: [
                { id: "open", label: t("invoiceStatus.open") },
                { id: "past-due", label: t("invoiceStatus.past_due") },
                { id: "paid", label: t("invoiceStatus.paid") },
                { id: "refunded", label: t("invoiceStatus.refunded") },
                { id: "voided", label: t("invoiceStatus.voided") },
              ],
              multiSelect: true,
            },
            type: {
              id: "type",
              label: t("tableColumnLabel.type"),
              availableFilters: ["is", "is-not"],
              values: [
                { id: "regular", label: t("invoiceType.regular") },
                { id: "reversed", label: t("invoiceType.reversed") },
                { id: "migration", label: t("invoiceType.migration") },
                { id: "return", label: t("invoiceType.return") },
                {
                  id: "credit_payment",
                  label: t("invoiceType.credit_payment"),
                },
              ],
              multiSelect: false,
            },
          },
          selectFieldLabel: "Filter",
          onFilterChange: (filters) =>
            console.log(`Filters changed: ${filters}`),
        }}*/
        pageTitle={t("invoiceListTitle")}
      />
      <ListLayout.Content className="flex-col">
        <Table
          columns={columns}
          rows={rows}
          paginationProps={{
            currentPage,
            rowsPerPage: currentPageSize,
            totalItems: count,
            showRowsPerPageSelector: true,
            onPageSettingsChange: setPageSettings,
            disabled: isLoading,
          }}
          emptyStateProps={{
            isEmpty: count === 0,
            emptyConfig: {
              title: t("emptyTable.title"),
              subtitle: t("emptyTable.description"),
              className: "h-full justify-center",
            },
          }}
          loadingProps={{ isLoading: isLoading && invoices.length === 0 }}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default InvoiceListPage;
