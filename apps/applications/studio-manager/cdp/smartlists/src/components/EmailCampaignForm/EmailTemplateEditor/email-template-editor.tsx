import { useState } from "react";

import type { EmailTemplateDetail } from "@bsport/api-cdp";

import { EmailDesignEditorModal } from "./EmailDesignManager/email-design-editor-modal";
import type { EmailDesignContent } from "./EmailDesignManager/email-design-editor-types";
import { useEmailTemplateActions } from "./use-email-template-actions";

export const EmailTemplateEditor = ({
  defaultEmailTemplate,
  open,
  onEmailTemplateChange,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  defaultEmailTemplate?: EmailTemplateDetail;
  onEmailTemplateChange?: ({ design, html }: EmailDesignContent) => void;
}) => {
  const [content, setContent] = useState<EmailDesignContent>({
    design: defaultEmailTemplate?.design ?? "",
    html: defaultEmailTemplate?.html ?? "",
  });

  const { actions } = useEmailTemplateActions({
    onSuccess: ({ design, html }) => {
      onEmailTemplateChange?.({
        design,
        html,
      });
    },
    onClose,
    emailTemplate: defaultEmailTemplate,
  });

  return (
    <EmailDesignEditorModal
      open={open}
      onClose={onClose}
      actions={actions}
      resetKey={defaultEmailTemplate?.id}
      value={content}
      onChange={(next) => {
        setContent(next);
      }}
    />
  );
};
