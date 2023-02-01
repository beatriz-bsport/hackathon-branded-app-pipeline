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
  Typography,
  withStyles,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';

// @ts-ignore
import withConfirm from '../../../hocs/with-confirm.hoc';
import { Role, UserRole, SelectFieldItem, FranchiseRole } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { getRoleName, getOptionsFromIds } from '../utils';
import COMMON_ROLES, {
  OWNER_ROLE,
  CHECKIN_APP_ROLE,
  ADMIN_ROLE,
} from '../role-types';
import { Coach } from '#libs/associated-coach/types';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { Company } from '#libs/company/types';
import { DEFAULT_ROLES } from '#libs/role/constants';

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
  coachList: Array<Coach>;
  coachListLoading: boolean;
  deleteUser: (id: number) => void;
  editUserSelectedObjects?: (objectIds: number[]) => void;
  franchiseRoles?: FranchiseRole[];
  franchiseeList: Array<Company>;
  franchiseeListLoading: boolean;
  handleRoleChange: (roleId: number) => void;
  hasOwnerPermission: boolean;
  isFranchisor?: boolean;
  roles?: Role[];
  user: UserRole;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selectedObjects?: SelectFieldItem[];
};

class UserWithRoleItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedObjects: null,
    };
  }

  handleObjectChange = () => {
    if (this.props.isFranchisor) {
      const franchiseeIds =
        this.state.selectedObjects?.map(
          (franchise: SelectFieldItem) => franchise.value,
        ) ?? [];
      this.props.editUserSelectedObjects(franchiseeIds);
    } else {
      const coachIds =
        this.state.selectedObjects?.map(
          (coach: SelectFieldItem) => coach.value,
        ) ?? [];
      this.props.editUserSelectedObjects(coachIds);
    }
  };

  render() {
    const {
      classes,
      t,
      handleRoleChange,
      hasOwnerPermission,
      user,
      roles,
      franchiseRoles,
      deleteUser,
      coachList,
      coachListLoading,
      franchiseeList,
      franchiseeListLoading,
      isFranchisor,
    } = this.props;

    const selectedObjectsInitial = (() => {
      if (isFranchisor) {
        return this.props.user?.allowed_franchisees && this.props.franchiseeList
          ? getOptionsFromIds(
              this.props.user?.allowed_franchisees || [],
              this.props.franchiseeList || [],
            )
          : [];
      }
      return this.props.user.coaches_selected_in_role && this.props.coachList
        ? getOptionsFromIds(
            this.props.user.coaches_selected_in_role || [],
            this.props.coachList || [],
          )
        : [];
    })();

    let objectListLoading: boolean;
    let objectList: Array<Coach | Company>;
    let roleId: number;
    let roleIdentifier: number;

    if (isFranchisor) {
      objectListLoading = franchiseeListLoading;
      objectList = franchiseeList;
      roleId = user.franchise_role;
      roleIdentifier = user.franchise_role_identifier;
    } else {
      objectListLoading = coachListLoading;
      objectList = coachList;
      roleId = user.role;
      roleIdentifier = null;
    }

    const isRoleIn = (roleIds: number[]) => {
      if (isFranchisor) {
        return roleIdentifier === OWNER_ROLE;
      }
      return roleIds.includes(roleId);
    };

    const disableRoleMenuItem = (role: FranchiseRole | Role) => {
      if (isFranchisor) {
        return role.identifier === OWNER_ROLE;
      }
      return role.id === OWNER_ROLE || role.id === CHECKIN_APP_ROLE;
    };

    const handleOnRoleChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const newRole = parseInt(ev.target.value, 10);
      handleRoleChange(newRole);
      if (DEFAULT_ROLES.includes(newRole)) {
        this.setState({ selectedObjects: [] });
      }
    };

    return (
      <div className={classes.roleFieldContainer}>
        <TextField className={classes.roleField} disabled value={user.email} />
        <TextField
          className={classes.roleField}
          disabled
          value={`${user.first_name} ${user.last_name}`}
        />
        <FormControl>
          <Select
            className={classes.roleField}
            disabled={isRoleIn([OWNER_ROLE, CHECKIN_APP_ROLE])}
            value={roleId || 0}
            onChange={handleOnRoleChange}
            name="role"
          >
            {(isFranchisor ? franchiseRoles : roles).map((role) => {
              return (
                <MenuItem
                  disabled={disableRoleMenuItem(role)}
                  key={role.id}
                  value={role.id}
                >
                  {getRoleName(role, t)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {!isRoleIn([OWNER_ROLE]) && hasOwnerPermission && (
          <DeleteButton t={t} deleteUser={deleteUser} />
        )}
        {!(
          isRoleIn(Object.values(COMMON_ROLES)) || roleIdentifier === ADMIN_ROLE
        ) &&
          hasOwnerPermission && (
            <div className={classes.selectorField}>
              <MaterialUISelector
                placeholder={
                  isFranchisor
                    ? t('forms.user.selectFranchisees')
                    : t('forms.user.selectCoach')
                }
                isLoading={objectListLoading}
                name={isFranchisor ? 'franchisees' : 'coaches'}
                menuPlacement="bottom"
                value={this.state.selectedObjects ?? selectedObjectsInitial}
                onChange={(values: SelectFieldItem[]) => {
                  this.setState(
                    { selectedObjects: values },
                    this.handleObjectChange,
                  );
                }}
                options={[...objectList]?.map((object: Coach | Company) => ({
                  value: object.id,
                  label: object.name,
                }))}
                isMulti
              />
              <Typography variant="caption" color="textSecondary">
                {t('forms.user.ifEmptySelectAll')}
              </Typography>
            </div>
          )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  roleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roleField: {
    marginRight: theme.spacing(1),
    minWidth: 200,
  },
  selectorField: {
    marginRight: theme.spacing(1),
    minWidth: 280,
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation('role'),
)(UserWithRoleItem);
