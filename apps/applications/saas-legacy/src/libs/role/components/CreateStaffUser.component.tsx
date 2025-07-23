import React from 'react';
import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';

import { WithTranslation, withTranslation } from 'react-i18next';

import { Coach } from '#src/libs/associated-coach/types';
import PasswordInput from '../../../components/input/PasswordInput.component';
import { Role, UserRoleData, SelectFieldItem } from '../types';
import { MaterialStyleType } from '../../../utils/types';
// @ts-expect-error
import COMMON_ROLES, { OWNER_ROLE } from '../role-types';
import { getRoleName } from '../utils';
import { useAdvancedRoleSettings } from '../hooks/advancedRoleSettings';
import AdvancedRoleSettingsForm from './AdvancedRoleSettingsForm.component';
import { EstablishmentBillingGroup } from '#src/libs/establishment/types';

type OwnProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  coachList: Array<Coach>;
  coachListLoading: boolean;
  establishmentGroupListLoading: boolean;
  establishmentListLoading: boolean;
  hasAccessMonitoringUpsell: boolean;
  hasMultiLocationUpsell: boolean;
  onClose: () => void;
  onSubmit: (
    data: UserRoleData & { first_name: string; last_name: string },
  ) => void;
  open: boolean;
  roles: Role[];
  establishmentBillingGroups: EstablishmentBillingGroup[];
};

type Props = OwnProps &
  ReturnType<typeof useAdvancedRoleSettings> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  coaches: SelectFieldItem[];
  email?: string | null;
  first_name: string;
  last_name: string;
  password?: string | null;
  role?: number | null;
  staff_commission_percentage: number;
};

// @ts-expect-error
function withUserRoleAdvancedSettings(Component) {
  return function EnhancedComponent({
    coachList,
    establishmentGroupList,
    establishmentList,
    hasMultiLocationUpsell,
    onConfirm,
    updateUserRole,
    userRole,
    ...props
  }: Parameters<typeof useAdvancedRoleSettings>[0]) {
    const {
      coachOptions,
      establishmentOptions,
      handleResetAdvancedSettings,
      handleSelectCoaches,
      handleSelectEstablishments,
      handleSelectSite,
      handleSubmit,
      selectedCoaches,
      selectedEstablishments,
      selectedSite,
      siteOptions,
    } = useAdvancedRoleSettings({
      coachList,
      establishmentGroupList,
      establishmentList,
      hasMultiLocationUpsell,
      onConfirm,
      updateUserRole,
      userRole,
    });
    return (
      <Component
        {...props}
        coachOptions={coachOptions}
        establishmentOptions={establishmentOptions}
        handleResetAdvancedSettings={handleResetAdvancedSettings}
        handleSelectCoaches={handleSelectCoaches}
        handleSelectEstablishments={handleSelectEstablishments}
        handleSelectSite={handleSelectSite}
        handleSubmit={handleSubmit}
        hasMultiLocationUpsell={hasMultiLocationUpsell}
        selectedCoaches={selectedCoaches}
        selectedEstablishments={selectedEstablishments}
        selectedSite={selectedSite}
        siteOptions={siteOptions}
      />
    );
  };
}

