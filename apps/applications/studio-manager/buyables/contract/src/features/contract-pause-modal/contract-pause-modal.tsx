import { useMutation } from "@tanstack/react-query";
import { Activity, type FC, useId, useState } from "react";

import {
  PAUSE_ACTION_KIND,
  fetchContractPauseInfoMutationOptions,
} from "@bsport/api-buyables/contract-pause";
import {
  calculateDiffDuration,
  fromIsoString,
} from "@bsport/datetime-manipulation";
import { ControlledForm, useFormController } from "@bsport/form";
import { Modal, toast } from "@bsport/kaizen-primitive-core";

import {
  useUpdateContractPauseMutation,
  useUpdateContractPauseNameOnlyMutation,
} from "#src/hooks/api/use-contract-pause-mutations";
import { useCreateContractPause } from "#src/hooks/api/use-create-contract-pause";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { ContractPauseBillingPlans } from "./contract-pause-billing-plans";
import { ContractPauseForm } from "./contract-pause-form";
import {
  ContractPauseFormData,
  type ContractPauseFormSchema,
  useContractPauseFormSchema,
  useDefaultData,
} from "./schema";

type ContractPauseModalProps = {
  closeModal: () => void;
  contractId: number;
  isOpen: boolean;
  contractName: string;
  initial?: {
    pauseId: number;
    fromDate: string;
    untilDate: string;
    name: string;
  };
};

const STEPS = {
  FORM_COMPLETION: "FORM_COMPLETION",
  BILLING_PLAN_DISPLAY: "BILLING_PLAN_DISPLAY",
} as const;

