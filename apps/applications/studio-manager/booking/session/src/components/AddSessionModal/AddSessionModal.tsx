import { ModalStepper } from "@bsport/kaizen-primitive-core";

import {
  goToNextStep,
  goToPreviousStep,
  resetForm,
} from "#src/stores/session-creation/actions";
import {
  selectCurrentStep,
  selectIsCurrentStepValid,
} from "#src/stores/session-creation/selectors";
import {
  CHOOSE_GROUP_ACTIVITY_STEP,
  MAX_STEP,
  useSessionCreationStore,
} from "#src/stores/session-creation/store";
import { useTranslation } from "#src/utils/i18n";

type AddSessionModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const AddSessionModal = ({ isOpen, onClose }: AddSessionModalProps) => {
  const { t } = useTranslation("sessionCreation");

  const handleClose = () => {
    onClose?.();
    resetForm();
  };

  const currentStep = useSessionCreationStore(selectCurrentStep);
  const isCurrentStepValid = useSessionCreationStore(selectIsCurrentStepValid);

  const handleConfirm = () => {
    const isLastStep = currentStep === MAX_STEP;

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    // Submit the form - actual business logic here
    console.log("Form submitted");
  };

  const checkIfCurrentStepValid = () => isCurrentStepValid;

  return (
    <ModalStepper
      open={isOpen}
      title={t("addSessionModal.title")}
      size="lg"
      steps={[
        {
          label: t("addSessionModal.steps.chooseActivity.label"),
          content: <>Choose Activity Step</>,
          validate: checkIfCurrentStepValid,
        },
        {
          label: t("addSessionModal.steps.configureSession.label"),
          content: <>Configure Session Step</>,
          validate: checkIfCurrentStepValid,
        },
        {
          label: t("addSessionModal.steps.advancedOptions.label"),
          content: <>Advanced Options Step</>,
          validate: checkIfCurrentStepValid,
        },
      ]}
      initialStep={CHOOSE_GROUP_ACTIVITY_STEP}
      confirmButton={{
        label: t("addSessionModal.buttons.createSession"),
        color: "main",
        disabled: !isCurrentStepValid,
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("addSessionModal.buttons.cancel"),
        onClick: goToPreviousStep,
      }}
      onClickOutside={handleClose}
      onClose={handleClose}
      onCloseButtonClick={handleClose}
    />
  );
};
