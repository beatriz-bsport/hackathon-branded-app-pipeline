import { useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import {
  goToNextStep,
  goToPreviousStep,
  resetForm,
} from "#src/stores/session-creation/actions";
import {
  selectCurrentStep,
  selectIsCurrentStepValid,
  selectSelectedGroupActivity,
  selectStepFormData,
} from "#src/stores/session-creation/selectors";
import {
  MAX_STEP,
  SESSION_CREATION_STEPS,
  useSessionCreationStore,
} from "#src/stores/session-creation/store";
import { useTranslation } from "#src/utils/i18n";

import { useSessionSchema } from "../SessionForm/schemas";
import { ChooseActivityStep } from "./ChooseActivityStep";
import { ConfigureSessionStep } from "./ConfigureSessionStep";

type AddSessionModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const AddSessionModal = ({ isOpen, onClose }: AddSessionModalProps) => {
  const { t } = useTranslation("sessionCreation");

  const configureSessionFormData = useSessionCreationStore(
    selectStepFormData(SESSION_CREATION_STEPS.CONFIGURE_SESSION),
  );

  const sessionSchema = useSessionSchema();

  const configureSessionMethods = useFormController({
    schema: sessionSchema,
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: configureSessionFormData,
  });

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  const handleCloseButtonClick = () => {
    onClose?.();
    resetForm();
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleClickOnCancel = () => {
    if (currentStep === SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY) {
      resetForm();
    }
    goToPreviousStep();
  };

  const currentStep = useSessionCreationStore(selectCurrentStep);
  const isCurrentStepValid = useSessionCreationStore(selectIsCurrentStepValid);

  const handleConfirm = () => {
    const isLastStep = currentStep === MAX_STEP;

    if (currentStep === SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY) {
      configureSessionMethods.reset({
        ...configureSessionFormData,
        name_override: selectedGroupActivity?.name || "",
        description_override: selectedGroupActivity?.description || "",
      });
    }

    if (!isLastStep) {
      goToNextStep();
      return;
    }

    // Submit the form - actual business logic here
    console.log("Form submitted");
  };

  const checkIfCurrentStepValid = () => {
    if (currentStep === SESSION_CREATION_STEPS.CONFIGURE_SESSION) {
      return configureSessionMethods.formState.isValid;
    }
    return isCurrentStepValid;
  };

  return (
    <ModalStepper
      open={isOpen}
      title={t("addSessionModal.title")}
      size="lg"
      steps={[
        {
          label: t("addSessionModal.steps.chooseActivity.label"),
          content: <ChooseActivityStep />,
          validate: checkIfCurrentStepValid,
        },
        {
          label: t("addSessionModal.steps.configureSession.label"),
          content: <ConfigureSessionStep methods={configureSessionMethods} />,
          validate: checkIfCurrentStepValid,
        },
        {
          label: t("addSessionModal.steps.advancedOptions.label"),
          content: <>Advanced Options Step</>,
          validate: checkIfCurrentStepValid,
        },
      ]}
      initialStep={SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY}
      confirmButton={{
        label: t("addSessionModal.buttons.createSession"),
        color: "main",
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("addSessionModal.buttons.cancel"),
        onClick: handleClickOnCancel,
      }}
      onClickOutside={handleClose}
      onCloseButtonClick={handleCloseButtonClick}
      onClose={handleClose}
    />
  );
};
