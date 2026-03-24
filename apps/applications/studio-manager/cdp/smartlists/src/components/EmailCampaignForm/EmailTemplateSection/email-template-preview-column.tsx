import { type FC, useState } from "react";

import { useFormContext } from "@bsport/form";
import { Button } from "@bsport/kaizen-primitive-core";

import { useEmailTemplateSearch } from "#src/api/use-email-template-search";
import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { useTranslation } from "#src/utils/i18n";

import { EmailTemplateEditor } from "../EmailTemplateEditor/email-template-editor";
import type { EmailCampaignFormData } from "../types";

const INLINE_ACTIONS = {
  EDIT: "edit",
  SEND_TEST: "sendTest",
} as const;

type InlineAction = (typeof INLINE_ACTIONS)[keyof typeof INLINE_ACTIONS];

export const EmailTemplatePreviewColumn: FC = () => {
  const { t } = useTranslation("campaign");
  const { watch, setValue } = useFormContext<EmailCampaignFormData>();
  const [inlineActions, setInlineActions] = useState<InlineAction | null>(null);
  const emailTemplateId = watch("emailTemplateId");
  const { data: emailTemplateMatchingList } = useEmailTemplateSearch({
    searchInput: "",
    id__in: emailTemplateId?.toString(),
  });

  const emailTemplate = emailTemplateMatchingList?.find(
    (template) => template.id === emailTemplateId,
  );
  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-wrap gap-sm">
        <Button
          size="sm"
          intent="flat"
          color="main"
          id="email-campaign-send-test-email"
          label={t("email.creation.form.emailTemplate.sendTestEmail")}
          iconLeft="send-01"
          onClick={() => setInlineActions(INLINE_ACTIONS.SEND_TEST)}
        />
        <Button
          size="sm"
          intent="flat"
          color="main"
          id="email-campaign-edit-email"
          label={t("email.creation.form.emailTemplate.editEmail")}
          iconLeft="edit-02"
          onClick={() => {
            if (emailTemplateId) {
              setInlineActions(INLINE_ACTIONS.EDIT);
            }
          }}
        />
      </div>
      <HTMLPreview
        htmlContent={emailTemplate?.html ?? ""}
        noContentMessage={t(
          "email.creation.form.emailTemplate.noTemplatePreview",
        )}
      />
      {inlineActions === INLINE_ACTIONS.EDIT && emailTemplateId && (
        <EmailTemplateEditor
          open={true}
          defaultEmailTemplate={emailTemplate}
          onEmailTemplateChange={({ design, html }) => {
            setValue("emailTemplateDesign", design);
            setValue("emailTemplateHtml", html);
          }}
          onClose={() => setInlineActions(null)}
        />
      )}
    </div>
  );
};
