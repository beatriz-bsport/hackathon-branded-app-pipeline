import { useEffect } from "react";

import { useFormController } from "@bsport/form";
import { ModalStepper, toast } from "@bsport/kaizen-primitive-core";

import { useCreateSession } from "#src/hooks/session-api/session-actions/use-create-session";
import { useSessionCreationPayload } from "#src/hooks/use-session-creation-payload";
import {
  goToNextStep,
  goToPreviousStep,
  resetForm,
  saveStepFormData,
  setStepValid,
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
import {
  SessionCreationFormAdvancedOptionsData,
  SessionCreationFormData,
} from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { useSessionSchema } from "../SessionForm/schemas";
import { ChooseActivityStep } from "./ChooseActivityStep";
import { ConfigureSessionStep } from "./ConfigureSessionStep";
import { AdvancedOptionsStep } from "./advanced-options-step";

type AddSessionModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const AddSessionModal = ({ isOpen, onClose }: AddSessionModalProps) => {
  const { t } = useTranslation("sessionCreation");

  const { mutate: createSession, isPending } = useCreateSession();

  const configureSessionFormData = useSessionCreationStore(
    selectStepFormData(SESSION_CREATION_STEPS.CONFIGURE_SESSION),
  ) as SessionCreationFormData;

  const advancedOptionsFormData = useSessionCreationStore(
    selectStepFormData(SESSION_CREATION_STEPS.ADVANCED_OPTIONS),
  ) as SessionCreationFormAdvancedOptionsData;

  const { advancedOptionsSchema, configureSessionSchema } = useSessionSchema();

  const configureSessionMethods = useFormController({
    schema: configureSessionSchema,
    mode: "onChange",
    defaultValues: configureSessionFormData,
  });

  const {
    setFocus,
    formState: { errors },
  } = configureSessionMethods;

  const errorsCount = Object.keys(errors).length;

  useEffect(() => {
    if (!errorsCount) return;
    const firstErrorField = Object.keys(errors)[0] as
      | Parameters<typeof setFocus>[0]
      | undefined;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  }, [errorsCount, setFocus, errors]);

  const advancedOptionsMethods = useFormController({
    schema: advancedOptionsSchema,
    mode: "onChange",
    defaultValues: advancedOptionsFormData,
  });

  const { buildPayload } = useSessionCreationPayload();

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  const handleCloseButtonClick = () => {
    onClose?.();
    resetForm();
  };

  const handleClickOutisde = () => {
    if (
      configureSessionMethods.formState.isDirty ||
      advancedOptionsMethods.formState.isDirty
    ) {
      return;
    }
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

    if (currentStep === SESSION_CREATION_STEPS.CONFIGURE_SESSION) {
      const data = configureSessionMethods.getValues();
      saveStepFormData({
        step: SESSION_CREATION_STEPS.CONFIGURE_SESSION,
        data,
      });
      setStepValid(
        SESSION_CREATION_STEPS.CONFIGURE_SESSION,
        configureSessionMethods.formState.isValid,
      );
    }

    if (currentStep === SESSION_CREATION_STEPS.ADVANCED_OPTIONS) {
      const advancedData = advancedOptionsMethods.getValues();
      setStepValid(
        SESSION_CREATION_STEPS.ADVANCED_OPTIONS,
        advancedOptionsMethods.formState.isValid,
      );

      try {
        const payload = buildPayload({
          sessionData: {
            ...configureSessionFormData,
            ...advancedData,
          },
          metaActivityId: selectedGroupActivity?.id,
        });

        createSession(
          {
            payload,
            onEarlySuccess: () => {
              resetForm();
              advancedOptionsMethods.reset();
              configureSessionMethods.reset();
              onClose?.();
            },
          },
          {
            onError: (error) => {
              toast({
                status: "critical",
                description: t("addSessionModal.errors.create"),
              });
              console.error("Error creating session:", error);
            },
          },
        );
        return;
      } catch (error) {
        toast({
          status: "critical",
          description: t("addSessionModal.errors.create"),
        });
        console.error("Error building session payload:", error);
        return;
      }
    }
    if (!isLastStep) {
      goToNextStep();
    }
  };

  const checkIfCurrentStepValid = () => {
    if (currentStep === SESSION_CREATION_STEPS.CONFIGURE_SESSION) {
      return (
        configureSessionMethods.formState.isValid &&
        Object.keys(configureSessionMethods.formState.errors).length === 0
      );
    }
    if (currentStep === SESSION_CREATION_STEPS.ADVANCED_OPTIONS) {
      return advancedOptionsMethods.formState.isValid;
    }
    return isCurrentStepValid;
  };

  return (
    <ModalStepper
      key={String(isOpen)}
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
          content: <AdvancedOptionsStep methods={advancedOptionsMethods} />,
          validate: checkIfCurrentStepValid,
        },
      ]}
      initialStep={SESSION_CREATION_STEPS.CHOOSE_GROUP_ACTIVITY}
      confirmButton={{
        label: t("addSessionModal.buttons.createSession"),
        color: "main",
        onClick: handleConfirm,
        disabled: isPending,
      }}
      cancelButton={{
        label: t("addSessionModal.buttons.cancel"),
        onClick: handleClickOnCancel,
      }}
      onClickOutside={handleClickOutisde}
      onCloseButtonClick={handleCloseButtonClick}
      onClose={() => onClose?.()}
    />
  );
};
