import { useState } from "react";

import { toast } from "@bsport/kaizen-primitive-core";

import { useEmailTemplateSearch } from "#src/api/use-email-template-search";
import { useUpdateEmailTemplate } from "#src/api/use-update-email-template";
import { useTranslation } from "#src/utils/i18n";

import { CreateEmailTemplateModal } from "./CreateEmailTemplateModal/create-email-template-modal";
import { EmailDesignEditorModal } from "./EmailDesignManager/email-design-editor-modal";
import type {
  EmailDesignContent,
  EmailTemplateChangeResult,
} from "./EmailDesignManager/email-design-editor-types";

type ContentForCreation = {
  content: EmailDesignContent;
  subject: string;
};

export const EmailTemplateEditor = ({
  emailTemplateId,
  emailTemplateContent,
  open,
  onEmailTemplateChange,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  emailTemplateId?: number;
  emailTemplateContent?: ContentForCreation;
  onEmailTemplateChange?: (result: EmailTemplateChangeResult) => void;
}) => {
  const { t } = useTranslation("campaign");
  const [contentForCreation, setContentForCreation] =
    useState<ContentForCreation | null>(null);
  const { data: emailTemplateList } = useEmailTemplateSearch({
    searchInput: "",
    id__in: emailTemplateId?.toString() ?? "",
  });
  const emailTemplateData = emailTemplateList?.find(
    (template) => template.id === emailTemplateId,
  );

  const { updateEmailTemplate } = useUpdateEmailTemplate({
    onSuccess: (updatedTemplate) => {
      onEmailTemplateChange?.({
        design: updatedTemplate.design,
        html: updatedTemplate.html,
        subject: updatedTemplate.subject,
        emailTemplateId: updatedTemplate.id,
      });
      onClose();
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.toast.success",
        ),
        status: "default",
        icon: "save",
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.toast.failure",
        ),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
    },
  });

  return (
    <>
      {open && (
        <EmailDesignEditorModal
          open={true}
          onClose={onClose}
          value={{
            design: emailTemplateContent?.content?.design ?? "",
            html: emailTemplateContent?.content?.html ?? "",
          }}
          initialSubject={emailTemplateContent?.subject ?? ""}
          isFranchiseTemplate={emailTemplateData?.franchisor_id != null}
          onOnTheFly={(content, subject) => {
            onEmailTemplateChange?.({
              ...content,
              subject,
              emailTemplateId: null,
            });
            onClose();
          }}
          onCreateNew={(content, subject) => {
            setContentForCreation({ content, subject });
          }}
          onOverwrite={
            emailTemplateData
              ? (content, subject) =>
                  updateEmailTemplate({
                    ...emailTemplateData,
                    design: content.design,
                    html: content.html,
                    subject,
                  })
              : undefined
          }
        />
      )}
      {contentForCreation && (
        <CreateEmailTemplateModal
          open={true}
          onClose={() => setContentForCreation(null)}
          onSuccess={(result) => {
            setContentForCreation(null);
            onEmailTemplateChange?.(result);
            onClose();
          }}
          content={contentForCreation.content}
          subject={contentForCreation.subject}
        />
      )}
    </>
  );
};
