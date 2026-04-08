import { type FC, useId } from "react";
import type { ZodType } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { ContractFormName } from "#src/features/contract-form/components/contract-form-name";
import { useContractNameSchema } from "#src/features/contract-form/schema";
import type { ContractFormData } from "#src/features/contract-form/types";
import { useTranslation } from "#src/utils/i18n";

type ContractFormNameSchema = ZodType<Pick<ContractFormData, "name">>;

type ContractEditNameModalProps = {
  initialName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void | Promise<void>;
};

export const ContractEditNameModal: FC<ContractEditNameModalProps> = ({
  initialName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("contract-details");

  const nameSchema = useContractNameSchema();

  const internalMethods = useFormController<ContractFormNameSchema>({
    mode: "onChange",
    schema: nameSchema,
    defaultValues: { name: initialName },
  });

  const internalNameIsWrong = !!internalMethods.formState.errors.name;
  const internalNameValue = internalMethods.watch("name");
  const editNameFormId = useId();

  const handleClose = () => {
    internalMethods.reset({ name: initialName });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("editNameModal.buttons.rename"),
        color: "main",
        form: editNameFormId,
        type: "submit",
        disabled:
          internalNameValue.trim().length === 0 ||
          internalNameValue === initialName ||
          internalNameIsWrong,
      }}
      cancelButton={{
        label: t("editNameModal.buttons.back"),
        onClick: handleClose,
      }}
      onCloseButtonClick={handleClose}
      title={t("editNameModal.title")}
      size="md"
      onClickOutside={handleClose}
    >
      <div onSubmit={(e) => e.stopPropagation()}>
        <ControlledForm
          id={editNameFormId}
          onSubmit={async (data) => {
            await onConfirm(data.name);
            // Reset the internal initial value in case the changes are discarded
            internalMethods.setValue("name", initialName);
          }}
          {...internalMethods}
        >
          <ContractFormName formId={`${editNameFormId}-edit`} />
        </ControlledForm>
      </div>
    </Modal>
  );
};
