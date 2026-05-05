import { type FC, useEffect, useState } from "react";

import { FormProvider, useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { BookingRulesStep } from "#src/components/class-form/booking-rules-step/booking-rules-step";
import { ClassSetupStep } from "#src/components/class-form/class-setup-step/class-setup-step";
import { useCreateClass } from "#src/hooks/use-create-class";
import {
  type ClassFormValues,
  STEP_1_FIELDS,
  defaultClassFormValues,
  toCreateGroupActivityPayload,
  useClassFormSchema,
} from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

type AddClassModalProps = {
  open: boolean;
  onClose: () => void;
};

const STEP_CLASS_SETUP = 0;
const STEP_BOOKING_RULES = 1;

export const AddClassModal: FC<AddClassModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation("add-edit-form");
  const schema = useClassFormSchema("create");
  const methods = useFormController({
    schema,
    defaultValues: defaultClassFormValues,
    mode: "onChange",
    shouldFocusError: true,
  });
  const { mutate, isPending } = useCreateClass();
  const [currentStep, setCurrentStep] = useState(STEP_CLASS_SETUP);
  const { formState, handleSubmit, reset, trigger } = methods;
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(true);

  useEffect(() => {
    // when the modal is closed, reset the form and step state
    if (!open) {
      reset();
      setCurrentStep(STEP_CLASS_SETUP);
      setIsStep1Valid(false);
      setIsStep2Valid(true);
    }
  }, [open, reset]);

  const handleClose = () => {
    if (isPending) return;
    reset();
    setCurrentStep(STEP_CLASS_SETUP);
    onClose();
  };

  const handleClickOutside = () => {
    if (isPending) return;
    if (formState.isDirty) return;
    handleClose();
  };

  const handleConfirm = async () => {
    if (currentStep === STEP_CLASS_SETUP) {
      const isValid = await trigger(STEP_1_FIELDS);
      if (isValid) {
        setCurrentStep(STEP_BOOKING_RULES);
      }
      return;
    }
    handleSubmit((values: ClassFormValues) => {
      mutate(toCreateGroupActivityPayload(values), {
        onSuccess: handleClose,
      });
    })();
  };

  const handleCancel = () => {
    if (isPending) return;
    if (currentStep === STEP_CLASS_SETUP) {
      handleClose();
      return;
    }
    setCurrentStep(STEP_CLASS_SETUP);
  };

  const checkStep1Valid = () => isStep1Valid;

  const checkStep2Valid = () => isStep2Valid;

  return (
    <FormProvider {...methods}>
      <ModalStepper
        key={String(open)}
        open={open}
        size="lg"
        title={t("addEditForm.modal.title")}
        description={t("addEditForm.modal.description")}
        steps={[
          {
            label: t("addEditForm.modal.steps.classSetup"),
            content: <ClassSetupStep onValidityChange={setIsStep1Valid} />,
            validate: checkStep1Valid,
          },
          {
            label: t("addEditForm.modal.steps.bookingRules"),
            content: <BookingRulesStep onValidityChange={setIsStep2Valid} />,
            validate: checkStep2Valid,
          },
        ]}
        initialStep={STEP_CLASS_SETUP}
        confirmButton={{
          label: t("addEditForm.modal.confirm"),
          color: "main",
          onClick: handleConfirm,
          disabled: isPending,
        }}
        cancelButton={{
          label: t("addEditForm.modal.cancel"),
          onClick: handleCancel,
        }}
        onClickOutside={handleClickOutside}
        onCloseButtonClick={handleClose}
        onClose={handleClose}
      />
    </FormProvider>
  );
};
