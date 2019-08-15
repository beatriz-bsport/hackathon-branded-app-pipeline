// @flow
import React from 'react';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import IconButton from '@material-ui/core/IconButton';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

import CreateStaffUser from './CreateStaffUser.component';
import withConfirm from '../../../hocs/with-confirm.hoc';
import type { UserRole, Permission, UserRoleData } from '../types';

type Props = {
  users: Array<UserRole>,
  permissions: Array<Permission>,
  deleteUser: (id: number) => void,
  createOpen: boolean,
  setCreateOpen: (boolean) => void,
  createUser: (UserRoleData) => void,
  onChangeRole: (userId: number, roleId: number) => void,
  t: TFunction,
  classes: Object,
};

const DeleteButton = withConfirm(
  (props: { deleteUser: () => void }) => (
    <IconButton onClick={props.deleteUser}>
      <RemoveCircleIcon color="error" />
    </IconButton>
  ),
  'deleteUser',
  {
    title: 'role:forms.user.delete.title',
    cancel: 'role:forms.user.delete.cancel',
    confirm: 'role:forms.user.delete.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('role:forms.user.delete.content')}</p>
    ),
  },
);

const UserWithRole = (props: {
  t: TFunction,
  classes: Object,
  handleRoleChange: (roleId: number) => void,
  user: UserRole,
  permissions: Array<Permission>,
  deleteUser: (id: number) => void,
}) => (
  <div className={props.classes.roleFieldContainer}>
    <TextField
      className={props.classes.roleField}
      disabled
      value={props.user.email}
    />
    <FormControl>
      <Select
        className={props.classes.roleField}
        disabled={props.user.role === 0}
        value={props.user.role || 0}
        onChange={(ev) => {
          props.handleRoleChange(parseInt(ev.target.value, 10));
        }}
        name="role"
      >
        {props.permissions.map((perm) => (
          <MenuItem disabled={perm.id === 0} key={perm.id} value={perm.id}>
            {perm.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {props.user.role !== 0 ? (
      <DeleteButton t={props.t} deleteUser={props.deleteUser} />
    ) : null}
  </div>
);

export const UserWithRoleList = (props: Props) => (
  <List>
    {props.users.map((user) => (
      <div className={props.classes.roleListItem} key={user.id}>
        <UserWithRole
          user={user}
          t={props.t}
          permissions={props.permissions}
          handleRoleChange={(role) => props.onChangeRole(user.id, role)}
          deleteUser={() => props.deleteUser(user.id)}
          classes={props.classes}
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
      permissions={props.permissions}
    />
    <Button
      variant="outlined"
      color="primary"
      onClick={() => props.setCreateOpen(true)}
    >
      <AddIcon className={props.classes.leftIcon} />
      {props.t('forms.user.create.buttonLabel')}
    </Button>
  </List>
);

const styles = (theme) => ({
  roleListItem: {
    marginBottom: theme.spacing.unit * 2,
  },
  roleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  roleField: {
    marginRight: theme.spacing.unit,
    minWidth: 200,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['role']),
  withState('createOpen', 'setCreateOpen', false),
)(UserWithRoleList);