export const ContractPauseModal: FC<ContractPauseModalProps> = ({
  closeModal,
  contractId,
  contractName,
  initial,
  isOpen,
}) => {
  const [step, setStep] = useState<keyof typeof STEPS>(STEPS.FORM_COMPLETION);

  const { t } = useTranslation("contract-features");

  // ----- Form context -----

  const formId = `pause-form-${useId()}`;

  const contractPauseFormSchema = useContractPauseFormSchema();

  const defaultData = useDefaultData();
  const defaultValues: ContractPauseFormData = initial
    ? {
        name: initial.name,
        dateRange: [
          fromIsoString(initial.fromDate),
          fromIsoString(initial.untilDate),
        ],
      }
    : defaultData;

  const methods = useFormController<ContractPauseFormSchema>({
    mode: "onSubmit",
    schema: contractPauseFormSchema,
    defaultValues,
  });

  const { isDirty, isSubmitting, dirtyFields } = methods.formState;

  const resetModal = () => {
    methods.reset();
    setStep(STEPS.FORM_COMPLETION);
  };

  // ----- API request handlers -----

  const {
    mutate: getContractPauseInfo,
    isPending: isGettingInfo,
    data: infoData,
  } = useMutation({
    ...fetchContractPauseInfoMutationOptions(fetch),
    onSuccess: () => {
      setStep(STEPS.BILLING_PLAN_DISPLAY);
    },
  });

  const onMutationSuccess = () => {
    closeModal();
    resetModal();
  };

  const { createPause, isGettingBackgroundTaskId } = useCreateContractPause({
    contractName,
    onSuccess: onMutationSuccess,
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("pauseModal.toastError.create", { contractName }),
        buttonIcon: "x-close",
      });
    },
  });

  const { updatePause, isGettingBackgroundTaskId: isUpdating } =
    useUpdateContractPauseMutation({
      contractName,
      onSuccess: onMutationSuccess,
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("pauseModal.toastError.edit", {
            pauseName: initial?.name ?? "",
          }),
          buttonIcon: "x-close",
        });
      },
    });

  const { updatePauseName, isMutatingName } =
    useUpdateContractPauseNameOnlyMutation({
      onSuccess: () => {
        toast({
          status: "default",
          icon: "save",
          title: t("pauseModal.toastSuccess.edit"),
          buttonIcon: "x-close",
        });
        onMutationSuccess();
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("pauseModal.toastError.edit", {
            pauseName: initial?.name ?? "",
          }),
          buttonIcon: "x-close",
        });
      },
    });

  const isLoading =
    isGettingInfo || isGettingBackgroundTaskId || isUpdating || isMutatingName;

  // ----- Client interaction -----

  const safeCloseModal = () => {
    if (isLoading) {
      return;
    }
    closeModal();
    resetModal();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) {
      // Prevent accidental closing when there are form data
      return;
    }
    safeCloseModal();
  };

  // ----- Actions -----

  const onSubmit = (formData: ContractPauseFormData) => {
    const [fromDate, untilDate] = formData.dateRange;

    if (!fromDate || !untilDate) {
      // Typescript safeguard - Submission is prevented by Zod
      setStep(STEPS.FORM_COMPLETION);
      return;
    }

    const commonData = {
      contract: contractId,
      from_date: fromDate.toISO() || "",
      until_date: untilDate.toISO() || "",
    };

    if (step === STEPS.FORM_COMPLETION) {
      getContractPauseInfo({
        ...commonData,
        contract_pause: initial?.pauseId,
      });
    }

    if (step === STEPS.BILLING_PLAN_DISPLAY) {
      const shouldEarlyReturn = (infoData?.valid_for_pause ?? []).length === 0;
      if (shouldEarlyReturn) {
        safeCloseModal();
        return;
      }

      const daysDuration =
        fromDate && untilDate
          ? calculateDiffDuration({
              lowerDatetime: fromDate,
              upperDatetime: untilDate,
              units: ["days"],
            }).days + 1
          : 0;

      const commonPostData = {
        name: formData.name,
        days: daysDuration,
        action_pack_kind: PAUSE_ACTION_KIND.EXTEND,
      };

      if (!initial) {
        // Creation
        createPause({
          ...commonData,
          ...commonPostData,
        });
      } else {
        // Edition - 2 flows
        if (!dirtyFields.dateRange) {
          // Name only update - specific endpoint
          updatePauseName({
            contract_pause_id: initial.pauseId,
            name: formData.name,
          });
          return;
        }
        updatePause({
          ...commonData,
          ...commonPostData,
          contract_pause_id: initial.pauseId,
        });
      }
    }
  };

  const onClickBack = () => {
    if (step === STEPS.FORM_COMPLETION) {
      safeCloseModal();
    }

    if (step === STEPS.BILLING_PLAN_DISPLAY) {
      setStep(STEPS.FORM_COMPLETION);
    }
  };

  const buttonTranslations = {
    [STEPS.FORM_COMPLETION]: {
      confirm: t("pauseModal.actions.nextStep"),
      cancel: t("pauseModal.actions.cancel"),
    },
    [STEPS.BILLING_PLAN_DISPLAY]: {
      confirm: t("pauseModal.actions.confirm"),
      cancel: t("pauseModal.actions.back"),
    },
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: buttonTranslations[step].confirm,
        color: "main",
        type: "submit",
        form: formId,
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButton={{
        label: buttonTranslations[step].cancel,
        onClick: onClickBack,
        disabled: isLoading,
      }}
      onCloseButtonClick={safeCloseModal}
      title={
        initial ? t("pauseModal.title.edit") : t("pauseModal.title.create")
      }
      size="md"
      onClickOutside={handleClickOutside}
    >
      <div onSubmit={(e) => e.stopPropagation()}>
        <ControlledForm id={formId} {...methods} onSubmit={onSubmit}>
          <Activity
            mode={step === STEPS.FORM_COMPLETION ? "visible" : "hidden"}
          >
            <ContractPauseForm formId={formId} />
          </Activity>

          {step === STEPS.BILLING_PLAN_DISPLAY && (
            <ContractPauseBillingPlans
              validBillingPlans={infoData?.valid_for_pause}
              invalidBillingPlans={infoData?.invalid_for_pause}
            />
          )}
        </ControlledForm>
      </div>
    </Modal>
  );
};
