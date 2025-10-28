import { useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { triggerTypeValidationProgramSchema } from "#src/utils/schemas/triggerTypeValidation";
import type { TriggerTypeValidationFormData } from "#src/utils/schemas/types";

import { TriggerTypeStep } from "./TriggerTypeStep";

type EditMarketingNotificationModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const EditMarketingNotificationModal = ({
  isOpen,
  onClose,
}: EditMarketingNotificationModalProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const defaultValues: TriggerTypeValidationFormData = {
    itemIds: [],
    notificationType: NOTIFICATION_ADVANCED_TYPE.groupActivity,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: triggerTypeValidationProgramSchema,
    defaultValues,
  });

  return (
    <ModalStepper
      open={isOpen}
      title={t("title.create")}
      size="lg"
      steps={[
        {
          label: t("steps.label.triggerType"),
          content: (
            <TriggerTypeStep
              {...methods}
              onSelectTriggerType={(params) => {
                methods.setValue("itemIds", params.objectIds, {
                  shouldValidate: true,
                });
              }}
            />
          ),
        },
        {
          label: t("steps.label.notificationRules"),
          content: <>Automation Step</>,
        },
        {
          label: t("steps.label.content"),
          content: <>Content Step</>,
        },
      ]}
      initialStep={0}
      confirmButton={{
        label: "Create",
        color: "main",
        disabled: !methods.formState.isValid,
        onClick: () => {
          // Handle create notification logic here
        },
      }}
      cancelButton={{
        label: "Cancel",
        color: "critical",
      }}
      onClickOutside={() => {
        onClose?.();
      }}
      onClose={() => {
        onClose?.();
      }}
      onCloseButtonClick={() => {
        onClose?.();
      }}
    />
  );
};
