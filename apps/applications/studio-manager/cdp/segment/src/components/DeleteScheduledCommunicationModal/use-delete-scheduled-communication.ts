import { toast } from "@bsport/kaizen-primitive-core";

import { useDeleteScheduledCommunication as useDeleteScheduledCommunicationApi } from "#src/api/use-delete-scheduled-communication";
import { useTranslation } from "#src/utils/i18n";

type DeleteParams = {
  scheduledCampaignId: string;
  smartlistId: string;
};

export const useDeleteScheduledCommunication = (options?: {
  onDeleted?: () => void;
}) => {
  const { t } = useTranslation("campaign");

  const { deleteScheduledCommunication, isDeleting } =
    useDeleteScheduledCommunicationApi({
      onSuccess: () => {
        toast({
          status: "default",
          icon: "trash-01",
          title: t("table.campaignScheduled.toasts.success.deleted"),
          buttonIcon: "x-close",
        });
        options?.onDeleted?.();
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("table.campaignScheduled.toasts.error.deleteFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const deleteScheduledCommunicationAction = (params: DeleteParams) => {
    deleteScheduledCommunication(params);
  };

  return {
    deleteScheduledCommunication: deleteScheduledCommunicationAction,
    isDeleting,
  } as const;
};
