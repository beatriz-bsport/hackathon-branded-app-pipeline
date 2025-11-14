import { type FC, useId } from "react";

import { useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SmartlistForm } from "#src/components/SmartlistForm";
import { SmartlistFormData } from "#src/components/SmartlistForm/shared-types";
import { useTranslation } from "#src/utils/i18n";

import { smartlistSchema } from "../SmartlistForm/schema";
import { useCreate } from "./use-create";

type CreateSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: () => void;
};

export const CreateSmartlistModal: FC<CreateSmartlistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation("list");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const defaultValues: SmartlistFormData = {
    name: "",
    description: "",
  };

  const { createSmartlist } = useCreate({
    onSuccess: () => {
      onCreate?.();
      onClose();
    },
    onFailure: () => {
      onClose();
    },
  });

  const methods = useFormController({
    mode: "onBlur",
    schema: smartlistSchema,
    defaultValues,
  });

  const handleSubmit = (data: SmartlistFormData) => {
    if (!companyTheme?.id) {
      return;
    }

    createSmartlist({
      name: data.name,
      description: data.description,
      company: companyTheme.company,
    });
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
      title={t("createForm.title")}
      description={t("createForm.subtitle")}
      size="md"
      confirmButton={{
        label: t("createForm.actions.create"),
        type: "submit",
        form: formId,
        disabled: !methods.formState.isDirty || methods.formState.isSubmitting,
      }}
      cancelButton={{
        label: t("createForm.actions.cancel"),
        onClick: onClose,
      }}
    >
      <SmartlistForm id={formId} onSubmit={handleSubmit} {...methods} />
    </Modal>
  );
};
