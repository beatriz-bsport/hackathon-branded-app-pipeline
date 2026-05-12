import { type FC, useState } from "react";

import { useFormContext } from "@bsport/form";
import { Alert, Button, ButtonProps } from "@bsport/kaizen-primitive-core";

import { useEmailTemplateSearch } from "#src/api/use-email-template-search";
import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { useTranslation } from "#src/utils/i18n";

import { EmailTemplateEditor } from "../EmailTemplateEditor/email-template-editor";
import type { EmailMessageContentFormData } from "../types";

const INLINE_ACTIONS = {
  OPEN_EDITOR: "openEditor",
} as const;

type InlineAction = (typeof INLINE_ACTIONS)[keyof typeof INLINE_ACTIONS];

export const EmailTemplatePreviewColumn: FC = () => {
  const { t } = useTranslation("campaign");
  const { watch, setValue } = useFormContext<EmailMessageContentFormData>();
  const [inlineActions, setInlineActions] = useState<InlineAction | null>(null);
  const watchedEmailTemplateId = watch("emailTemplateId");
  const watchedEmailTemplateDesign = watch("emailTemplateDesign");
  const watchedEmailTemplateHtml = watch("emailTemplateHtml");
  const watchedEmailSubject = watch("emailSubject");
  const isOnTheFlyHtmlTemplate = watch("isOnTheFlyHtmlTemplate");
  const { data: emailTemplateMatchingList } = useEmailTemplateSearch({
    searchInput: "",
    id__in: watchedEmailTemplateId?.toString(),
  });

  const emailTemplate = emailTemplateMatchingList?.find(
    (template) => template.id === watchedEmailTemplateId,
  );

  const currentEmailHtml =
    watchedEmailTemplateId == null
      ? (watchedEmailTemplateHtml ?? "")
      : watchedEmailTemplateHtml || emailTemplate?.html || "";
  const currentEmailDesign =
    watchedEmailTemplateId == null
      ? (watchedEmailTemplateDesign ?? "")
      : watchedEmailTemplateDesign || emailTemplate?.design || "";
  const currentEmailSubject =
    watchedEmailTemplateId == null
      ? (watchedEmailSubject ?? "")
      : watchedEmailSubject || emailTemplate?.subject || "";

  const openEditorButtonConfig: Partial<ButtonProps> = watchedEmailTemplateId
    ? {
        id: "email-campaign-edit-email",
        label: t("email.creation.form.emailTemplate.editEmail"),
        iconLeft: "edit-02",
      }
    : {
        id: "email-campaign-create-template",
        label: t("email.creation.form.emailTemplate.createTemplate"),
        iconLeft: "plus",
      };

  const shouldPreventCurrentTemplateEdition =
    isOnTheFlyHtmlTemplate && !watchedEmailTemplateId;

  const editorContent = shouldPreventCurrentTemplateEdition
    ? {
        content: {
          design: "",
          html: "",
        },
        subject: watchedEmailSubject ?? "",
      }
    : {
        content: {
          design: currentEmailDesign,
          html: currentEmailHtml,
        },
        subject: currentEmailSubject,
      };

  return (
    <div className="flex flex-col gap-md">
      {shouldPreventCurrentTemplateEdition ? (
        <Alert status="warning" customIcon="alert-circle">
          {t(
            "email.creation.form.emailTemplate.onTheFlyTemplateEditionBlockedWarning",
          )}
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-sm justify-end">
        <Button
          size="sm"
          intent="flat"
          color="default"
          id={openEditorButtonConfig.id}
          label={openEditorButtonConfig.label ?? ""}
          iconLeft={openEditorButtonConfig.iconLeft}
          onClick={() => setInlineActions(INLINE_ACTIONS.OPEN_EDITOR)}
        />
      </div>
      <HTMLPreview
        htmlContent={emailTemplate?.html ?? watchedEmailTemplateHtml ?? ""}
        noContentMessage={t(
          "email.creation.form.emailTemplate.noTemplatePreview",
        )}
      />
      {inlineActions === INLINE_ACTIONS.OPEN_EDITOR && (
        <EmailTemplateEditor
          open={true}
          emailTemplateId={watchedEmailTemplateId ?? undefined}
          emailTemplateContent={editorContent}
          onEmailTemplateChange={({
            design,
            html,
            subject,
            emailTemplateId,
          }) => {
            setValue("emailTemplateId", emailTemplateId, { shouldDirty: true });
            setValue("emailTemplateDesign", design, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("emailTemplateHtml", html, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("emailSubject", subject, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setInlineActions(null);
          }}
          onClose={() => setInlineActions(null)}
        />
      )}
    </div>
  );
};
