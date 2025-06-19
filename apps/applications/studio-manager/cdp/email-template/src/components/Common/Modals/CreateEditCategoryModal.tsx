import { useEffect, useRef, useState } from "react";

import {
  Modal,
  TextField,
  type TextFieldProps,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { EmailTemplateCategory } from "@bsport/store-cdp-email-template";

import { useCreateCategory } from "#src/hooks/api/use-create-category";
import { useUpdateCategory } from "#src/hooks/api/use-update-category";
import { useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

const CATEGORY_NAME_MIN_LENGTH = 0;
const CATEGORY_NAME_MAX_LENGTH = 100;
type Props = {
  isOpen: boolean;
  onClose: () => void;
  categoryDraft: EmailTemplateCategory | null;
  refreshCategories?: () => void;
} & ModalProps;

export const CreateEditCategoryModal: React.FC<Props> = ({
  isOpen,
  categoryDraft,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const textfieldInputRef = useRef<HTMLInputElement | null>(null);
  const [categoryName, setCategoryName] = useState(categoryDraft?.name || "");
  const [textFieldStatus, setTextFieldStatus] =
    useState<TextFieldProps["status"]>("default");
  const { t } = useTranslation("list");

  // Translation keys based on mode
  const translations = {
    modal: {
      title: t(
        `activeList.${categoryDraft ? "renameCategoryModal" : "createCategoryModal"}.title`,
      ),
      confirmButton: t(
        `activeList.${categoryDraft ? "renameCategoryModal" : "createCategoryModal"}.confirmButton`,
      ),
      cancelButton: t("activeList.createCategoryModal.cancelButton"),
    },
    textInput: {
      label: t(
        `activeList.${categoryDraft ? "renameCategoryModal" : "createCategoryModal"}.textInput.label`,
      ),
      placeholder: t(
        `activeList.${categoryDraft ? "renameCategoryModal" : "createCategoryModal"}.textInput.placeholder`,
      ),
      id: `${categoryDraft ? "edit" : "create"}-category-title-input`,
    },
    toast: {
      success: {
        title: categoryDraft
          ? t("activeList.renameCategoryModal.onSuccess.title")
          : t("activeList.createCategoryModal.onSuccess.title"),
      },
      failure: {
        title: categoryDraft
          ? t("activeList.renameCategoryModal.onFailure.title")
          : t("activeList.createCategoryModal.onFailure.title"),
      },
    },
  };

  const handleClose = () => {
    setCategoryName("");
    setTextFieldStatus("default");
    onClose();
  };

  const { createCategory } = useCreateCategory({
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x-close",
        title: translations.toast.failure.title,
      });
      handleClose();
    },
  });

  const { updateCategory } = useUpdateCategory({
    onSuccess: (updatedCategory: EmailTemplateCategory) => {
      if (updatedCategory.name !== categoryDraft?.name) {
        toast({
          status: "default",
          icon: "edit-02",
          title: translations.toast.success.title,
          buttonLabel: t("activeList.renameCategoryModal.onSuccess.action"),
          onButtonClick: () => {
            updateCategory({
              ...updatedCategory,
              name: categoryDraft?.name ?? "",
            });
          },
        });
      } else {
        toast({
          status: "default",
          icon: "reverse-left",
          buttonIcon: "x-close",
          title: t("activeList.actions.undo.success"),
        });
      }
      onSuccess?.();
      handleClose();
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: translations.toast.failure.title,
      });
      handleClose();
    },
  });

  const isCategoryNameValid = () => {
    return (
      !!categoryName &&
      categoryName.length > CATEGORY_NAME_MIN_LENGTH &&
      categoryName.length <= CATEGORY_NAME_MAX_LENGTH
    );
  };

  const handleSaveCategory = () => {
    if (isCategoryNameValid()) {
      setTextFieldStatus("default");
      if (categoryDraft) {
        updateCategory({
          ...categoryDraft,
          name: categoryName,
        });
        return;
      }
      createCategory({ name: categoryName });
    } else {
      setTextFieldStatus("error");
      toast({
        status: "critical",
        icon: "x",
        title: t("activeList.createCategoryModal.errors.name"),
      });
    }
  };

  const handleChangeCategoryName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (textFieldStatus !== "default") setTextFieldStatus("default");
    setCategoryName(event.target.value);
  };

  const handleClearTextfield = () => {
    setCategoryName("");
  };

  useEffect(() => {
    if (textfieldInputRef.current) {
      textfieldInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={translations.modal.title}
      confirmButton={{
        label: translations.modal.confirmButton,
        onClick: handleSaveCategory,
      }}
      cancelButton={{
        label: translations.modal.cancelButton,
        onClick: handleClose,
      }}
      size="md"
    >
      <TextField
        inputRef={textfieldInputRef}
        fullWidth
        id={translations.textInput.id}
        type="text"
        status={textFieldStatus}
        label={translations.textInput.label}
        placeholder={translations.textInput.placeholder}
        value={categoryName}
        onChange={handleChangeCategoryName}
        onClear={handleClearTextfield}
        required
      />
    </Modal>
  );
};
