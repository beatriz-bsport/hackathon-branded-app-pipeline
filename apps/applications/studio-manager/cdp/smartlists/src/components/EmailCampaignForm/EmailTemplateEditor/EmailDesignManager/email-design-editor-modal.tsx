import { useState } from "react";

import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EmailDesignEditor } from "./email-design-editor";
import { EmailDesignEditorActionsModal } from "./email-design-editor-actions-modal";
import type {
  EmailDesignContent,
  EmailDesignEditorAction,
} from "./email-design-editor-types";

export type EmailDesignEditorModalProps = {
  /**
   * Whether the modal is open.
   */
  open: boolean;
  /**
   * The function to call when the modal is closed.
   */
  onClose: () => void;
  /**
   * The actions to display in the modal to let the user choose what to do with the design.
   */
  actions: EmailDesignEditorAction[];
  /**
   * A key that forces the Unlayer design to reload.
   * Use this when switching between different templates while the component stays mounted.
   */
  resetKey?: string | number;
  /**
   * The current design content to display in the editor along with the current HTML preview.
   */
  value: EmailDesignContent;
  /**
   * The function to call when the design content changes to update the current HTML preview.
   */
  onChange?: (next: EmailDesignContent) => void;
};

export const EmailDesignEditorModal = ({
  open,
  onClose,
  actions,
  resetKey,
  value,
  onChange,
}: EmailDesignEditorModalProps) => {
  const { t } = useTranslation("campaign");
  const [showActions, setShowActions] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      confirmButton={{
        label: t("email.creation.form.emailTemplateEditor.confirmButtonLabel"),
        onClick: () => setShowActions(true),
      }}
      title={t("email.creation.form.emailTemplateEditor.title")}
      size="xl"
    >
      <EmailDesignEditor
        resetKey={resetKey}
        value={value}
        onChange={onChange}
      />
      {showActions ? (
        <EmailDesignEditorActionsModal
          open={true}
          actions={actions}
          content={value}
          onClose={() => setShowActions(false)}
        />
      ) : null}
    </Modal>
  );
};
