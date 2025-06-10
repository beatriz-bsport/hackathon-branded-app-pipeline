import { useState } from "react";

import {
  Modal,
  TextField,
  type TextFieldProps,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { EmailTemplateDetail } from "@bsport/store-cdp-email-template";

import { useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

const EMAIL_TEMPLATE_TITLE_MIN_LENGTH = 1;
const EMAIL_TEMPLATE_TITLE_MAX_LENGTH = 100;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  templateDraft: EmailTemplateDetail | null;
  refreshCategories?: () => void;
  // Temporary props for testing purposes, will be removed later
  setTitle: (title: string) => void;
} & ModalProps;

export const RenameEmailTemplateModal: React.FC<Props> = ({
  isOpen,
  templateDraft,
  onClose,
  setTitle,
}: Props) => {
  const [templateTitle, setTemplateTitle] = useState(
    templateDraft?.title || "",
  );
  const [textFieldStatus, setTextFieldStatus] =
    useState<TextFieldProps["status"]>("default");
  const { t } = useTranslation("detail");

  const handleClose = () => {
    setTemplateTitle("");
    setTextFieldStatus("default");
    onClose();
  };

  const isTemplateTitleValid = (() => {
    return (
      !!templateTitle &&
      templateTitle.length > EMAIL_TEMPLATE_TITLE_MIN_LENGTH &&
      templateTitle.length <= EMAIL_TEMPLATE_TITLE_MAX_LENGTH
    );
  })();

  const handleSaveCategory = () => {
    if (isTemplateTitleValid) {
      setTextFieldStatus("default");
      console.log("Saving template with title:", templateTitle);
    } else {
      setTextFieldStatus("error");
      toast({
        status: "critical",
        icon: "x",
        title: t("details.renameTemplateModal.onFailure.title"),
      });
    }
  };

  const handleChangeTemplateTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (textFieldStatus !== "default") setTextFieldStatus("default");
    setTemplateTitle(event.target.value);
    setTitle(event.target.value); // Temporary prop for testing purposes
  };

  const handleClearTextfield = () => {
    setTemplateTitle("");
    setTitle(""); // Temporary prop for testing purposes
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={t("details.renameTemplateModal.title")}
      confirmLabel={t("details.renameTemplateModal.confirmButton")}
      confirmColor="main"
      onConfirmClick={handleSaveCategory}
      cancelLabel={t("details.renameTemplateModal.cancelButton")}
      size="md"
    >
      <TextField
        fullWidth
        id="email-template-title-input"
        type="text"
        status={textFieldStatus}
        label={t("details.renameTemplateModal.textInput.label")}
        placeholder={t("details.renameTemplateModal.textInput.placeholder")}
        value={templateTitle}
        onChange={handleChangeTemplateTitle}
        onClear={handleClearTextfield}
        required
      />
    </Modal>
  );
};
