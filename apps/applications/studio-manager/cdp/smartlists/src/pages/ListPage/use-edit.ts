import { useRef } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import type {
  EditSmartlistParams,
  Smartlist,
} from "@bsport/store-cdp-smartlist";

import {
  editSmartlist as editSmartlistAction,
  useEditSmartlist,
} from "#src/api/use-edit-smartlist";
import { useTranslation } from "#src/utils/i18n";

export const useEdit = ({
  onSuccess,
  onFailure,
  onUndo,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
  onUndo?: () => void;
}) => {
  const { t } = useTranslation("list");
  const prevParamsRef = useRef<EditSmartlistParams | null>(null);

  const undoEdit = async () => {
    if (prevParamsRef.current) {
      const result = await editSmartlistAction(prevParamsRef.current);

      result.fold(
        () => {
          toast({
            status: "default",
            icon: "reverse-left",
            title: t("toasts.success.actionUndone"),
            buttonIcon: "x-close",
          });

          onUndo?.();

          prevParamsRef.current = null;
        },
        () => {
          toast({
            status: "critical",
            icon: "alert-circle",
            title: t("toasts.error.updateFailed"),
            buttonIcon: "x-close",
          });
        },
      );
    }
  };

  const { editSmartlist: editTrigger, isLoading: isEditing } = useEditSmartlist(
    {
      onSuccess: () => {
        onSuccess?.();

        toast({
          status: "positive",
          icon: "save",
          title: t("toasts.success.saved"),
          buttonLabel: t("toasts.success.undo"),
          onButtonClick: undoEdit,
        });
      },
      onFailure: () => {
        onFailure?.();

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("toasts.error.updateFailed"),
          buttonIcon: "x-close",
        });
      },
    },
  );

  const editSmartlist = async (
    params: EditSmartlistParams,
    prevSmartlist: Smartlist,
  ) => {
    if (!isEditing) {
      await editTrigger(params);

      /**
       * Why?
       * We need to store the previous smartlist params to be able to undo the edit
       */
      prevParamsRef.current = {
        id: prevSmartlist.id,
        name: prevSmartlist.name,
        description: prevSmartlist.description,
      };
    }
  };

  return {
    editSmartlist,
    isEditing,
  } as const;
};
