import React from 'react';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

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
};

type WithStateType = {
  createOpen: boolean;
  setCreateOpen: (value: boolean) => void;
};

type Props = OwnProps &
  WithStateType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const UserWithRoleList = (props: Props) => (
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
        open={props.createOpen}
        onSubmit={(data) => {
          props.createUserRole(data);
          props.setCreateOpen(false);
        }}
        onClose={() => props.setCreateOpen(false)}
        franchiseRoles={props.franchiseRoles}
        franchiseeList={props.franchiseeList}
        franchiseeListLoading={props.franchiseeListLoading}
      />
    ) : (
      <CreateStaffUser
        open={props.createOpen}
        onSubmit={(data) => {
          props.createUserRole(data);
          props.setCreateOpen(false);
        }}
        onClose={() => props.setCreateOpen(false)}
        roles={props.roles}
        coachList={props.coachList}
        coachListLoading={props.coachListLoading}
      />
    )}

    <Button
      variant="outlined"
      color="primary"
      id="button_staff_add"
      onClick={() => props.setCreateOpen(true)}
    >
      <AddIcon className={props.classes.leftIcon} />
      {props.t('forms.user.create.buttonLabel')}
    </Button>
  </List>
);

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
  withState('createOpen', 'setCreateOpen', false),
)(UserWithRoleList);
