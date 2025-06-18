import { useCallback, useEffect, useRef } from "react";

import { Modal, TextField, toast } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  isOpen: boolean;
  templateTitle: string;
  error?: string;
  onBlur: (title: string) => void;
  onChange: (title: string) => void;
  onClose: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export const RenameEmailTemplateModal: React.FC<Props> = ({
  isOpen,
  templateTitle,
  error,
  onClose,
  onSave,
  onBlur,
  onChange,
  onCancel,
}: Props) => {
  const textfieldInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation("detail");

  const handleClose = () => {
    onCancel();
    onClose();
  };

  const handleSaveTemplateTitle = () => {
    onBlur(templateTitle);
    if (!error) {
      onSave(templateTitle);
      onClose();
    } else {
      toast({
        status: "critical",
        icon: "x",
        title: error ?? t("details.renameTemplateModal.onFailure.title"),
      });
    }
  };

  const handleChangeTemplateTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange(event.target.value);
  };

  const handleClearTextfield = () => {
    onChange("");
  };

  const handleBlurTextfield = useCallback(() => {
    onBlur(templateTitle);
  }, [onBlur, templateTitle]);

  useEffect(() => {
    const textfieldInputRefCurrent = textfieldInputRef.current;
    if (textfieldInputRefCurrent) {
      textfieldInputRefCurrent.focus();
      textfieldInputRefCurrent.addEventListener(
        "focusout",
        handleBlurTextfield,
      );
    }
    return () => {
      if (textfieldInputRefCurrent) {
        textfieldInputRefCurrent.removeEventListener(
          "focusout",
          handleBlurTextfield,
        );
      }
    };
  }, [isOpen, handleBlurTextfield]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={t("details.renameTemplateModal.title")}
      confirmButton={{
        label: t("details.renameTemplateModal.confirmButton"),
        onClick: handleSaveTemplateTitle,
      }}
      cancelButton={{
        label: t("details.renameTemplateModal.cancelButton"),
        onClick: handleClose,
      }}
      size="md"
    >
      <TextField
        fullWidth
        inputRef={textfieldInputRef}
        id="email-template-title-input"
        type="text"
        status={error ? "error" : "default"}
        statusText={error}
        label={t("details.renameTemplateModal.textInput.label")}
        placeholder={t("details.renameTemplateModal.textInput.placeholder")}
        value={templateTitle}
        onChange={handleChangeTemplateTitle}
        onClear={handleClearTextfield}
        // onBlur={() => handleBlurTextfield()}
        required
      />
    </Modal>
  );
};
