import React from 'react';
import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, Theme } from '@material-ui/core/styles';

import { WithTranslation, withTranslation } from 'react-i18next';
import { Divider, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Actions, Submit } from '#components/forms';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

// @ts-ignore
import PasswordInput from '#components/input/PasswordInput.component';
import {
  FranchiseUserRoleData,
  SelectFieldItem,
  FranchiseRole,
} from '#libs/role/types';
import { MaterialStyleType } from '../../../utils/types';
import { OWNER_ROLE, ADMIN_ROLE } from '#libs/role/role-types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Company } from '#libs/company/types';
import InfoBox from '#components/box/InfoBox.component';

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
      email,
      password,
      franchise_role: selectedRole.value,
      last_name,
      first_name,
      franchisees_in_role_ids,
    });
    this.setState({
      email: null,
      password: null,
      selectedRole: null,
      last_name: '',
      first_name: '',
      selectedFranchisees: [],
    });
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
          open={this.props.open}
          title={t('forms.user.create.title')}
          onClose={this.props.onClose}
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
                id="textfield_role_firstname"
                fullWidth
                value={this.state.first_name}
                className={classes.field}
                onChange={(ev) =>
                  this.setState({ first_name: ev.target.value })
                }
                label={t('forms.user.create.generalInfo.firstName.label')}
                inputProps={{ maxLength: FRANCHISE_STAFF_USER_NAME_MAX_LENGTH }}
              />
              <TextField
                id="textfield_role_lastname"
                fullWidth
                value={this.state.last_name}
                className={classes.field}
                onChange={(ev) => this.setState({ last_name: ev.target.value })}
                label={t('forms.user.create.generalInfo.lastName.label')}
                inputProps={{ maxLength: FRANCHISE_STAFF_USER_NAME_MAX_LENGTH }}
              />
            </div>
            <TextField
              id="textfield_role_email"
              fullWidth
              required
              error={missingFields.email}
              type="email"
              value={this.state.email}
              className={classes.field}
              onChange={(ev) => this.setState({ email: ev.target.value })}
              label={t('forms.user.create.generalInfo.email.label')}
            />
            <div className={classes.field}>
              <PasswordInput
                fullWidth
                error={missingFields.password}
                required
                type="password"
                value={this.state.password}
                onChange={(ev: any) =>
                  this.setState({ password: ev.target.value })
                }
              />
            </div>
            <Divider className={classes.divider} />
            <div className={classes.infoText}>
              <InfoIcon className={classes.icon} />
              <Typography variant="h6">
                {t('forms.user.create.role.title')}
              </Typography>
            </div>
            <div className={classes.field}>
              <MaterialUISelector
                placeholder={t('forms.user.create.role.selectRole.label')}
                isLoading={this.props.franchiseeListLoading}
                name="selectedRole"
                menuPlacement="top"
                menuPosition="fixed"
                value={this.state.selectedRole}
                onChange={this.handleSelectRole}
                options={availableRoles}
                error={missingFields.selectedRole}
              />
            </div>

            {!this.state.selectedRoleIsAdmin && !!this.state.selectedRole && (
              <>
                <Divider className={classes.divider} />
                <div className={classes.infoText}>
                  <InfoIcon className={classes.icon} />
                  <Typography variant="h6">
                    {t('forms.user.create.franchisees.title')}
                  </Typography>
                </div>
                <InfoBox
                  content={t('forms.user.create.franchisees.warning')}
                  className={classes.infoBox}
                />
                <div className={classNames(classes.field, classes.expandForm)}>
                  <MaterialUISelector
                    placeholder={t('forms.user.selectFranchisees')}
                    isLoading={this.props.franchiseeListLoading}
                    name="selectedFranchisees"
                    menuPlacement="top"
                    menuPosition="fixed"
                    value={this.state.selectedFranchisees}
                    onChange={(values: SelectFieldItem[]) =>
                      this.setState({ selectedFranchisees: values })
                    }
                    options={availableFranchisees}
                    isMulti
                  />
                </div>
              </>
            )}
            <Divider className={classes.divider} />
            <div className={classes.buttonsContainer}>
              <Actions>
                <Button onClick={this.props.onClose} color="secondary">
                  {t('forms.user.create.cancel')}
                </Button>
                <Submit
                  type="submit"
                  onClick={this.onSubmit}
                  color="primary"
                  id="button_role_save"
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
    infoBox: {
      marginBottom: theme.spacing(2),
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
