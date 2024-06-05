import React from 'react';
import { compose } from 'recompose';
import InfoIcon from '@material-ui/icons/Info';
import Alert from '@material-ui/lab/Alert/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import { WithTranslation, withTranslation } from 'react-i18next';
import { Divider, Typography } from '@material-ui/core';
import classNames from 'classnames';
// @ts-expect-error
import { Actions, Submit } from '#components/forms';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

import PasswordInput from '#components/input/PasswordInput.component';
import {
  FranchiseUserRoleData,
  SelectFieldItem,
  FranchiseRole,
} from '#libs/role/types';
// @ts-expect-error
import { OWNER_ROLE, ADMIN_ROLE } from '#libs/role/role-types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Company } from '#libs/company/types';
import { MaterialStyleType } from '../../../utils/types';

export type OwnProps = {
  franchiseeList: Array<Company>;
  franchiseeListLoading: boolean;
  franchiseRoles: FranchiseRole[];
  onClose: () => void;
  onSubmit: (
    data: FranchiseUserRoleData & {
      first_name: string;
      last_name: string;
    },
  ) => void;
  open: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  email?: string | null;
  password?: string | null;
  selectedRole?: SelectFieldItem;
  first_name: string;
  last_name: string;
  selectedFranchisees: SelectFieldItem[];
  selectedRoleIsAdmin: boolean;
  missingFields: { email: boolean; password: boolean; selectedRole: boolean };
  staff_commission_percentage: number;
};

const FRANCHISE_STAFF_USER_NAME_MAX_LENGTH = 150;

export class FranchiseCreateStaffUser extends React.Component<Props, State> {
  state: State = {
    email: null,
    password: null,
    selectedRole: null,
    selectedRoleIsAdmin: false,
    last_name: '',
    first_name: '',
    selectedFranchisees: [],
    missingFields: {
      email: false,
      password: false,
      selectedRole: false,
    },
    staff_commission_percentage: 0,
  };

  onSubmit = (ev: any) => {
    ev.preventDefault();
    const {
      email,
      password,
      selectedRole,
      last_name,
      first_name,
      selectedFranchisees,
      staff_commission_percentage,
    } = this.state;
    if (!email || !password || !selectedRole) {
      this.setState({
        missingFields: {
          email: !email,
          password: !password,
          selectedRole: !selectedRole,
        },
      });
      return;
    }
    const franchisees_in_role_ids =
      selectedRole.value !== ADMIN_ROLE && selectedFranchisees
        ? selectedFranchisees.map((franchisee) => franchisee.value)
        : [];
    this.props.onSubmit({
      email: email?.toLowerCase() || '',
      password,
      franchise_role: selectedRole.value,
      last_name,
      first_name,
      franchisees_in_role_ids,
      // @ts-expect-error
      staff_commission_percentage,
    });
    this.setState({
      email: null,
      password: null,
      selectedRole: null,
      last_name: '',
      first_name: '',
      selectedFranchisees: [],
      staff_commission_percentage: 0,
    });
  };

  // @ts-expect-error
  handleOnCommissionChange = (ev) => {
    let parsedValue = Number.parseFloat(ev.target.value.toString());
    parsedValue = parseFloat(parsedValue.toFixed(2));
    if (parsedValue > 100) {
      parsedValue = 100;
    } else if (Number.isNaN(parsedValue)) {
      parsedValue = 0;
    }
    this.setState({ staff_commission_percentage: parsedValue });
  };

  handleSelectRole = (item: SelectFieldItem) => {
    const selectedRoleIsAdmin =
      this.props.franchiseRoles?.find((role) => role.id === item.value)
        ?.identifier === ADMIN_ROLE;

    this.setState({
      selectedRole: item,
      selectedRoleIsAdmin,
    });
  };

