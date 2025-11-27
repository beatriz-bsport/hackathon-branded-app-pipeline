import { useEffect } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Checkbox, CheckboxProps } from "@bsport/kaizen-primitive-core";
import { CreateMarketingNotificationParams } from "@bsport/store-cdp-marketing-notification";

import {
  NOTIFICATION_CONTENT_STEP_IDENTIFIER,
  type NotificationMultiStepFormState,
  useFormStepContext,
} from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import { EmailTemplateForm } from "#src/components/MarketingNotificationEdition/NotificationContent/EmailTemplateForm";
import { PushNotificationForm } from "#src/components/MarketingNotificationEdition/NotificationContent/PushNotificationForm";
import { useRefineNotificationFormData } from "#src/hooks/actions/use-refine-notification-form-data";
import { useCompanyData } from "#src/hooks/api/use-company-data";
import { useCreateMarketingNotification } from "#src/hooks/api/use-create-marketing-notification";
import { useUpsellChecker } from "#src/hooks/permissions/use-upsell-checker";
import { notificationContentValidationFormSchema } from "#src/utils/schemas/notificationContentValidation";
import type { NotificationContentFormData } from "#src/utils/schemas/types";

export const NotificationContentForm = () => {
  const { formData, setStepValid } = useFormStepContext();
  const { companyId } = useCompanyData();
  const { getTriggerConditionKind, getTriggerEventRules } =
    useRefineNotificationFormData();
  const { handleCreateMarketingNotification } =
    useCreateMarketingNotification();
  const { isPushNotificationUpsellActivated } = useUpsellChecker();
  const pushNotificationContent =
    formData?.content?.pushNotificationContent || "";
  const pushNotificationTitle = formData?.content?.pushNotificationTitle || "";
  const baseEmailTemplateId = formData?.content?.emailTemplateId;

  const methods = useFormController({
    mode: "onBlur",
    schema: notificationContentValidationFormSchema,
    defaultValues: {
      isEmailNotificationChecked:
        !!baseEmailTemplateId || !isPushNotificationUpsellActivated,
      isPushNotificationChecked:
        !!pushNotificationTitle && !!pushNotificationTitle,
      pushNotificationTitle: pushNotificationTitle || "",
      pushNotificationContent: pushNotificationContent || "",
      emailTemplateId: baseEmailTemplateId,
    },
  });

  const {
    setValue: setFormValue,
    getValues: getFormValues,
    watch: watchFormValue,
    formState: { isValid },
  } = methods;

  const validateMarketingNotificationCreation = (
    notificationSetup: NotificationMultiStepFormState,
  ) => {
    const { triggerType, triggerCondition, content } = notificationSetup;
    if (!triggerCondition || !triggerType) return;
    const company = companyId;
    const push_notification_title = content?.pushNotificationTitle ?? "";
    const push_notification_content = content?.pushNotificationContent ?? "";
    const active = true;
    const email_design = content?.emailTemplateId ?? null;
    const is_event_based = true;
    const kind = getTriggerConditionKind(triggerCondition);
    const event_rules = getTriggerEventRules(triggerCondition);

    const marketingNotification = {
      company,
      push_notification_content,
      push_notification_title,
      email_design,
      active,
      event_rules,
      kind,
      is_event_based,
    };
    handleCreateMarketingNotification(
      marketingNotification as CreateMarketingNotificationParams,
    );
  };

  const isEmailTemplateSelectorToggled = watchFormValue(
    "isEmailNotificationChecked",
  );
  const isPushNotificationFormToggled = watchFormValue(
    "isPushNotificationChecked",
  );
  const emailTemplateId = watchFormValue("emailTemplateId");

  useEffect(() => {
    setStepValid(NOTIFICATION_CONTENT_STEP_IDENTIFIER, isValid);
  }, [isValid]);

  useEffect(() => {
    return () => {
      validateMarketingNotificationCreation({
        ...formData,
      });
    };
  }, []);

  if (!isPushNotificationUpsellActivated) {
    return (
      <ControlledForm<NotificationContentFormData>
        id="referral-program-form"
        onSubmit={() => {}}
        className="flex flex-col gap-sm w-full"
        {...methods}
      >
        <EmailTemplateForm
          key={emailTemplateId}
          defaultEmailTemplateId={emailTemplateId}
          setFormValue={setFormValue}
        />
      </ControlledForm>
    );
  }

  return (
    <ControlledForm<NotificationContentFormData>
      id="referral-program-form"
      onSubmit={() => {}}
      className="flex flex-col gap-sm w-full"
      {...methods}
    >
      <FormField<
        NotificationContentFormData,
        "isEmailNotificationChecked",
        CheckboxProps
      >
        name="isEmailNotificationChecked"
        mapProps={({ defaultProps, fieldState }) => ({
          ...defaultProps,
          value: isEmailTemplateSelectorToggled ? "checked" : "unchecked",
          errorText: fieldState.error?.message,
          onChange: (checked) => {
            setFormValue("isEmailNotificationChecked", checked, {
              shouldValidate: true,
            });
            if (checked) {
              methods.clearErrors("isEmailNotificationChecked");
              methods.clearErrors("isPushNotificationChecked");
            }
          },
        })}
      >
        <Checkbox
          id="email-template-selector-checkbox"
          value={isEmailTemplateSelectorToggled ? "checked" : "unchecked"}
          label="Set-up email notification"
        />
      </FormField>
      {isEmailTemplateSelectorToggled ? (
        <EmailTemplateForm
          key={emailTemplateId}
          defaultEmailTemplateId={emailTemplateId}
          setFormValue={setFormValue}
        />
      ) : null}
      <FormField<
        NotificationContentFormData,
        "isPushNotificationChecked",
        CheckboxProps
      >
        name="isPushNotificationChecked"
        mapProps={({ defaultProps }) => ({
          ...defaultProps,
          value: isPushNotificationFormToggled ? "checked" : "unchecked",
          onChange: (checked) => {
            setFormValue("isPushNotificationChecked", checked, {
              shouldValidate: true,
            });
            if (checked) {
              methods.clearErrors("isEmailNotificationChecked");
              methods.clearErrors("isPushNotificationChecked");
            }
          },
        })}
      >
        <Checkbox
          id="push-notification-form-checkbox"
          value={isPushNotificationFormToggled ? "checked" : "unchecked"}
          label="Set-up push notification"
        />
      </FormField>
      {isPushNotificationFormToggled ? (
        <PushNotificationForm
          pushNotificationTitle={pushNotificationTitle}
          pushNotificationContent={pushNotificationContent}
          setFormValue={setFormValue}
          getFormValues={getFormValues}
        />
      ) : null}
    </ControlledForm>
  );
};
