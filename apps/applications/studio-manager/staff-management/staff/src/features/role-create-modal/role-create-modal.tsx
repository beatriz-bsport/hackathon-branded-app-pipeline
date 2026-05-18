import { type FC, useId, useMemo } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { RoleFormDescription } from "../role-form/components/role-form-description";
import { RoleFormName } from "../role-form/components/role-form-name";
import { RoleFormStarterRole } from "../role-form/components/role-form-starter-role";
import { ROLE_FORM_DEFAULTS } from "../role-form/constants";
import { useRoleFormSchema } from "../role-form/schema";
import type { RoleFormSchema } from "../role-form/types";

type RoleCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RoleCreateModal: FC<RoleCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("role-form");
  const formId = `role-create-${useId()}`;
  const roleFormSchema = useRoleFormSchema();
  const methods = useFormController<RoleFormSchema>({
    mode: "onChange",
    schema: roleFormSchema,
    defaultValues: ROLE_FORM_DEFAULTS,
  });
  const { isValid, isDirty } = methods.formState;

  const closeModal = () => {
    methods.reset(ROLE_FORM_DEFAULTS);
    onClose();
  };

  const steps = useMemo(
    () => [
      {
        label: t("steps.roleSetup.label"),
        formId,
        content: (
          <ControlledForm
            id={formId}
            className="w-full min-w-0"
            onSubmit={() => {}}
            {...methods}
          >
            <div className="flex flex-col gap-md w-full min-w-0">
              <RoleFormName formId={formId} />
              <RoleFormDescription formId={formId} />
              <RoleFormStarterRole formId={formId} />
            </div>
          </ControlledForm>
        ),
        validate: () => isValid,
      },
      {
        label: t("steps.navigationPermissions.label"),
        content: <div>{t("steps.navigationPermissions.placeholder")}</div>,
      },
      {
        label: t("steps.featurePermissions.label"),
        content: <div>{t("steps.featurePermissions.placeholder")}</div>,
      },
    ],
    [isValid, i18n, formId, methods],
  );

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={t("title")}
      steps={steps}
      onClose={closeModal}
      onClickOutside={isDirty ? () => {} : closeModal}
      confirmButton={{
        label: t("buttons.confirm"),
        onClick: () => {},
      }}
      cancelButton={{
        label: t("buttons.close"),
      }}
    />
  );
};
