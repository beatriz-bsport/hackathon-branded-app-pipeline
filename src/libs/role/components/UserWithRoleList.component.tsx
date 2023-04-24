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
  roles?: Role[];
  updateUserRole: (
    userId: number,
    params: { roleId?: number; coaches?: number[]; franchisees?: number[] },
  ) => void;
  users: Array<UserRole<number, FranchiseRole>>;
  openCreateStaffDialog: boolean;
  setOpenCreateStaffDialog: (value: boolean) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const UserWithRoleList = (props: Props) => {
  const { setOpenCreateStaffDialog, createUserRole } = props;
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
      {props.users.map((user) => (
        <div className={props.classes.roleListItem} key={user.id}>
          <UserWithRoleItem
            coachList={props.coachList}
            coachListLoading={props.coachListLoading}
            deleteUser={() => props.deleteUserRole(user.id)}
            editUserSelectedObjects={(objectsIds: number[]) =>
              props.updateUserRole(
                user.id,
                props.isFranchisor
                  ? { franchisees: objectsIds }
                  : { coaches: objectsIds },
              )
            }
            franchiseRoles={props.franchiseRoles}
            franchiseeList={props.franchiseeList}
            franchiseeListLoading={props.franchiseeListLoading}
            handleRoleChange={(role) =>
              props.updateUserRole(user.id, { roleId: role })
            }
            hasOwnerPermission={props.hasOwnerPermission}
            isFranchisor={props.isFranchisor}
            roles={props.roles}
            user={user}
          />
        </div>
      ))}
      {props.isFranchisor ? (
        <FranchiseCreateStaffUser
          open={props.openCreateStaffDialog}
          onSubmit={onSubmitStaffUserCreation}
          onClose={onCloseCreateStaffDialog}
          franchiseRoles={props.franchiseRoles}
          franchiseeList={props.franchiseeList}
          franchiseeListLoading={props.franchiseeListLoading}
        />
      ) : (
        <CreateStaffUser
          open={props.openCreateStaffDialog}
          onSubmit={onSubmitStaffUserCreation}
          onClose={onCloseCreateStaffDialog}
          roles={props.roles}
          coachList={props.coachList}
          coachListLoading={props.coachListLoading}
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
