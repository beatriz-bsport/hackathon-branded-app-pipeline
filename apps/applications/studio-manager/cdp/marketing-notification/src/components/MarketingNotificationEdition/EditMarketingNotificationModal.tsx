import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FormStepContextProvider,
  useFormStepContext,
} from "./Context/FormStepContext.context";
import { TriggerConditionStep } from "./NotificationTriggerForms/TriggerConditionStep";
import { TriggerTypeStep } from "./TriggerTypeSelector/TriggerTypeStep";

type EditMarketingNotificationModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const EditMarketingNotificationModal = ({
  isOpen,
  onClose,
}: EditMarketingNotificationModalProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { checkIfCurrentStepValid, goToNextStep, goToPreviousStep } =
    useFormStepContext();

  return (
    <ModalStepper
      open={isOpen}
      title={t("title.create")}
      size="lg"
      steps={[
        {
          label: t("steps.label.triggerType"),
          content: <TriggerTypeStep />,
        },
        {
          label: t("steps.label.notificationRules"),
          content: (
            <TriggerConditionStep
              notificationType={"groupActivity"}
              itemIds={[9]}
            />
          ),
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
        disabled: !checkIfCurrentStepValid(),
        onClick: () => {
          goToNextStep();
        },
      }}
      cancelButton={{
        label: "Cancel",
        onClick: () => {
          goToPreviousStep();
        },
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

export const EditMarketingNotificationModalWrapper = (
  props: EditMarketingNotificationModalProps,
) => {
  return (
    <FormStepContextProvider>
      <EditMarketingNotificationModal {...props} />
    </FormStepContextProvider>
  );
};
