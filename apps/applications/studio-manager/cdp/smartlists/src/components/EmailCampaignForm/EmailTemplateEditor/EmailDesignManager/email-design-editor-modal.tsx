import { useState } from "react";

import { Chip, Modal, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EmailDesignEditor } from "./email-design-editor";
import { EmailDesignEditorActionsModal } from "./email-design-editor-actions-modal";
import type { EmailDesignContent } from "./email-design-editor-types";

export type EmailDesignEditorModalProps = {
  /** Whether the modal is open. */
  open: boolean;
  /** The function to call when the modal is closed. */
  onClose: () => void;
  /** Initial design content shown in the editor. The modal owns this state internally. */
  value: EmailDesignContent;
  /** Initial email subject shown in the subject field. The modal owns this state internally. */
  initialSubject?: string;
  /** Called with the current content and subject when the user picks "use for this campaign only". */
  onOnTheFly: (content: EmailDesignContent, subject: string) => void;
  /** Called with the current content and subject when the user picks "save as new template". */
  onCreateNew: (content: EmailDesignContent, subject: string) => void;
  /**
   * Called with the current content and subject when the user picks "overwrite existing template".
   * When undefined the overwrite option is shown as disabled.
   */
  onOverwrite?: (content: EmailDesignContent, subject: string) => void;
  /** Whether the template is a franchise template. */
  isFranchiseTemplate?: boolean;
};

export const EmailDesignEditorModal = ({
  open,
  onClose,
  value,
  initialSubject = "",
  isFranchiseTemplate = false,
  onOnTheFly,
  onCreateNew,
  onOverwrite,
}: EmailDesignEditorModalProps) => {
  const { t } = useTranslation("campaign");
  const [showActions, setShowActions] = useState(false);
  const [content, setContent] = useState<EmailDesignContent>(value);
  const [subject, setSubject] = useState(initialSubject);

  return (
    <Modal
      open={open}
      onClose={onClose}
      confirmButton={{
        label: t("email.creation.form.emailTemplateEditor.confirmButtonLabel"),
        onClick: () => setShowActions(true),
      }}
      description={
        isFranchiseTemplate ? (
          <Chip
            label={t(
              "email.creation.form.emailTemplateEditor.franchiseTemplateLabel",
            )}
            color="info"
            type="weak"
            size="lg"
          />
        ) : null
      }
      title={t("email.creation.form.emailTemplateEditor.title")}
      size="xl"
    >
      <div className="flex flex-col gap-md">
        <TextField
          id="email-design-editor-subject"
          label={t("email.creation.form.emailTemplateEditor.subjectLabel")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        />
        <EmailDesignEditor value={content} onChange={setContent} />
      </div>
      {showActions ? (
        <EmailDesignEditorActionsModal
          open={true}
          canOverwrite={onOverwrite !== undefined && !isFranchiseTemplate}
          onOnTheFly={() => onOnTheFly(content, subject)}
          onCreateNew={() => onCreateNew(content, subject)}
          onOverwrite={() => onOverwrite?.(content, subject)}
          onClose={() => setShowActions(false)}
        />
      ) : null}
    </Modal>
  );
};