  render() {
    const { t, classes } = this.props;
    const { missingFields } = this.state;
    const availableRoles = [...this.props.franchiseRoles]
      .filter((role) => role.identifier !== OWNER_ROLE)
      .map((role: FranchiseRole) => ({
        value: role?.id,
        label: role?.name,
      }));
    const availableFranchisees = [...this.props.franchiseeList].map(
      (franchisee: Company) => ({
        value: franchisee?.id,
        label: franchisee?.name,
      }),
    );

    return (
      <form>
        <GenericResponsiveDrawer
          onClose={this.props.onClose}
          open={this.props.open}
          title={t('forms.user.create.title')}
        >
          <div className={classes.container}>
            <div className={classes.infoText}>
              <InfoIcon className={classes.icon} />
              <Typography variant="h6">
                {t('forms.user.create.generalInfo.title')}
              </Typography>
            </div>
            <div className={classes.firstRow}>
              <TextField
                fullWidth
                className={classes.field}
                id="textfield_role_firstname"
                inputProps={{ maxLength: FRANCHISE_STAFF_USER_NAME_MAX_LENGTH }}
                label={t('forms.user.create.generalInfo.firstName.label')}
                onChange={(ev) =>
                  this.setState({ first_name: ev.target.value })
                }
                value={this.state.first_name}
              />
              <TextField
                fullWidth
                className={classes.field}
                id="textfield_role_lastname"
                inputProps={{ maxLength: FRANCHISE_STAFF_USER_NAME_MAX_LENGTH }}
                label={t('forms.user.create.generalInfo.lastName.label')}
                onChange={(ev) => this.setState({ last_name: ev.target.value })}
                value={this.state.last_name}
              />
            </div>
            <TextField
              fullWidth
              required
              className={classes.field}
              error={missingFields.email}
              id="textfield_role_email"
              label={t('forms.user.create.generalInfo.email.label')}
              onChange={(ev) => this.setState({ email: ev.target.value })}
              type="email"
              value={this.state.email}
            />
            <div className={classes.field}>
              <PasswordInput
                fullWidth
                // @ts-expect-error
                required
                error={missingFields.password}
                onChange={(ev: any) =>
                  this.setState({ password: ev.target.value })
                }
                type="password"
                value={this.state.password}
              />
            </div>
            <TextField
              // @ts-expect-error
              castAsNumber
              fullWidth
              className={classes.field}
              id="textfield_franchise_role_commission"
              InputProps={{
                inputProps: { min: 0, max: 100, step: 1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <p>%</p>
                  </InputAdornment>
                ),
              }}
              label={t('forms.user.commissionHeader')}
              onChange={this.handleOnCommissionChange}
              type="number"
              value={`${this.state.staff_commission_percentage}`}
            />
            <Divider className={classes.divider} />
            <div className={classes.infoText}>
              <InfoIcon className={classes.icon} />
              <Typography variant="h6">
                {t('forms.user.create.role.title')}
              </Typography>
            </div>
            <div className={classes.field}>
              <MaterialUISelector
                error={missingFields.selectedRole}
                isLoading={this.props.franchiseeListLoading}
                menuPlacement="top"
                menuPosition="fixed"
                name="selectedRole"
                onChange={this.handleSelectRole}
                options={availableRoles}
                placeholder={t('forms.user.create.role.selectRole.label')}
                value={this.state.selectedRole}
              />
            </div>

            <Divider className={classes.divider} />
            <div className={classes.infoText}>
              <InfoIcon className={classes.icon} />
              <Typography variant="h6">
                {t('forms.user.create.franchisees.title')}
              </Typography>
            </div>
            <Alert className={classes.alertInfo} severity="info">
              {t('forms.user.create.franchisees.warning')}
            </Alert>
            <div className={classNames(classes.field, classes.expandForm)}>
              <MaterialUISelector
                isMulti
                isDisabled={
                  !!this.state.selectedRoleIsAdmin || !this.state.selectedRole
                }
                isLoading={this.props.franchiseeListLoading}
                menuPlacement="top"
                menuPosition="fixed"
                name="selectedFranchisees"
                onChange={(values: SelectFieldItem[]) =>
                  this.setState({ selectedFranchisees: values })
                }
                options={availableFranchisees}
                placeholder={
                  !!this.state.selectedRoleIsAdmin || !this.state.selectedRole
                    ? t('forms.user.selectFranchiseesDisabled')
                    : t('forms.user.selectFranchisees')
                }
                value={this.state.selectedFranchisees}
              />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.buttonsContainer}>
              <Actions>
                <Button color="secondary" onClick={this.props.onClose}>
                  {t('forms.user.create.cancel')}
                </Button>
                <Submit
                  color="primary"
                  id="button_role_save"
                  onClick={this.onSubmit}
                  type="submit"
                >
                  {t('forms.user.create.register')}
                </Submit>
              </Actions>
            </div>
          </div>
        </GenericResponsiveDrawer>
      </form>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    alertInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: theme.spacing(1),
    },
    infoText: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    icon: {
      color: '#868686',
    },
    firstRow: {
      display: 'flex',
      gap: theme.spacing(1),
    },
    field: {
      marginBottom: theme.spacing(1),
    },
    selectRole: {
      minWidth: 200,
    },
    expandForm: {
      paddingBottom: theme.spacing(40),
    },
    divider: {
      backgroundColor: theme.palette.divider,
      marginLeft: theme.spacing(-4),
      marginRight: theme.spacing(-4),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    buttonsContainer: {
      marginTop: 'auto',
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['role']),
  withStyles(styles),
)(FranchiseCreateStaffUser);
