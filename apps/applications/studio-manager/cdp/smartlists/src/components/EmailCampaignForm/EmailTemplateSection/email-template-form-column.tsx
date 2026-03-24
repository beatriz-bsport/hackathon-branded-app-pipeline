import React, { useId } from "react";

import type { EmailTemplateDetail } from "@bsport/api-cdp";
import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EmailTemplateSelector } from "../EmailTemplateSelector/email-template-selector";
import type { EmailCampaignFormData } from "../types";

export const EmailTemplateFormColumn: React.FC = () => {
  const { t } = useTranslation("campaign");
  const baseId = useId();
  const { watch, setValue, formState } =
    useFormContext<EmailCampaignFormData>();
  const errors = formState.errors;

  const emailTemplateId = watch("emailTemplateId");

  const handleSelectTemplate = (template: EmailTemplateDetail | null) => {
    if (!template) {
      setValue("emailTemplateId", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("emailTemplateDesign", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("emailTemplateHtml", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("emailSubject", "", { shouldValidate: true, shouldDirty: true });
      return;
    }
    setValue("emailTemplateId", template.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("emailSubject", template.subject ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("emailTemplateDesign", template.design ?? null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("emailTemplateHtml", template.html ?? null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col gap-md">
      <EmailTemplateSelector
        selectedTemplateId={emailTemplateId ?? undefined}
        onSelectTemplate={handleSelectTemplate}
        textfieldProps={{
          status: errors.emailTemplateHtml ? "error" : "default",
          statusText: errors.emailTemplateHtml?.message ?? "",
        }}
      />
      <FormField<EmailCampaignFormData, "emailSubject", TextFieldProps>
        name="emailSubject"
        mapProps={({
          field,
          form: { setValue: setFormValue },
          defaultProps,
        }) => ({
          ...defaultProps,
          value: field.value ?? "",
          onClear: () => {
            setFormValue("emailSubject", "", {
              shouldValidate: true,
              shouldDirty: true,
            });
          },
        })}
      >
        <TextField
          id={`${baseId}-email-template-subject`}
          label={t("email.creation.form.textOnly.subjectLabel")}
          required
          fullWidth
        />
      </FormField>
    </div>
  );
};
