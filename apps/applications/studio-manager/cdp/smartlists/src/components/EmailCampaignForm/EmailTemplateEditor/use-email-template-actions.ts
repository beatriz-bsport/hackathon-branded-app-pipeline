import type { EmailTemplateDetail } from "@bsport/api-cdp";
import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateEmailTemplate } from "#src/api/use-update-email-template";
import { useTranslation } from "#src/utils/i18n";

import type {
  EmailDesignContent,
  EmailDesignEditorAction,
} from "./EmailDesignManager/email-design-editor-types";

export const useEmailTemplateActions = ({
  onSuccess,
  onClose,
  emailTemplate,
}: {
  onSuccess?: ({ design, html }: EmailDesignContent) => void;
  onClose: () => void;
  emailTemplate?: EmailTemplateDetail;
}) => {
  const { t } = useTranslation("campaign");
  const { updateEmailTemplate } = useUpdateEmailTemplate({
    onSuccess: (updatedTemplate) => {
      onSuccess?.({
        design: updatedTemplate.design,
        html: updatedTemplate.html,
      });
      onClose?.();
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.toast.success",
        ),
        status: "default",
        icon: "save",
      });
    },
    onError: () => {
      toast({
        title: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.toast.failure",
        ),
        status: "critical",
        icon: "alert-circle",
      });
    },
  });

  const handleOverwriteExistingTemplate = ({
    emailTemplate,
    design,
    html,
  }: {
    emailTemplate: EmailTemplateDetail;
    design: string;
    html: string;
  }) => {
    if (emailTemplate && design && html) {
      updateEmailTemplate({
        ...emailTemplate,
        design,
        html,
      });
    }
  };

  const handleOnTheFlyTemplate = () => {
    console.log("On the fly template");
    onClose?.();
  };

  const handleCreateNewTemplate = () => {
    console.log("Create new template");
  };

  const actions: EmailDesignEditorAction[] = [
    {
      id: "overwriteExistingTemplate",
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.helperText",
      ),
      run: async ({ content }) => {
        if (!emailTemplate) return;
        handleOverwriteExistingTemplate({
          emailTemplate,
          design: content.design,
          html: content.html,
        });
      },
    },
    {
      id: "onTheFlyTemplate",
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.onTheFlyTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.onTheFlyTemplate.helperText",
      ),
      run: () => handleOnTheFlyTemplate(),
    },
    {
      id: "createNewTemplate",
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.helperText",
      ),
      run: () => handleCreateNewTemplate(),
    },
  ];

  return {
    handleOverwriteExistingTemplate,
    handleOnTheFlyTemplate,
    handleCreateNewTemplate,
    actions,
  };
};
