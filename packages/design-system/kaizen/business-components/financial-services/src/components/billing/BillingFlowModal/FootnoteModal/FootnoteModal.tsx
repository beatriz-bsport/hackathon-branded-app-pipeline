import React, { useEffect, useId, useState } from "react";

import { Modal, TextArea } from "@bsport/kaizen-primitive-core";

import { FOOTNOTE_MAX_LENGTH } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { footnoteModalSchema } from "./FootnoteModal.schema";

export type FootnoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue?: string | null;
};

export const FootnoteModal: React.FC<FootnoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const textAreaId = useId();
  const [value, setValue] = useState(initialValue ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue ?? "");
      setError(null);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    const result = footnoteModalSchema.safeParse(value.trim());
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Invalid footnote");
      return;
    }
    setError(null);
    onSave(result.data);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (error) setError(null);
  };

  return (
    <Modal
      size="md"
      open={isOpen}
      title={t("billingFlowModal.footnoteModal.title")}
      description={t("billingFlowModal.footnoteModal.description")}
      onClose={onClose}
      onCloseButtonClick={onClose}
      onClickOutside={onClose}
      confirmButton={{
        color: "main",
        label: t("billingFlowModal.footnoteModal.save"),
        type: "button",
        onClick: handleSave,
      }}
      cancelButton={{
        label: t("billingFlowModal.footnoteModal.cancel"),
        onClick: onClose,
      }}
    >
      <TextArea
        id={textAreaId}
        label={t("billingFlowModal.footnoteModal.label")}
        value={value}
        onChange={handleChange}
        helperText={
          error ??
          (value.length > 0
            ? `${value.length}/${FOOTNOTE_MAX_LENGTH}`
            : undefined)
        }
        status={error ? "error" : "default"}
        required
      />
    </Modal>
  );
};
