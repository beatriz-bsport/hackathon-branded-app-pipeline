import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Button } from "@bsport/kaizen-primitive-core";

import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { useTranslation } from "#src/utils/i18n";

import type { EmailCampaignFormData } from "../types";

export const EmailTemplatePreviewColumn: FC = () => {
  const { t } = useTranslation("campaign");
  const { watch } = useFormContext<EmailCampaignFormData>();
  const emailTemplateHtml = watch("emailTemplateHtml");

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
        />
        <Button
          size="sm"
          intent="flat"
          color="main"
          id="email-campaign-edit-email"
          label={t("email.creation.form.emailTemplate.editEmail")}
          iconLeft="edit-02"
        />
      </div>
      <HTMLPreview
        htmlContent={emailTemplateHtml ?? ""}
        noContentMessage={t(
          "email.creation.form.emailTemplate.noTemplatePreview",
        )}
      />
    </div>
  );
};
