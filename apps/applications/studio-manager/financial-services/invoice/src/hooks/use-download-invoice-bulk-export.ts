import { useCallback, useState } from "react";

import { downloadInvoiceBulkExportAPI } from "@bsport/api-financial-services";
import { HTTPException } from "@bsport/fetch";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const EXPORT_STATUS_COMPLETED = "completed" as const;
const EXPORT_STATUS_COMPLETED_NO_INVOICE = "completed_no_invoice" as const;

type UseDownloadInvoiceBulkExportOptions = {
  onCompleted?: () => void;
};

export const useDownloadInvoiceBulkExport = (
  options?: UseDownloadInvoiceBulkExportOptions,
) => {
  const { t } = useTranslation("invoice");
  const [loading, setLoading] = useState(false);

  const download = useCallback(
    async ({ year, month }: { year: number; month: number }) => {
      setLoading(true);
      try {
        const payload = await downloadInvoiceBulkExportAPI(fetch, {
          year,
          month,
        });

        if (payload.export_status === EXPORT_STATUS_COMPLETED_NO_INVOICE) {
          toast({
            status: "default",
            icon: "check",
            description: t("bulkExport.successNoInvoices"),
          });
          return;
        }

        if (
          payload.export_status === EXPORT_STATUS_COMPLETED &&
          payload.zip_file_url
        ) {
          window.open(payload.zip_file_url, "_blank");
          toast({
            status: "default",
            icon: "check",
            description: t("bulkExport.toastDownloaded"),
          });
          options?.onCompleted?.();
          return;
        }

        toast({
          status: "critical",
          icon: "alert-circle",
          description: t("bulkExport.error.default"),
        });
      } catch (err) {
        if (err instanceof HTTPException) {
          const code = err.customErrorCodes?.[0];
          const defaultMsg = t("bulkExport.error.default");
          const message =
            typeof code === "number"
              ? (t as (k: string) => string)(`bulkExport.error.${code}`) ||
                defaultMsg
              : defaultMsg;
          toast({
            status: "critical",
            icon: "alert-circle",
            description: message,
          });
          return;
        }

        toast({
          status: "critical",
          icon: "alert-circle",
          description: t("bulkExport.error.default"),
        });
      } finally {
        setLoading(false);
      }
    },
    [options, t],
  );

  return { download, loading };
};
