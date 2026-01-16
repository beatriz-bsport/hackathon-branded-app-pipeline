import React, { useCallback } from 'react';
import List from '@material-ui/core/List';
import { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { Coach } from '#src/libs/associated-coach/types';
import { Company } from '#src/libs/company/types';
import FranchiseCreateStaffUser from '#src/libs/franchise/components/FranchiseCreateStaffUser.component';
import {
  Establishment,
  EstablishmentBillingGroup,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import UserWithRoleItem from '#src/libs/role/components/UserWithRoleItem.component';
import CreateStaffUser from '#src/libs/role/components/CreateStaffUser.component';
import type {
  UserRole,
  UserRoleData,
  Role,
  FranchiseRole,
  FranchiseUserRoleData,
} from '#src/libs/role/types';
import type { MaterialStyleType } from '#src/utils/types';
import AdvancedRoleSettingsModal from '#src/libs/role/components/AdvancedRoleSettingsModal.component';

type OwnProps = {
  coachList?: Array<Coach>;
  coachListLoading?: boolean;
  createUserRole: (data: UserRoleData | FranchiseUserRoleData) => void;
  deleteUserRole: (id: number) => void;
  establishmentGroupList?: Array<EstablishmentGroup>;
  establishmentGroupListLoading?: boolean;
  establishmentList?: Array<Establishment>;
  establishmentListLoading?: boolean;
  franchiseeList?: Array<Company>;
  franchiseeListLoading?: boolean;
  franchiseRoles?: FranchiseRole[];
  hasAccessMonitoringUpsell: boolean;
  hasMultiLocationUpsell: boolean;
  hasOwnerPermission: boolean;
  isFranchisor?: boolean;
  openCreateStaffDialog: boolean;
  roles?: Role[];
  setOpenCreateStaffDialog: (value: boolean) => void;
  updateCommission: (userId: number, params: { commission: number }) => void;
  updateUserRole: (
    userId: number,
    params: { roleId?: number; coaches?: number[]; franchisees?: number[] },
  ) => void;
  users: Array<UserRole<number, FranchiseRole>>;
  establishmentBillingGroups: EstablishmentBillingGroup[];
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const UserWithRoleList: React.FC<Props> = ({
  classes,
  coachList,
  coachListLoading,
  createUserRole,
  deleteUserRole,
  establishmentGroupList,
  establishmentGroupListLoading,
  establishmentList,
  establishmentListLoading,
  franchiseeList,
  franchiseeListLoading,
  franchiseRoles,
  hasMultiLocationUpsell,
  hasAccessMonitoringUpsell,
  hasOwnerPermission,
  isFranchisor,
  openCreateStaffDialog,
  roles,
  setOpenCreateStaffDialog,
  updateCommission,
  updateUserRole,
  users,
  establishmentBillingGroups,
}) => {
  const [selectedUserRole, setSelectedUserRole] = React.useState<UserRole<
    number,
    FranchiseRole
  > | null>(null);

  const onCloseCreateStaffDialog = React.useCallback(
    () => setOpenCreateStaffDialog(false),
    [setOpenCreateStaffDialog],
  );
  const onSubmitStaffUserCreation = React.useCallback(
    (
      data: FranchiseUserRoleData & {
        first_name: string;
        last_name: string;
      },
    ) => {
      createUserRole(data);
      setOpenCreateStaffDialog(false);
    },
    [createUserRole, setOpenCreateStaffDialog],
  );

  const getUserRoleEditedFieldCount = useCallback(
    (user: UserRole<number, FranchiseRole>) => {
      let editedFieldCount = 0;

      const isPerformAccessMonitoringUserRoleWithEstablishments =
        hasAccessMonitoringUpsell &&
        user?.establishments_selected_in_role?.length &&
        roles?.find((role_) => role_.id === user?.role)?.permissions
          ?.navigationMenu?.accessMonitoring?.perform;

      if (user?.coaches_selected_in_role?.length) {
        editedFieldCount += 1;
      }
      if (isPerformAccessMonitoringUserRoleWithEstablishments) {
        editedFieldCount += 1;
      }

      return editedFieldCount;
    },
    [hasAccessMonitoringUpsell, roles],
  );

  const editUserSelectedFranchisees = useCallback(
    (user) => {
      if (!user?.id) {
        return null;
      }
      return (franchiseesIds: number[]) =>
        updateUserRole(user.id, { franchisees: franchiseesIds });
    },
    [updateUserRole],
  );

  const handleSetUserSelectedRole = useCallback(
    (user: UserRole<number, FranchiseRole>) => () => {
      setSelectedUserRole(user);
    },
    [],
  );

  return (
    <List className={classes.list}>
      {users.map((user) => (
        <div key={user.id} className={classes.roleListItem}>
          <UserWithRoleItem
            deleteUser={() => deleteUserRole(user.id)}
            editedFieldCount={getUserRoleEditedFieldCount(user)}
            editUserSelectedFranchisees={editUserSelectedFranchisees(user)}
            establishmentBillingGroups={establishmentBillingGroups}
            franchiseeList={franchiseeList}
            franchiseeListLoading={franchiseeListLoading}
            franchiseRoles={franchiseRoles}
            handleCommissionChange={(commissionValue) =>
              updateCommission(user.id, { commission: commissionValue })
            }
            handleOpenAdvancedRoleSettings={handleSetUserSelectedRole(user)}
            handleRoleChange={(role) =>
              updateUserRole(user.id, { roleId: role })
            }
            hasAccessMonitoringUpsell={hasAccessMonitoringUpsell}
            hasOwnerPermission={hasOwnerPermission}
            isFranchisor={isFranchisor}
            roles={roles}
            // @ts-expect-error
            user={user}
          />
        </div>
      ))}
      {isFranchisor ? (
        <FranchiseCreateStaffUser
          franchiseeList={franchiseeList}
          franchiseeListLoading={franchiseeListLoading}
          franchiseRoles={franchiseRoles}
          onClose={onCloseCreateStaffDialog}
          onSubmit={onSubmitStaffUserCreation}
          open={openCreateStaffDialog}
        />
      ) : (
        <CreateStaffUser
          coachList={coachList}
          coachListLoading={coachListLoading}
          establishmentBillingGroups={establishmentBillingGroups}
          establishmentGroupList={establishmentGroupList}
          establishmentGroupListLoading={establishmentGroupListLoading}
          establishmentList={establishmentList}
          establishmentListLoading={establishmentListLoading}
          hasAccessMonitoringUpsell={hasAccessMonitoringUpsell}
          hasMultiLocationUpsell={hasMultiLocationUpsell}
          onClose={onCloseCreateStaffDialog}
          // @ts-expect-error
          onSubmit={onSubmitStaffUserCreation}
          open={openCreateStaffDialog}
          roles={roles}
          // showAccessMonitoringSection={showAccessMonitoringSection}
        />
      )}
      <AdvancedRoleSettingsModal
        coachList={coachList}
        coachListLoading={coachListLoading}
        customRole={roles?.find((role_) => role_.id === selectedUserRole?.role)}
        establishmentBillingGroups={establishmentBillingGroups}
        // @ts-expect-error
        establishmentGroupList={establishmentGroupList}
        establishmentGroupListLoading={establishmentGroupListLoading}
        establishmentList={establishmentList}
        establishmentListLoading={establishmentListLoading}
        hasAccessMonitoringUpsell={hasAccessMonitoringUpsell}
        hasMultiLocationUpsell={hasMultiLocationUpsell}
        onClose={handleSetUserSelectedRole(null)}
        onConfirm={handleSetUserSelectedRole(null)}
        updateUserRole={updateUserRole}
        userRole={selectedUserRole}
      />
    </List>
  );
};

const styles = (theme: Theme) => ({
  roleListItem: {
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['role']),
)(UserWithRoleList);
