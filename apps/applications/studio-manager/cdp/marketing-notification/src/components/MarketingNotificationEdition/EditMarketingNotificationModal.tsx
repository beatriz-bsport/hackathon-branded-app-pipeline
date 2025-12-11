import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  FormStepContextProvider,
  NOTIFICATION_CONTENT_STEP_IDENTIFIER,
  NOTIFICATION_TYPE_STEP_IDENTIFIER,
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
  const {
    currentStep,
    setValidateForm,
    checkIfCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    resetForm,
  } = useFormStepContext();

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  return (
    <ModalStepper
      key={String(isOpen)}
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
          content: <NotificationContentForm handleCloseModal={handleClose} />,
        },
      ]}
      initialStep={0}
      confirmButton={{
        label: "Create",
        color: "main",
        disabled: !checkIfCurrentStepValid(),
        onClick: () => {
          if (currentStep === NOTIFICATION_CONTENT_STEP_IDENTIFIER) {
            setValidateForm(true);
          } else {
            goToNextStep();
          }
        },
      }}
      cancelButton={{
        label: "Cancel",
        onClick: () => {
          if (currentStep === NOTIFICATION_TYPE_STEP_IDENTIFIER) {
            handleClose();
          }
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
