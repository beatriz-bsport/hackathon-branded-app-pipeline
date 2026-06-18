import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { useBillingPlanUpcomingInvoicesQuery } from "#src/hooks/api/use-billing-plan-upcoming-invoices-query";
import { useCancelBillingPlan } from "#src/hooks/api/use-cancel-billing-plan";
import { useTranslation } from "#src/utils/i18n";

import { MembershipPlanCancelForm } from "./cancel-form";
import {
  type MembershipPlanCancelFormData,
  type MembershipPlanCancelFormSchema,
  useDefaultData,
  useMembershipPlanCancelFormSchema,
} from "./schema";

type MembershipPlanCancelModalProps = {
  billingPlanId: number;
  closeModal: () => void;
  isOpen: boolean;
};

export const MembershipPlanCancelModal: FC<MembershipPlanCancelModalProps> = ({
  billingPlanId,
  closeModal,
  isOpen,
}) => {
  const { t } = useTranslation("membership-plan");

  const formId = `membership-plan-cancel-form-${useId()}`;
  const schema = useMembershipPlanCancelFormSchema();
  const defaultValues = useDefaultData();

  const methods = useFormController<MembershipPlanCancelFormSchema>({
    mode: "onSubmit",
    schema,
    defaultValues,
  });

  const { isDirty, isSubmitting } = methods.formState;

  const { data: invoices = [], isLoading: isLoadingInvoices } =
    useBillingPlanUpcomingInvoicesQuery(billingPlanId, isOpen);

  const resetModal = () => {
    methods.reset();
  };

  const { cancelBillingPlan, isCancelling } = useCancelBillingPlan({
    onSuccess: () => {
      closeModal();
      resetModal();
    },
  });

  const safeCloseModal = () => {
    // Only the cancellation request blocks closing; invoice loading must not.
    if (isCancelling) {
      return;
    }

    closeModal();
    resetModal();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) {
      return;
    }

    safeCloseModal();
  };

  const onSubmit = (formData: MembershipPlanCancelFormData) => {
    cancelBillingPlan({
      billing_plan_id: billingPlanId,
      reason: formData.reason,
      from_invoice_id: formData.fromInvoiceId,
    });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("cancelModal.actions.save"),
        color: "critical",
        type: "submit",
        form: formId,
        disabled: isCancelling,
        loading: isCancelling,
      }}
      cancelButton={{
        label: t("cancelModal.actions.close"),
        onClick: safeCloseModal,
        disabled: isCancelling,
      }}
      onCloseButtonClick={safeCloseModal}
      title={t("cancelModal.title")}
      size="md"
      onClickOutside={handleClickOutside}
    >
      <div onSubmit={(e) => e.stopPropagation()}>
        <ControlledForm id={formId} {...methods} onSubmit={onSubmit}>
          <MembershipPlanCancelForm
            formId={formId}
            invoices={invoices}
            isLoadingInvoices={isLoadingInvoices}
          />
        </ControlledForm>
      </div>
    </Modal>
  );
};
