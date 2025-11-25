import { useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Modal, TextField, toast } from "@bsport/kaizen-primitive-core";
import type { CustomForm } from "@bsport/store-cdp-custom-form";

import { useCreateCustomForm } from "#src/hooks/api/use-create-form";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { customFormCreationSchema } from "#src/utils/schema";
import type { CustomFormCreationData, ModalProps } from "#src/utils/types";

type Props = ModalProps & {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const fieldIdPrefix = useId();
  const formId = `${fieldIdPrefix}-create-form-modal`;
  const defaultValues: CustomFormCreationData = {
    name: "",
  };
  const methods = useFormController({
    mode: "onBlur",
    schema: customFormCreationSchema,
    defaultValues,
  });
  const {
    formState: { isDirty, isSubmitting },
  } = methods;
  const { t } = useTranslation("common");

  const { createCustomForm } = useCreateCustomForm({
    onSuccess: (createdForm: CustomForm) => {
      onSuccess?.();
      handleClose();
      toast({
        status: "default",
        icon: "edit-02",
        title: t("toasts.messageCreated.success"),
        buttonLabel: t("toasts.actions.open"),
        onButtonClick: () => {
          if (createdForm) {
            const pathToNavigate = LEGACY_URLS.FORM_DETAILS(createdForm.id);
            window.location.assign(pathToNavigate);
          }
        },
      });
    },
    onFailure: () => {
      onFailure?.();
      handleClose();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageCreated.error"),
      });
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSaveForm = ({ formName }: { formName: string }) => {
    createCustomForm({ name: formName });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.addFormModal.title")}
      confirmButton={{
        label: t("activeList.addFormModal.actions.create"),
        type: "submit",
        form: formId,
        disabled: !isDirty || isSubmitting,
      }}
      cancelButton={{
        label: t("activeList.addFormModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-md">
        <ControlledForm
          id={formId}
          onSubmit={(data) => handleSaveForm({ formName: data.name })}
          {...methods}
        >
          <FormField<CustomFormCreationData, "name">
            name="name"
            mapProps={({ defaultProps, form, field }) => ({
              ...defaultProps,
              type: "text",
              onClear: () => {
                form.setValue("name", "", { shouldDirty: true });
                // We trigger validation after clearing the value
                field.onBlur();
              },
            })}
          >
            <TextField
              fullWidth
              id={`${fieldIdPrefix}-custom-form-name`}
              type="text"
              label={t("activeList.addFormModal.input.label")}
              placeholder={t("activeList.addFormModal.input.placeholder")}
              required
            />
          </FormField>
        </ControlledForm>
      </div>
    </Modal>
  );
};
