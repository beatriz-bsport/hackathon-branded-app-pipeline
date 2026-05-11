import { type FC, useId } from "react";

import { useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { SmartlistForm } from "#src/components/SmartlistForm";
import { SmartlistFormData } from "#src/components/SmartlistForm/shared-types";
import { useTranslation } from "#src/utils/i18n";

import { smartlistSchema } from "../SmartlistForm/schema";
import { useEdit } from "./use-edit";

type EditSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onUndo?: () => void;
  smartlist: Smartlist;
};

export const EditSmartlistModal: FC<EditSmartlistModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onUndo,
  smartlist,
}) => {
  const { t } = useTranslation("list");

  const defaultValues: SmartlistFormData = {
    name: smartlist?.name || "",
    description: smartlist?.description || "",
  };

  const { editSmartlist } = useEdit({
    onSuccess: () => {
      onClose();
      onEdit?.();
    },
    onFailure: () => {
      onClose();
    },
    onUndo: () => {
      onClose();
      onUndo?.();
    },
  });

  const methods = useFormController({
    mode: "onBlur",
    schema: smartlistSchema,
    defaultValues,
  });

  const handleSubmit = (data: SmartlistFormData) => {
    editSmartlist(
      {
        id: smartlist.id,
        name: data.name,
        description: data.description,
      },
      smartlist,
    );
  };

  const formId = useId();

  const handleClickOutside = () => {
    const { isDirty, isSubmitting } = methods.formState;
    if (isDirty || isSubmitting) return;

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onClickOutside={handleClickOutside}
      title={t("editForm.title.edit")}
      size="md"
      confirmButton={{
        label: t("editForm.actions.save"),
        type: "submit",
        form: formId,
        disabled: !methods.formState.isDirty || methods.formState.isSubmitting,
      }}
      cancelButton={{
        label: t("editForm.actions.cancel"),
        onClick: onClose,
      }}
    >
      <SmartlistForm id={formId} onSubmit={handleSubmit} {...methods} />
    </Modal>
  );
};
