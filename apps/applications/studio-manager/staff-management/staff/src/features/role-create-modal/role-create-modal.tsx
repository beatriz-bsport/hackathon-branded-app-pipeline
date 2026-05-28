import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useId, useMemo, useRef } from "react";
import { useNavigate } from "react-router";

import {
  type Role,
  fetchRoleDefinitionsQueryOptions,
} from "@bsport/api-staff-management/role";
import { ControlledForm, useFormController } from "@bsport/form";
import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { FeaturePermissionsStep } from "../role-form/components/feature-permissions-step";
import { NavigationPermissionsStep } from "../role-form/components/navigation-permissions-step";
import { RoleFormDescription } from "../role-form/components/role-form-description";
import { RoleFormName } from "../role-form/components/role-form-name";
import { RoleFormStarterRole } from "../role-form/components/role-form-starter-role";
import {
  DEFAULT_PERMISSIONS,
  ROLE_FORM_DEFAULTS,
  getObjectLevelPermissionsWithDefaults,
} from "../role-form/constants";
import { hasSelectedPermission } from "../role-form/permission-tree-utils";
import { useRoleFormSchema } from "../role-form/schema";
import type { RoleFormSchema } from "../role-form/types";
import { useCreateRole } from "./use-create-role";

type RoleCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const RoleCreateModal: FC<RoleCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("role-form");
  const navigate = useNavigate();
  const { data: roles = [] } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );
  const formId = `role-create-${useId()}`;
  const roleFormSchema = useRoleFormSchema();
  const { createRole, isLoading } = useCreateRole();
  const methods = useFormController<RoleFormSchema>({
    mode: "onChange",
    schema: roleFormSchema,
    defaultValues: ROLE_FORM_DEFAULTS,
  });
  const { isValid, isDirty } = methods.formState;
  const starterRoleId = methods.watch("starterRoleId");
  const lastAppliedStarterRoleIdRef = useRef<string | undefined>(undefined);
  // Mirrors ModalStepper's internal currentStep so handleConfirmClick
  // can distinguish "advance" from "submit" (confirmButton.onClick fires on every step).
  const currentStepRef = useRef(0);

  const closeModal = () => {
    currentStepRef.current = 0;
    methods.reset(ROLE_FORM_DEFAULTS);
    onClose();
  };

  const handleCancelClick = () => {
    currentStepRef.current = Math.max(currentStepRef.current - 1, 0);
  };

  const handleConfirmClick = () => {
    if (currentStepRef.current < steps.length - 1) {
      currentStepRef.current += 1;
      return;
    }

    createRole(methods.getValues(), {
      onSuccess: (role: Role) => {
        closeModal();
        navigate(URLS.ROLE_DETAILS(role.id));
      },
    });
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
    methods.setValue(
      "objectLevelPermissions",
      getObjectLevelPermissionsWithDefaults(
        starterRole?.object_level_permissions,
      ),
      {
        shouldDirty: Boolean(starterRoleId),
        shouldValidate: true,
      },
    );
    methods.setValue(
      "hasBookingOverrideControl",
      starterRole?.has_booking_override_control ?? false,
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
        content: <FeaturePermissionsStep methods={methods} />,
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
        disabled: isLoading,
        onClick: handleConfirmClick,
      }}
      cancelButton={{
        label: t("buttons.close"),
        onClick: handleCancelClick,
      }}
    />
  );
};
