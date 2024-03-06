// @ts-nocheck
import React from 'react';
import List from '@material-ui/core/List';
import { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import UserWithRoleItem from './UserWithRoleItem.component';
import CreateStaffUser from './CreateStaffUser.component';
import {
  UserRole,
  UserRoleData,
  Role,
  FranchiseRole,
  FranchiseUserRoleData,
} from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { Coach } from '#libs/associated-coach/types';
import { Company } from '#libs/company/types';
import FranchiseCreateStaffUser from '#libs/franchise/components/FranchiseCreateStaffUser.component';

type OwnProps = {
  coachList?: Array<Coach>;
  coachListLoading?: boolean;
  createUserRole: (data: UserRoleData | FranchiseUserRoleData) => void;
  deleteUserRole: (id: number) => void;
  franchiseeList?: Array<Company>;
  franchiseeListLoading?: boolean;
  franchiseRoles?: FranchiseRole[];
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
  franchiseeList,
  franchiseeListLoading,
  franchiseRoles,
  hasOwnerPermission,
  isFranchisor,
  openCreateStaffDialog,
  roles,
  setOpenCreateStaffDialog,
  updateCommission,
  updateUserRole,
  users,
}) => {
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

  return (
    <List>
      {users.map((user) => (
        <div key={user.id} className={classes.roleListItem}>
          <UserWithRoleItem
            coachList={coachList}
            coachListLoading={coachListLoading}
            deleteUser={() => deleteUserRole(user.id)}
            editUserSelectedObjects={(objectsIds: number[]) =>
              updateUserRole(
                user.id,
                isFranchisor
                  ? { franchisees: objectsIds }
                  : { coaches: objectsIds },
              )
            }
            franchiseeList={franchiseeList}
            franchiseeListLoading={franchiseeListLoading}
            franchiseRoles={franchiseRoles}
            handleCommissionChange={(commissionValue) =>
              updateCommission(user.id, { commission: commissionValue })
            }
            handleRoleChange={(role) =>
              updateUserRole(user.id, { roleId: role })
            }
            hasOwnerPermission={hasOwnerPermission}
            isFranchisor={isFranchisor}
            roles={roles}
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
          onClose={onCloseCreateStaffDialog}
          onSubmit={onSubmitStaffUserCreation}
          open={openCreateStaffDialog}
          roles={roles}
        />
      )}
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
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['role']),
)(UserWithRoleList);