export class CreateStaffUser extends React.Component<Props, State> {
  // @ts-expect-error
  state: State = {
    email: null,
    password: null,
    role: null,
    last_name: '',
    first_name: '',
    staff_commission_percentage: 0.0,
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

  onSubmit = (ev: any) => {
    ev.preventDefault();
    const {
      email,
      password,
      role,
      last_name,
      first_name,
      staff_commission_percentage,
    } = this.state;
    const {
      selectedEstablishments,
      selectedCoaches,
      onSubmit,
      handleResetAdvancedSettings,
    } = this.props;
    if (!email || !password || !role) return;

    onSubmit({
      email: email?.toLowerCase() || '',
      password,
      role,
      last_name,
      first_name,
      coaches_in_role_ids: selectedCoaches.map((c) => c.value),
      establishments_in_role_ids: selectedEstablishments.map((e) => e.value),
      // @ts-expect-error
      staff_commission_percentage,
    });
    handleResetAdvancedSettings?.();
    this.setState({
      email: null,
      password: null,
      role: null,
      last_name: '',
      first_name: '',
      staff_commission_percentage: 0,
    });
  };

  render() {
    const {
      classes,
      coachListLoading,
      coachOptions,
      establishmentGroupListLoading,
      establishmentListLoading,
      establishmentOptions,
      handleSelectCoaches,
      handleSelectEstablishments,
      handleSelectSite,
      hasMultiLocationUpsell,
      selectedCoaches,
      selectedEstablishments,
      selectedSite,
      siteOptions,
      roles,
      hasAccessMonitoringUpsell,
      open,
      onClose,
      t,
    } = this.props;
    return (
      <form>
        <Dialog open={open}>
          <DialogTitle>{t('forms.user.create.title')}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              className={classes.field}
              id="textfield_role_firstname"
              label={t('forms.user.create.generalInfo.firstName.label')}
              onChange={(ev) => this.setState({ first_name: ev.target.value })}
              value={this.state.first_name}
            />
            <TextField
              fullWidth
              className={classes.field}
              id="textfield_role_lastname"
              label={t('forms.user.create.generalInfo.lastName.label')}
              onChange={(ev) => this.setState({ last_name: ev.target.value })}
              value={this.state.last_name}
            />
            <TextField
              fullWidth
              required
              className={classes.field}
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
              id="textfield_role_commission"
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
            <FormControl className={classes.field}>
              <InputLabel shrink htmlFor="rol-help">
                {t('forms.user.create.role.selectRole.topLabel')}
              </InputLabel>
              <Select
                required
                className={classes.selectRole}
                id="textfield_role_role"
                name="role"
                onChange={(ev: any) => {
                  this.setState({ role: parseInt(ev.target.value, 10) });
                }}
                value={this.state.role}
              >
                {roles
                  .filter((role) => role.id !== OWNER_ROLE)
                  .map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {getRoleName(role, t)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {!Object.values(COMMON_ROLES).includes(this.state.role) &&
              !!this.state.role && (
                <div className={classes.advancedRoleSettingsContainer}>
                  <AdvancedRoleSettingsForm
                    withTitle
                    coachListLoading={coachListLoading}
                    coachOptions={coachOptions}
                    customRole={roles?.find((r) => r.id === this.state.role)}
                    establishmentGroupListLoading={
                      establishmentGroupListLoading
                    }
                    establishmentListLoading={establishmentListLoading}
                    establishmentOptions={establishmentOptions}
                    handleSelectCoaches={handleSelectCoaches}
                    handleSelectEstablishments={handleSelectEstablishments}
                    handleSelectSite={handleSelectSite}
                    hasAccessMonitoringUpsell={hasAccessMonitoringUpsell}
                    hasMultiLocationUpsell={hasMultiLocationUpsell}
                    selectedCoaches={selectedCoaches}
                    selectedEstablishments={selectedEstablishments}
                    selectedSite={selectedSite}
                    sitesOptions={siteOptions}
                  />
                </div>
              )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              {t('forms.user.create.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={
                hasAccessMonitoringUpsell &&
                roles?.find((r) => r.id === this.state.role)?.permissions
                  ?.navigationMenu?.accessMonitoring?.perform &&
                !selectedEstablishments.length
              }
              id="button_role_save"
              onClick={this.onSubmit}
              type="submit"
            >
              {t('forms.user.create.submit')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    );
  }
}

const styles = (theme: Theme) => ({
  field: {
    marginBottom: theme.spacing(1),
  },
  selectRole: {
    minWidth: 200,
  },
  advancedRoleSettingsContainer: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withUserRoleAdvancedSettings,
  withTranslation(['role']),
  withStyles(styles),
)(CreateStaffUser);
