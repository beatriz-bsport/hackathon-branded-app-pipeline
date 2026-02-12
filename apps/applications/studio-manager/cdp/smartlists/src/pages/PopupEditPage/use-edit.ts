import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";
import type { EditPopupParams } from "@bsport/store-cdp-popup";

import { useEditPopup } from "#src/api/use-edit-popup";
import { fetch, xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useEdit = ({
  smartlistId,
  onSuccess,
  onFailure,
}: {
  smartlistId: number;
  onSuccess?: () => void;
  onFailure?: () => void;
}) => {
  const { t } = useTranslation("campaign");
  const navigate = useNavigate();
  const { editPopup: editTrigger, isLoading: isEditing } = useEditPopup({
    onSuccess: () => {
      onSuccess?.();

      navigate(`/${smartlistId}/campaign`);
    },
    onFailure: () => {
      onFailure?.();

      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("popup.edit.toasts.error.editFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const editPopup = async (params: EditPopupParams) => {
    if (!isEditing) {
      await editTrigger(params, xhr, fetch);
    }
  };

  return {
    editPopup,
    isEditing,
  } as const;
};
