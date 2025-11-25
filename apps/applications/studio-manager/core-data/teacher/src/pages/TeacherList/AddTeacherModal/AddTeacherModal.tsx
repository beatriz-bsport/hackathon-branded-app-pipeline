import React, { useEffect, useRef, useState } from "react";

import { Modal, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type AddTeacherModalProps = {
  open?: boolean;
  onConfirmClick: (input: string, callback: () => void) => void;
  onClose: () => void;
};

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  open,
  onClose,
  onConfirmClick,
}) => {
  const { t } = useTranslation("common");

  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inputRef?.current) {
      inputRef.current?.focus?.();
    }
  }, [open]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowError(false);
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue("");
    setShowError(false);
  };

  const handleConfirm = () => {
    if (!value) {
      setShowError(true);
    } else {
      onConfirmClick(value, handleClear);
    }
  };

  return (
    <Modal
      open={!!open}
      confirmButton={{
        label: t("activeList.addTeacherModal.actions.add"),
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("activeList.addTeacherModal.actions.back"),
        onClick: onClose,
      }}
      onClose={onClose}
      onCloseButtonClick={onClose}
      size="md"
      title={t("activeList.actions.addTeacher")}
    >
      <TextField
        label={t("activeList.addTeacherModal.input.label")}
        id="input-teacher-email"
        placeholder={t("activeList.addTeacherModal.input.placeholder")}
        required
        fullWidth
        type="email"
        inputRef={inputRef}
        onClear={handleClear}
        className="w-full"
        autoFocus
        value={value}
        onChange={handleValueChange}
        status={showError ? "error" : "default"}
        statusText={
          showError
            ? t("activeList.addTeacherModal.input.missingEmailError")
            : undefined
        }
      />
    </Modal>
  );
};
