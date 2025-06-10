import { useEffect, useRef, useState } from "react";

import { Body, Modal, TextField, toast } from "@bsport/kaizen-primitive-core";
import type { CustomForm } from "@bsport/store-cdp-custom-form";

import { useCreateCustomForm } from "#src/hooks/api/use-create-form";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

const FORM_NAME_MIN_LENGTH = 1;
const FORM_NAME_MAX_LENGTH = 100;

type TextfieldStatuses = "default" | "positive" | "error" | undefined;

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
  const [formName, setFormName] = useState("");
  const [textFieldStatus, setTextFieldStatus] =
    useState<TextfieldStatuses>("default");
  const inputRef = useRef<HTMLInputElement | null>(null);
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
    setFormName("");
    setTextFieldStatus("default");
    onClose();
  };

  const formNameError = (() => {
    if (formName.length < FORM_NAME_MIN_LENGTH) {
      return t("activeList.addFormModal.errors.nameTooShort", {
        minimalLength: FORM_NAME_MIN_LENGTH,
      });
    }
    if (formName.length > FORM_NAME_MAX_LENGTH) {
      return t("activeList.addFormModal.errors.nameTooLong", {
        maximalLength: FORM_NAME_MAX_LENGTH,
      });
    }
    if (formName.trim() === "") {
      return t("activeList.addFormModal.errors.nameRequired");
    }
    return null;
  })();

  const handleSaveForm = () => {
    if (!formNameError) {
      setTextFieldStatus("default");
      createCustomForm({ name: formName });
    } else {
      setTextFieldStatus("error");
      toast({
        status: "critical",
        icon: "x",
        title: formNameError,
      });
    }
  };

  const handleChangeFormName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (textFieldStatus !== "default") setTextFieldStatus("default");
    setFormName(event.target.value);
  };

  const handleClearTextfield = () => {
    setFormName("");
  };

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.addFormModal.title")}
      confirmLabel={t("activeList.addFormModal.actions.create")}
      confirmColor="main"
      onConfirmClick={handleSaveForm}
      cancelLabel={t("activeList.addFormModal.actions.cancel")}
      size="md"
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p">{t("activeList.addFormModal.description")}</Body>
        <TextField
          inputRef={inputRef}
          fullWidth
          id="create-custom-form-name-input"
          type="text"
          status={textFieldStatus}
          label={t("activeList.addFormModal.input.label")}
          placeholder={t("activeList.addFormModal.input.placeholder")}
          value={formName}
          onChange={handleChangeFormName}
          onClear={handleClearTextfield}
          required
        />
      </div>
    </Modal>
  );
};
