import React from 'react';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  Badge,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import { Company } from '#src/libs/company/types';
import { DEFAULT_ROLES } from '#src/libs/role/constants';
// @ts-expect-error
import withConfirm from '../../../hocs/with-confirm.hoc';
import { Role, UserRole, SelectFieldItem, FranchiseRole } from '../types';
import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import { MaterialStyleType } from '../../../utils/types';
import { getRoleName, getOptionsFromIds } from '../utils';
import COMMON_ROLES, {
  OWNER_ROLE,
  CHECKIN_APP_ROLE,
  ADMIN_ROLE,
  STAFF_ROLE,
  // @ts-expect-error
} from '../role-types';

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
  editedFieldCount: number;
  editUserSelectedFranchisees?: (franchiseeIds: number[]) => void;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
  franchiseeList: Array<Company>;
  franchiseeListLoading: boolean;
  franchiseRoles?: FranchiseRole[];
  handleCommissionChange: (commissionValue: number) => void;
  handleOpenAdvancedRoleSettings: (
    user: UserRole<number, FranchiseRole>,
  ) => void;
  handleRoleChange: (roleId: number) => void;
  hasAccessMonitoringUpsell: boolean;
  hasOwnerPermission: boolean;
  isFranchisor?: boolean;
  roles?: Role[];
  user: UserRole;
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
      // @ts-expect-error
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
      deleteUser,
      editedFieldCount,
      establishmentBillingGroups,
      franchiseeList,
      franchiseeListLoading,
      franchiseRoles,
      handleCommissionChange,
      handleOpenAdvancedRoleSettings,
      handleRoleChange,
      hasAccessMonitoringUpsell,
      hasOwnerPermission,
      isFranchisor,
      roles,
      t,
      user,
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
        // @ts-expect-error
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

    // @ts-expect-error
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
          // @ts-expect-error
          commission: this.props.user.staff_commission_percentage,
        });
      } else {
        handleCommissionChange(this.state.commission);
      }
    };

    const isRelatedToFranchisor = !!this.props.user.franchise_user;

    // Admin/Staff users allow editing billing group only (no other settings).
    const canEditBillingGroupForCommonRoles =
      !!establishmentBillingGroups?.length &&
      hasOwnerPermission &&
      !isFranchisor &&
      (roleId === ADMIN_ROLE || roleId === STAFF_ROLE);

    const canEditUserRoleAdvancedSettings =
      (!(
        isRoleIn(Object.values(COMMON_ROLES)) || roleIdentifier === ADMIN_ROLE
      ) &&
        hasOwnerPermission) ||
      canEditBillingGroupForCommonRoles;

    const canDeleteUserRole = !isRoleIn([OWNER_ROLE]) && hasOwnerPermission;

    const showNoEstablishmentAlert =
      hasAccessMonitoringUpsell &&
      roles.find((_role) => _role.id === user.role)?.permissions?.navigationMenu
        ?.accessMonitoring?.perform &&
      !user?.establishments_selected_in_role?.length;

    return (
      <div className={classes.root}>
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
                // @ts-expect-error
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
          {!isFranchisor && canEditUserRoleAdvancedSettings && (
            <Tooltip
              arrow
              placement="left"
              title={t('forms.user.advancedSettings')}
            >
              <Badge
                badgeContent={editedFieldCount}
                classes={{ colorPrimary: classes.infoBadge }}
                color="primary"
              >
                {/* @ts-expect-error */}
                <IconButton
                  className={classes.advancedSettingsButton}
                  onClick={handleOpenAdvancedRoleSettings}
                >
                  <MoreVertIcon />
                </IconButton>
              </Badge>
            </Tooltip>
          )}
          {canDeleteUserRole && <DeleteButton deleteUser={deleteUser} t={t} />}
          {isFranchisor && canEditUserRoleAdvancedSettings && (
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

        {/** The staff member is allowed to perform access monitoring, but it has
        no linked establishment */}
        {showNoEstablishmentAlert && (
          <Alert className={classes.noEstablishmentAlert} severity="error">
            {t('forms.user.warningNoEstablishmentSelected')}
          </Alert>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
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
  advancedSettingsButton: {
    borderRadius: theme.spacing(0.5),
    borderColor: theme.palette.text.secondary,
    border: '1px solid',
    display: 'flex',
    flexDirection: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  infoBadge: {
    backgroundColor: theme.palette.info.main,
  },
  noEstablishmentAlert: {
    alignSelf: 'stretch',
  },
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation('role'),
)(UserWithRoleItem);
