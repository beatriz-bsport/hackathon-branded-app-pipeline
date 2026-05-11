import React, { useId } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  Card,
  Select,
  type SelectProps,
  Title,
} from "@bsport/kaizen-primitive-core";

import { EMAIL_TYPE_MARKETING } from "#src/components/EmailCampaignForm/constants";
import { ContentSection } from "#src/components/EmailCampaignForm/content-section";
import { EmailTypeField } from "#src/components/EmailCampaignForm/email-type-field";
import { RecipientCountPreview } from "#src/components/EmailCampaignForm/recipient-count-preview";
import { ToggleButtonGroup } from "#src/components/ToggleButtonGroup/ToggleButtonGroup";
import { useTranslation } from "#src/utils/i18n";

import {
  type AutomationEmailFormData,
  EMAIL_AUTOMATION_EVENT_VALUES,
  EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES,
  type EmailAutomationEventValue,
} from "./types";

type AutomationEmailFormProps = Omit<
  ControlledFormProps<AutomationEmailFormData>,
  "children"
> & {
  smartlistId: number;
};

export const AutomationEmailForm: React.FC<AutomationEmailFormProps> = ({
  id,
  onSubmit,
  smartlistId,
  ...methods
}) => {
  const { t } = useTranslation("details");
  const formIdPrefix = useId();
  const selectedEmailType = methods.watch("emailType");

  const ids = {
    fields: {
      condition: `${formIdPrefix}-field-condition`,
      limit: `${formIdPrefix}-field-limit`,
    },
  };

  const conditionOptions: Array<{
    value: EmailAutomationEventValue;
    label: string;
    icon: "log-in-03" | "log-out-01";
  }> = [
    {
      value: EMAIL_AUTOMATION_EVENT_VALUES.ENTRY,
      label: t("automation.email.form.condition.options.entry"),
      icon: "log-in-03",
    },
    {
      value: EMAIL_AUTOMATION_EVENT_VALUES.EXIT,
      label: t("automation.email.form.condition.options.exit"),
      icon: "log-out-01",
    },
  ];

  const triggerLimitOptions: SelectProps["items"] = [
    {
      id: EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.NO_LIMIT,
      label: t("automation.email.form.triggerLimit.options.noLimit"),
    },
    {
      id: EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.ONCE,
      label: t("automation.email.form.triggerLimit.options.once"),
    },
    {
      id: EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.TWICE,
      label: t("automation.email.form.triggerLimit.options.twice"),
    },
    {
      id: EMAIL_AUTOMATION_TRIGGER_LIMIT_VALUES.THREE_TIMES,
      label: t("automation.email.form.triggerLimit.options.threeTimes"),
    },
  ];

  return (
    <div className="flex flex-col gap-md p-0 md:p-md">
      <ControlledForm
        id={id}
        className="flex flex-col gap-md"
        onSubmit={onSubmit}
        {...methods}
      >
        <Card padding="default" elevated className="flex flex-col gap-md">
          <EmailTypeField />
          <RecipientCountPreview
            smartlistId={smartlistId}
            isMarketing={selectedEmailType === EMAIL_TYPE_MARKETING}
          />
        </Card>

        <div className="flex flex-col gap-sm">
          <Title htmlVariant="h2" weight="strong">
            {t("automation.email.sections.delivery")}
          </Title>

          <FormField<AutomationEmailFormData, "eventKind">
            name="eventKind"
            mapProps={({ field, form }) => ({
              value: field.value,
              onChangeValue: (nextValue: EmailAutomationEventValue) => {
                form.setValue("eventKind", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          >
            <ToggleButtonGroup<EmailAutomationEventValue>
              id={ids.fields.condition}
              label={t("automation.email.form.condition.label")}
              options={conditionOptions}
            />
          </FormField>

          <FormField<
            AutomationEmailFormData,
            "triggerLimit",
            SelectProps
          > name="triggerLimit">
            <Select
              id={ids.fields.limit}
              label={t("automation.email.form.triggerLimit.label")}
              required
              fullWidth
              items={triggerLimitOptions}
            />
          </FormField>
        </div>

        <ContentSection />
      </ControlledForm>
    </div>
  );
};
