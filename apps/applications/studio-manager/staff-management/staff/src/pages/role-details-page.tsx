import { useSuspenseQueries } from "@tanstack/react-query";
import { type FC, useEffect, useId, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";

import {
  type Role,
  fetchRoleDefinitionQueryOptions,
  flatUserRolesQueryOptions,
} from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import {
  type RoleDeleteData,
  RoleDeleteModal,
} from "#src/features/role-delete/role-delete-modal";
import { useUpdateRole } from "#src/features/role-edit/use-update-role";
import { NavigationPermissionsStep } from "#src/features/role-form/components/navigation-permissions-step";
import { RoleFormDescription } from "#src/features/role-form/components/role-form-description";
import { RoleFormName } from "#src/features/role-form/components/role-form-name";
import { useRoleFormSchema } from "#src/features/role-form/schema";
import type {
  RoleFormData,
  RoleFormSchema,
} from "#src/features/role-form/types";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type RoleDetailsPageContentProps = {
  roleId: number;
};

const convertRoleIntoFormData = (role: Role): RoleFormData => ({
  name: role.name,
  description: role.description,
  permissions: role.permissions,
  objectLevelPermissions: role.object_level_permissions,
  hasBookingOverrideControl: role.has_booking_override_control,
});

const RoleDetailsPageContent: FC<RoleDetailsPageContentProps> = ({
  roleId,
}) => {
  const { t } = useTranslation("role-details");
  const navigate = useNavigate();
  const formId = `role-details-${useId()}`;
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();
  const {
    isOpen: isDeleteModalOpen,
    onClose: closeDeleteModal,
    onOpen: openDeleteModal,
  } = useDisclosure();
  const [{ data: role }, { data: staff }] = useSuspenseQueries({
    queries: [
      fetchRoleDefinitionQueryOptions(fetch, { id: roleId }),
      flatUserRolesQueryOptions(fetch),
    ],
  });
  const currentUserRole = dataAccessLayer.useUserAccess()?.role;
  const currentUserIsOwner =
    currentUserRole === RoleType.USER_ROLE_NO_RESTRICTION;
  const roleFormSchema = useRoleFormSchema();
  const defaultValues = useMemo(() => convertRoleIntoFormData(role), [role]);
  const { updateRole, isUpdating } = useUpdateRole();
  const roleToDelete = useMemo<RoleDeleteData>(
    () => ({
      id: role.id,
      name: role.name,
      staffAssignedCount: staff.filter(
        (staffMember) => staffMember.role === role.id,
      ).length,
    }),
    [role.id, role.name, staff],
  );
  const { endGroupActions, startGroupActions } =
    DetailsLayout.useAdaptiveActions({
      endGroupActions:
        role.editable && currentUserIsOwner
          ? [
              <Button
                key="role-details-button-delete"
                color="default"
                intent="flat"
                size="md"
                icon="trash-01"
                kind="icon-button"
                label={t("actions.deleteRole")}
                onClick={openDeleteModal}
              />,
            ]
          : [],
    });

  const methods = useFormController<RoleFormSchema>({
    mode: "onChange",
    schema: roleFormSchema,
    defaultValues,
    criteriaMode: "all",
  });

  const handleDiscardChanges = () => {
    if (isUpdating) {
      return;
    }

    methods.reset();
  };

  const handleSaveChanges = async () => {
    if (isUpdating || !role.editable) {
      return;
    }

    const ok = await methods.trigger();

    if (!ok) {
      console.warn("[Role Form] Invalid", {
        errors: methods.formState.errors,
      });
      return;
    }

    if (!methods.formState.isDirty) {
      return;
    }

    const values = methods.getValues();

    void updateRole(
      {
        id: role.id,
        data: {
          name: values.name,
          description: values.description,
          permissions: values.permissions,
          has_booking_override_control: values.hasBookingOverrideControl,
        },
      },
      {
        onSuccess: (updatedRole) => {
          methods.reset(convertRoleIntoFormData(updatedRole));
        },
      },
    );
  };

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(role.editable && isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, role.editable]);

  return (
    <>
      <ControlledForm {...methods} onSubmit={handleSaveChanges} id={formId}>
        <DetailsLayout {...detailsLayoutProps}>
          <DetailsLayout.Header
            pageTitle={role.name}
            BreadcrumbsItems={[
              <Link key="to-roles" to={URLS.ROLE_INDEX}>
                <Breadcrumbs.Item text={t("breadcrumbs.roles")} />
              </Link>,
            ]}
            endGroupActions={endGroupActions}
            startGroupActions={startGroupActions}
          />
          <DetailsLayout.Content>
            <div className="flex flex-col gap-lg w-full">
              <div className="flex flex-col gap-md w-full">
                <RoleFormName formId={formId} disabled={!role.editable} />
                <RoleFormDescription
                  formId={formId}
                  disabled={!role.editable}
                />
              </div>
              <NavigationPermissionsStep
                methods={methods}
                disabled={!role.editable}
              />
            </div>
          </DetailsLayout.Content>

          {role.editable ? (
            <DetailsLayout.Confirmation
              onDiscard={handleDiscardChanges}
              onSave={handleSaveChanges}
            />
          ) : null}
        </DetailsLayout>
      </ControlledForm>

      <RoleDeleteModal
        role={isDeleteModalOpen ? roleToDelete : null}
        onClose={closeDeleteModal}
        preservePendingDeletionOnUnmount
        onDeleteScheduled={() => navigate(URLS.ROLE_INDEX, { replace: true })}
      />
    </>
  );
};

const RoleDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const parsedId = Number(id);

  if (!id || !Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to={URLS.ROLE_INDEX} replace />;
  }

  return (
    <QueryBoundary>
      <RoleDetailsPageContent roleId={parsedId} />
    </QueryBoundary>
  );
};

export default RoleDetailsPage;
