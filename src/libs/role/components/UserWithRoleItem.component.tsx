import React from 'react';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Theme,
  withStyles,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';

// @ts-ignore
import withConfirm from '../../../hocs/with-confirm.hoc';
import { Role, UserRole } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { getRoleName } from '../utils';
import { OWNER_ROLE } from '../role-types';

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

type OwnProps = {
  handleRoleChange: (roleId: number) => void;
  user: UserRole;
  roles: Role[];
  deleteUser: (id: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const UserWithRole = (props: Props) => {
  return (
    <div className={props.classes.roleFieldContainer}>
      <TextField
        className={props.classes.roleField}
        disabled
        value={props.user.email}
      />
      <TextField
        className={props.classes.roleField}
        disabled
        value={`${props.user.first_name} ${props.user.last_name}`}
      />
      <FormControl>
        <Select
          className={props.classes.roleField}
          disabled={props.user.role === OWNER_ROLE}
          value={props.user.role || 0}
          onChange={(ev: any) => {
            props.handleRoleChange(parseInt(ev.target.value, 10));
          }}
          name="role"
        >
          {props.roles.map((role) => (
            <MenuItem
              disabled={role.id === OWNER_ROLE}
              key={role.id}
              value={role.id}
            >
              {getRoleName(role, props.t)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.user.role !== OWNER_ROLE ? (
        <DeleteButton t={props.t} deleteUser={props.deleteUser} />
      ) : null}
    </div>
  );
};

const styles = (theme: Theme) => ({
  roleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleField: {
    marginRight: theme.spacing(1),
    minWidth: 200,
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
)(UserWithRole);
