import React from 'react';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Theme } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

import UserWithRole from './UserWithRoleItem.component';
import CreateStaffUser from './CreateStaffUser.component';
import { UserRole, UserRoleData, Role } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  users: Array<UserRole>;
  roles: Role[];
  deleteUser: (id: number) => void;
  createUser: (data: UserRoleData) => void;
  onChangeRole: (userId: number, roleId: number) => void;
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
        <UserWithRole
          user={user}
          roles={props.roles}
          handleRoleChange={(role) => props.onChangeRole(user.id, role)}
          deleteUser={() => props.deleteUser(user.id)}
        />
      </div>
    ))}
    <CreateStaffUser
      open={props.createOpen}
      onSubmit={(data) => {
        props.createUser(data);
        props.setCreateOpen(false);
      }}
      onClose={() => props.setCreateOpen(false)}
      roles={props.roles}
    />
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
