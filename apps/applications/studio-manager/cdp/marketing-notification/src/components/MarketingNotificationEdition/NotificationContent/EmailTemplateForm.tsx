import { ControlledFormProps, FormField } from "@bsport/form";

import { HTMLPreview } from "#src/components/MarketingNotificationDetails/Content/HTMLPreview";
import { useFetchEmailTemplateDetails } from "#src/hooks/api/use-fetch-email-template-details";
import { NotificationContentFormData } from "#src/utils/schemas/types";

import {
  EmailTemplateSelector,
  EmailTemplateSelectorProps,
} from "../EmailTemplateSelector/EmailTemplateSelector";

export const EmailTemplateForm = ({
  defaultEmailTemplateId,
  setFormValue,
}: {
  defaultEmailTemplateId?: number;
  setFormValue: ControlledFormProps<NotificationContentFormData>["setValue"];
}) => {
  const { emailTemplateDetail } = useFetchEmailTemplateDetails({
    emailTemplateId: defaultEmailTemplateId ?? null,
  });
  return (
    <div>
      <FormField<
        NotificationContentFormData,
        "emailTemplateId",
        EmailTemplateSelectorProps
      >
        name="emailTemplateId"
        mapProps={({ defaultProps }) => ({
          ...defaultProps,
        })}
      >
        <EmailTemplateSelector
          defaultTemplateId={defaultEmailTemplateId}
          onSelectTemplate={(template) => {
            if (template) {
              setFormValue("emailTemplateId", template.id, {
                shouldValidate: true,
              });
            }
          }}
        />
      </FormField>
      <HTMLPreview htmlContent={emailTemplateDetail?.html ?? ""} />
    </div>
  );
};
