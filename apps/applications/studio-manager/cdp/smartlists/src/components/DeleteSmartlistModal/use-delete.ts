import { toast } from "@bsport/kaizen-primitive-core";
import {
  SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
  SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
  SMARTLIST_DELETION_FAILED,
  type SmartlistDeletionErrorCode,
} from "@bsport/store-cdp-smartlist";

import { useDeleteSmartlist } from "#src/api/use-delete-smartlist";
import { useTranslation } from "#src/utils/i18n";

export const useDelete = ({
  onSuccess,
  onFailure,
  onCadencesError,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
  onCadencesError?: () => void;
}) => {
  const { t } = useTranslation("list");

  const { deleteSmartlist: deleteTrigger, isLoading: isDeleting } =
    useDeleteSmartlist({
      onSuccess: () => {
        onSuccess?.();

        toast({
          status: "default",
          icon: "trash-01",
          title: t("toasts.success.deleted"),
          buttonIcon: "x-close",
        });
      },
      onFailure: (error) => {
        if (
          error.customErrorCodes?.includes(
            SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
          )
        ) {
          // cadences error need a different flow
          onCadencesError?.();
          return;
        }

        const errorCode = error.customErrorCodes?.[0];
        let errorMessage = t("toasts.error.deleteFailed");

        if (errorCode) {
          const errorMessages: Record<SmartlistDeletionErrorCode, string> = {
            [SMARTLIST_DELETION_FAILED]: t("toasts.error.deleteError.101000"),
            [SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS]: t(
              "toasts.error.deleteError.101001",
            ),
            [SMARTLIST_DELETION_BLOCKED_BY_CADENCES]: t(
              "toasts.error.deleteError.101002",
            ),
          };

          errorMessage = errorMessages[errorCode] || errorMessage;
        }

        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: errorMessage,
          buttonIcon: "x-close",
        });
      },
    });

  const deleteSmartlist = (params: { id: number }) => {
    deleteTrigger(params);
  };

  return {
    deleteSmartlist,
    isDeleting,
  } as const;
};
