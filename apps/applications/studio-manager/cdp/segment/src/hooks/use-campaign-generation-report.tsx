import { useState } from "react";

import { type SelectedDate, toast } from "@bsport/kaizen-primitive-core";

import { useGenerateCampaignReport } from "#src/api/use-generate-campaign-report";
import { CampaignReportModal } from "#src/components/CampaignReportModal/CampaignReportModal";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";
import { downloadFileFromUrl } from "#src/utils/utils";

const REPORT_DATE_FILTER_LUXON_FORMAT = "yyyy-MM-dd";

type UseCampaignGenerationReportOptions = {
  smartlistId: string;
};

type ReportDateRange = {
  startDate: string;
  endDate: string;
};

/**
 * Validates and formats the selected date range for report generation.
 */
const parseReportDateRange = (selectedDate: SelectedDate): ReportDateRange => {
  invariant(
    Array.isArray(selectedDate) && selectedDate.length >= 2,
    "Could not generate report: no date selected in the DatePicker",
  );

  const startDate = selectedDate[0]?.toFormat(REPORT_DATE_FILTER_LUXON_FORMAT);
  const endDate = selectedDate[1]?.toFormat(REPORT_DATE_FILTER_LUXON_FORMAT);

  invariant(
    startDate && endDate,
    "Could not generate report: no formatted date",
  );

  return { startDate, endDate };
};

/**
 * Encapsulates campaign report generation: modal state, date formatting,
 * API mutation, file download, and toast feedback.
 */
export function useCampaignGenerationReport({
  smartlistId,
}: UseCampaignGenerationReportOptions) {
  invariant(smartlistId, "Expected smartlistId to be defined");

  const { t } = useTranslation("campaign");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const generateCampaignReport = useGenerateCampaignReport({
    onSuccess: (cdnUrl) => {
      downloadFileFromUrl(cdnUrl, {
        onSuccess: () => {
          toast({
            status: "positive",
            icon: "download-01",
            description: t("generateReportModal.toast.success"),
            buttonIcon: "x-close",
          });
        },
        onError: () => {
          toast({
            status: "critical",
            icon: "alert-circle",
            description: t("generateReportModal.toast.downloadFailed"),
            buttonIcon: "x-close",
          });
        },
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("generateReportModal.toast.generationFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const startReportGeneration = async (selectedDate: SelectedDate) => {
    let dateRange: ReportDateRange;

    try {
      dateRange = parseReportDateRange(selectedDate);
    } catch {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("generateReportModal.toast.startReportGenerationFailed"),
        buttonIcon: "x-close",
      });
      return;
    }

    try {
      await generateCampaignReport.mutateAsync({
        smartlistId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    } catch {
      // Mutation errors are surfaced via onError above.
    }
  };

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleConfirmReport = (selectedDate: SelectedDate) => {
    toast({
      status: "default",
      icon: "send-01",
      description: t("generateReportModal.toast.pending"),
      duration: 3000,
      buttonIcon: "x-close",
    });
    startReportGeneration(selectedDate);
    closeReportModal();
  };

  const reportModal = isReportModalOpen ? (
    <CampaignReportModal
      isOpen
      onConfirm={handleConfirmReport}
      onClose={closeReportModal}
    />
  ) : null;

  return {
    openReportModal,
    reportModal,
  };
}
