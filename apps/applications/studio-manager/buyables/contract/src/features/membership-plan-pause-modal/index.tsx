import { type FC, useId } from "react";

import type { BillingPlanPause } from "@bsport/api-buyables/billing-plan";
import { PAUSE_ACTION_KIND } from "@bsport/api-buyables/contract-pause";
import {
  type DateTime,
  calculateDiffDuration,
  fromIsoString,
} from "@bsport/datetime-manipulation";
import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { ContractPauseForm } from "#src/features/contract-pause-modal/contract-pause-form";
import {
  ContractPauseFormData,
  type ContractPauseFormSchema,
  useContractPauseFormSchema,
} from "#src/features/contract-pause-modal/schema";
import { usePauseBillingPlan } from "#src/hooks/api/use-pause-billing-plan";
import { useTranslation } from "#src/utils/i18n";

type MembershipPlanPauseModalProps = {
  billingPlanId: number;
  closeModal: () => void;
  existingPauses?: BillingPlanPause[];
  initial?: {
    pauseId: number;
    fromDate: string;
    untilDate: string;
    name: string;
  };
  isOpen: boolean;
};

const overlapsExistingPause = (
  fromDate: DateTime,
  untilDate: DateTime,
  existingPauses: BillingPlanPause[],
  excludePauseId?: number,
): boolean => {
  // toISODate() only returns null for invalid DateTime instances, which cannot
  // reach this function (callers guard for non-null DateTime values).
  const from = fromDate.toISODate()!;
  const until = untilDate.toISODate()!;

  return existingPauses
    .filter((p) => p.id !== excludePauseId)
    .some((p) => from <= p.until_date && until >= p.from_date);
};

export const MembershipPlanPauseModal: FC<MembershipPlanPauseModalProps> = ({
  billingPlanId,
  closeModal,
  existingPauses = [],
  initial,
  isOpen,
}) => {
  const formId = `membership-plan-pause-form-${useId()}`;
  const { t } = useTranslation("membership-plan");

  const schema = useContractPauseFormSchema();

  const defaultValues = initial
    ? {
        dateRange: [
          fromIsoString(initial.fromDate),
          fromIsoString(initial.untilDate),
        ] as [DateTime, DateTime],
        name: initial.name,
      }
    : { name: "", dateRange: [null, null] as [null, null] };

  const methods = useFormController<ContractPauseFormSchema>({
    defaultValues,
    mode: "onSubmit",
    schema,
  });

  const { isDirty, isSubmitting } = methods.formState;

  const [watchedFrom, watchedUntil] = methods.watch("dateRange");

  const hasOverlap =
    watchedFrom != null && watchedUntil != null
      ? overlapsExistingPause(
          watchedFrom,
          watchedUntil,
          existingPauses,
          initial?.pauseId,
        )
      : false;

  // TODO: handle concurrent-pause error cases on submit. existingPauses is a
  // snapshot from page load, so another staff member can create a pause (or
  // contract pause) in the meantime. The submit can then conflict server-side;
  // the legacy backend returns distinct errors per scenario that we must surface
  // here once the backend is ready.
  const { isPausing, pauseBillingPlan } = usePauseBillingPlan({
    onSuccess: () => {
      closeModal();
      methods.reset();
    },
  });

  const isLoading = isPausing;

  const safeCloseModal = () => {
    if (isLoading) {
      return;
    }

    closeModal();
    methods.reset();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) {
      return;
    }

    safeCloseModal();
  };

  const onSubmit = (formData: ContractPauseFormData) => {
    const [fromDate, untilDate] = formData.dateRange;

    if (!fromDate || !untilDate) {
      return;
    }

    const days =
      calculateDiffDuration({
        lowerDatetime: fromDate,
        upperDatetime: untilDate,
        units: ["days"],
      }).days + 1;

    pauseBillingPlan({
      action_pack_kind: PAUSE_ACTION_KIND.EXTEND,
      billing_plan_id: billingPlanId,
      days,
      from_date: fromDate.toISODate() || "",
      name: formData.name,
      pause_id: initial?.pauseId,
    });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("pauseModal.actions.confirm"),
        color: "main",
        type: "submit",
        form: formId,
        disabled: isLoading || hasOverlap,
        loading: isLoading,
      }}
      cancelButton={{
        label: t("pauseModal.actions.cancel"),
        onClick: safeCloseModal,
        disabled: isLoading,
      }}
      onCloseButtonClick={safeCloseModal}
      title={
        initial ? t("pauseModal.title.edit") : t("pauseModal.title.create")
      }
      size="md"
      onClickOutside={handleClickOutside}
    >
      <div onSubmit={(event) => event.stopPropagation()}>
        <ControlledForm id={formId} {...methods} onSubmit={onSubmit}>
          <ContractPauseForm
            errorAlert={hasOverlap ? t("pauseModal.overlapError") : undefined}
            formId={formId}
          />
        </ControlledForm>
      </div>
    </Modal>
  );
};
