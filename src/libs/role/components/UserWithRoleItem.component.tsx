// @ts-nocheck
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
import InputAdornment from '@material-ui/core/InputAdornment';
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
  deleteUser: (id: number) => void;
  editUserSelectedFranchisees?: (franchiseeIds: number[]) => void;
  franchiseRoles?: FranchiseRole[];
  franchiseeList: Array<Company>;
  franchiseeListLoading: boolean;
  handleRoleChange: (roleId: number) => void;
  hasOwnerPermission: boolean;
  isFranchisor?: boolean;
  roles?: Role[];
  user: UserRole;
  handleCommissionChange: (commissionValue: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selectedFranchisees?: SelectFieldItem[];
  commission?: number;
};

class UserWithRoleItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedFranchisees: null,
      commission: parseFloat(this.props.user.staff_commission_percentage),
    };
  }

  handleObjectChange = () => {
    if (this.props.isFranchisor) {
      const franchiseeIds =
        this.state.selectedFranchisees?.map(
          (franchise: SelectFieldItem) => franchise.value,
        ) ?? [];
      this.props.editUserSelectedFranchisees(franchiseeIds);
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
      franchiseeList,
      franchiseeListLoading,
      isFranchisor,
      handleCommissionChange,
    } = this.props;

    const selectedObjectsInitial = (() => {
      return isFranchisor &&
        this.props.user?.allowed_franchisees &&
        this.props.franchiseeList
        ? getOptionsFromIds(
            this.props.user?.allowed_franchisees || [],
            this.props.franchiseeList || [],
          )
        : [];
    })();
    let roleId: number;
    let roleIdentifier: number;
    if (isFranchisor) {
      roleId = user.franchise_role;
      roleIdentifier = user.franchise_role_identifier;
    } else {
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
        this.setState({ selectedFranchisees: [] });
      }
    };

    const handleOnCommissionChange = (ev) => {
      let parsedValue = Number.parseFloat(ev.target.value.toString());
      parsedValue = parseFloat(parsedValue.toFixed(2));
      if (parsedValue > 100) {
        parsedValue = 100;
      }
      this.setState({ commission: parsedValue });
    };

    const handleOnCommissionFocus = () => {
      if (Number.isNaN(this.state.commission)) {
        this.setState({
          commission: this.props.user.staff_commission_percentage,
        });
      } else {
        handleCommissionChange(this.state.commission);
      }
    };

    const isRelatedToFranchisor = !!this.props.user.franchise_user;

    return (
      <div className={classes.roleFieldContainer}>
        <div className={classes.userRoleFieldContainer}>
          <TextField
            disabled
            className={classes.roleField}
            value={user.email}
          />

          <TextField
            disabled
            className={classes.roleField}
            value={`${user.first_name} ${user.last_name}`}
          />

          <FormControl>
            <Select
              className={classes.roleField}
              disabled={isRoleIn([OWNER_ROLE, CHECKIN_APP_ROLE])}
              name="role"
              onChange={handleOnRoleChange}
              value={roleId || 0}
            >
              {(isFranchisor ? franchiseRoles : roles).map((role) => {
                return (
                  <MenuItem
                    key={role.id}
                    disabled={disableRoleMenuItem(role)}
                    value={role.id}
                  >
                    {getRoleName(role, t)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {!isRoleIn([OWNER_ROLE]) && (
            <TextField
              castAsNumber
              className={classes.commissionField}
              disabled={!hasOwnerPermission || isRelatedToFranchisor}
              InputProps={{
                inputProps: { min: 0, max: 100, step: 1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <p>%</p>
                  </InputAdornment>
                ),
              }}
              label={t('forms.user.commission')}
              onBlur={handleOnCommissionFocus}
              onChange={handleOnCommissionChange}
              type="number"
              value={this.state.commission}
            />
          )}
        </div>

        {!isRoleIn([OWNER_ROLE]) && hasOwnerPermission && (
          <DeleteButton deleteUser={deleteUser} t={t} />
        )}

        {isFranchisor &&
          !(
            isRoleIn(Object.values(COMMON_ROLES)) ||
            roleIdentifier === ADMIN_ROLE
          ) &&
          hasOwnerPermission && (
            <div className={classes.selectorField}>
              <MaterialUISelector
                isMulti
                isLoading={franchiseeListLoading}
                menuPlacement="bottom"
                name="franchisees"
                onChange={(values: SelectFieldItem[]) => {
                  this.setState(
                    { selectedFranchisees: values },
                    this.handleObjectChange,
                  );
                }}
                options={[...franchiseeList]?.map((object: Company) => ({
                  value: object.id,
                  label: object.name,
                }))}
                placeholder={t('forms.user.selectFranchisees')}
                value={this.state.selectedFranchisees ?? selectedObjectsInitial}
              />
              <Typography color="textSecondary" variant="caption">
                {t('forms.user.ifEmptySelectAll')}
              </Typography>
            </div>
          )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  userRoleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  roleFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  commissionField: {
    marginRight: theme.spacing(1),
    width: 70,
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
