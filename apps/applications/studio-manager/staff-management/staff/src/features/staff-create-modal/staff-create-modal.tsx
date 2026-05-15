import { type FC, useEffect, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { StaffFormBillingGroup } from "../staff-form/components/staff-form-billing-group";
import { StaffFormCommission } from "../staff-form/components/staff-form-commission";
import { StaffFormEmail } from "../staff-form/components/staff-form-email";
import { StaffFormFirstName } from "../staff-form/components/staff-form-first-name";
import { StaffFormLastName } from "../staff-form/components/staff-form-last-name";
import { StaffFormPassword } from "../staff-form/components/staff-form-password";
import { StaffFormRole } from "../staff-form/components/staff-form-role";
import { StaffFormTeachers } from "../staff-form/components/staff-form-teachers";
import { STAFF_FORM_DEFAULTS } from "../staff-form/constants";
import { useStaffFormSchema } from "../staff-form/schema";
import type { StaffFormSchema } from "../staff-form/types";
import { useCreateStaff } from "./use-create-staff";

type StaffCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const StaffCreateModal: FC<StaffCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formId = `staff-create-${useId()}`;
  const { t } = useTranslation("staff-list");
  const staffFormSchema = useStaffFormSchema();
  const { createStaff, isLoading } = useCreateStaff();

  const methods = useFormController<StaffFormSchema>({
    mode: "onChange",
    schema: staffFormSchema,
    defaultValues: STAFF_FORM_DEFAULTS,
  });

  const { isDirty, isSubmitting, isValid } = methods.formState;
  const { setValue, watch } = methods;
  const selectedRoleId = watch("role");

  useEffect(() => {
    setValue("coachesInRoleIds", [], {
      shouldDirty: false,
      shouldValidate: false,
    });
    setValue("staffEstablishmentBillingGroup", "", {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [selectedRoleId, setValue]);

  const closeModal = () => {
    methods.reset(STAFF_FORM_DEFAULTS);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting || isLoading) {
      return;
    }

    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("createModal.title")}
      onClose={closeModal}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("createModal.buttons.add"),
        type: "submit",
        form: formId,
        iconLeft: isLoading ? "loading" : undefined,
        disabled: !isValid || !isDirty || isSubmitting || isLoading,
      }}
      cancelButton={{
        label: t("createModal.buttons.close"),
        onClick: closeModal,
      }}
    >
      <ControlledForm
        id={formId}
        onSubmit={(data) => {
          createStaff(data, {
            onSuccess: closeModal,
          });
        }}
        {...methods}
      >
        <div className="flex flex-col gap-md w-full">
          <StaffFormFirstName formId={formId} />
          <StaffFormLastName formId={formId} />
          <StaffFormEmail formId={formId} />
          <StaffFormPassword formId={formId} />
          <StaffFormCommission formId={formId} />
          <StaffFormRole formId={formId} />
          <StaffFormTeachers />
          <StaffFormBillingGroup formId={formId} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
