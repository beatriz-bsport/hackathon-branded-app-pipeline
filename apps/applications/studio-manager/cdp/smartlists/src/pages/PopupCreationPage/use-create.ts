import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";
import { CreateSmartlistPopupParams, Popup } from "@bsport/store-cdp-popup";

import { useCreateSmartlistPopup } from "#src/api/use-create-smartlist-popup";
import { fetch, xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreate = ({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) => {
  const { t } = useTranslation("campaign");
  const navigate = useNavigate();
  const { createSmartlistPopup: createTrigger, isLoading: isCreating } =
    useCreateSmartlistPopup({
      onSuccess: (popup: Popup | null) => {
        onSuccess?.();

        if (popup) {
          navigate(`/${popup.smartlist_id}/campaign`);
        }
      },
      onFailure: () => {
        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("popup.creation.toasts.error.createFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const createSmartlistPopup = async (params: CreateSmartlistPopupParams) => {
    if (!isCreating) {
      await createTrigger(params, xhr, fetch, fetch);
    }
  };

  return {
    createSmartlistPopup,
    isCreating,
  } as const;
};
