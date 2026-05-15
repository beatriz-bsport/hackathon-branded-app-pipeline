import { useSuspenseQueries } from "@tanstack/react-query";
import { type FC, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";

import {
  fetchRoleDefinitionQueryOptions,
  flatUserRolesQueryOptions,
} from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import { Breadcrumbs, Button, ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import {
  type RoleDeleteData,
  RoleDeleteModal,
} from "#src/features/role-delete/role-delete-modal";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type RoleDetailsPageContentProps = {
  roleId: number;
};

const RoleDetailsPageContent: FC<RoleDetailsPageContentProps> = ({
  roleId,
}) => {
  const { t } = useTranslation("role-details");
  const navigate = useNavigate();
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

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={role.name}
          BreadcrumbsItems={[
            <Link key="to-roles" to={`../${URLS.ROLE}`}>
              <Breadcrumbs.Item text={t("breadcrumbs.roles")} />
            </Link>,
          ]}
          endGroupActions={
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
              : undefined
          }
        />
        <ListLayout.Content>
          <div />
        </ListLayout.Content>
      </ListLayout>

      <RoleDeleteModal
        role={isDeleteModalOpen ? roleToDelete : null}
        onClose={closeDeleteModal}
        preservePendingDeletionOnUnmount
        onDeleteScheduled={() => navigate(`../${URLS.ROLE}`, { replace: true })}
      />
    </>
  );
};

const RoleDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const parsedId = Number(id);

  if (!id || !Number.isInteger(parsedId) || parsedId <= 0) {
    return <Navigate to={`../${URLS.ROLE}`} replace />;
  }

  return (
    <QueryBoundary>
      <RoleDetailsPageContent roleId={parsedId} />
    </QueryBoundary>
  );
};

export default RoleDetailsPage;
