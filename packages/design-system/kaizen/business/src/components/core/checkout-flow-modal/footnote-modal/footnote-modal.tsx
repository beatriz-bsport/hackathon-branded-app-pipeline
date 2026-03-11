import React, { useEffect, useId, useState } from "react";

import { Modal, TextArea } from "@bsport/kaizen-primitive-core";

import { FOOTNOTE_MAX_LENGTH } from "#src/components/core/checkout-flow-modal/schema";
import type { FootnoteCloseReason } from "#src/components/core/checkout-flow-modal/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import { footnoteModalSchema } from "./footnote-modal.schema";

export type FootnoteModalProps = {
  isOpen: boolean;
  onClose: (reason?: FootnoteCloseReason) => void;
  onSave: (value: string) => void;
  initialValue?: string | null;
};

export const FootnoteModal: React.FC<FootnoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValue,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });

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
    onClose("save");
  };

  const handleCloseCancel = () => onClose("cancel");
  const handleCloseCross = () => onClose("cross");
  const handleCloseEscapeOrOutside = () => onClose("escape");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (error) setError(null);
  };

  return (
    <Modal
      size="md"
      open={isOpen}
      title={t("checkoutFlowModal.footnoteModal.title")}
      description={t("checkoutFlowModal.footnoteModal.description")}
      onClose={handleCloseEscapeOrOutside}
      onCloseButtonClick={handleCloseCross}
      onClickOutside={handleCloseEscapeOrOutside}
      confirmButton={{
        color: "main",
        label: t("checkoutFlowModal.footnoteModal.save"),
        type: "button",
        onClick: handleSave,
      }}
      cancelButton={{
        label: t("checkoutFlowModal.footnoteModal.cancel"),
        onClick: handleCloseCancel,
      }}
    >
      <TextArea
        id={textAreaId}
        label={t("checkoutFlowModal.footnoteModal.label")}
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
