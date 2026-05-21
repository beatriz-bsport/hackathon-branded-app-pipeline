import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useId, useMemo, useRef } from "react";

import {
  type CompanyRolePermissions,
  fetchRoleDefinitionsQueryOptions,
} from "@bsport/api-staff-management/role";
import { ControlledForm, useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { NavigationPermissionsStep } from "../role-form/components/navigation-permissions-step";
import { RoleFormDescription } from "../role-form/components/role-form-description";
import { RoleFormName } from "../role-form/components/role-form-name";
import { RoleFormStarterRole } from "../role-form/components/role-form-starter-role";
import {
  DEFAULT_PERMISSIONS,
  ROLE_FORM_DEFAULTS,
} from "../role-form/constants";
import { hasSelectedPermission } from "../role-form/permission-tree-utils";
import { useRoleFormSchema } from "../role-form/schema";
import type { RoleFormSchema } from "../role-form/types";

type RoleCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const deepClone = (
  permissions: CompanyRolePermissions,
): CompanyRolePermissions => JSON.parse(JSON.stringify(permissions));

export const RoleCreateModal: FC<RoleCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("role-form");
  const { data: roles = [] } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );
  const formId = `role-create-${useId()}`;
  const roleFormSchema = useRoleFormSchema();
  const methods = useFormController<RoleFormSchema>({
    mode: "onChange",
    schema: roleFormSchema,
    defaultValues: ROLE_FORM_DEFAULTS,
  });
  const { isValid, isDirty } = methods.formState;
  const starterRoleId = methods.watch("starterRoleId");
  const lastAppliedStarterRoleIdRef = useRef<string | undefined>(undefined);

  const closeModal = () => {
    methods.reset(ROLE_FORM_DEFAULTS);
    onClose();
  };

  useEffect(() => {
    if (lastAppliedStarterRoleIdRef.current === starterRoleId) {
      return;
    }

    const starterRole = roles.find((role) => String(role.id) === starterRoleId);
    if (starterRoleId && !starterRole) {
      return;
    }

    methods.setValue(
      "permissions",
      deepClone(starterRole?.permissions ?? DEFAULT_PERMISSIONS),
      {
        shouldDirty: Boolean(starterRoleId),
        shouldValidate: true,
      },
    );
    lastAppliedStarterRoleIdRef.current = starterRoleId;
  }, [methods, roles, starterRoleId]);

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
        content: <NavigationPermissionsStep methods={methods} />,
        validate: () => hasSelectedPermission(methods.getValues("permissions")),
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
      // key resets the internal currentStep to 0 on each open/close cycle.
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
