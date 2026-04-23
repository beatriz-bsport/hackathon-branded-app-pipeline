import { useState } from "react";

import {
  Body,
  Icon,
  Modal,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

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
  const isMobile = !useMatchMedia("md");

  return (
    <Modal
      open={open}
      onClose={onClose}
      onClickOutside={() => {}}
      confirmButton={
        isMobile
          ? {
              label: t(
                "email.creation.form.emailTemplateEditor.cannotUseEmailEditorOnMobile.confirmButtonLabel",
              ),
              onClick: () => onClose(),
            }
          : {
              label: t(
                "email.creation.form.emailTemplateEditor.confirmButtonLabel",
              ),
              onClick: () => setShowActions(true),
            }
      }
      title={t("email.creation.form.emailTemplateEditor.title")}
      size="xl"
    >
      {isMobile ? (
        <div className="flex flex-col items-center justify-center text-center gap-sm py-xl">
          <Icon icon="monitor-04" size="lg" />
          <Body htmlVariant="p" size="md" weight="weak">
            {t(
              "email.creation.form.emailTemplateEditor.cannotUseEmailEditorOnMobile.description",
            )}
          </Body>
        </div>
      ) : (
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
      )}
      {showActions ? (
        <EmailDesignEditorActionsModal
          open={true}
          isFranchiseTemplate={isFranchiseTemplate}
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
