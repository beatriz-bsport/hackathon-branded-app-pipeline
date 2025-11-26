import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FormStepContextProvider,
  useFormStepContext,
} from "./Context/FormStepContext.context";
import { NotificationContentForm } from "./NotificationContent/NotificationContentForm";
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
  const { checkIfCurrentStepValid, goToNextStep, goToPreviousStep, resetForm } =
    useFormStepContext();

  const handleClose = () => {
    onClose?.();
    resetForm();
  };

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
          content: <TriggerConditionStep />,
        },
        {
          label: t("steps.label.content"),
          content: <NotificationContentForm />,
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
        handleClose?.();
      }}
      onClose={() => {
        handleClose?.();
      }}
      onCloseButtonClick={() => {
        handleClose?.();
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
