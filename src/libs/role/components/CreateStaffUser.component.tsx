// @ts-nocheck
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
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';

// @ts-ignore
import PasswordInput from '../../../components/input/PasswordInput.component';
import { Role, UserRoleData, SelectFieldItem } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import COMMON_ROLES, { OWNER_ROLE } from '../role-types';
import { getRoleName } from '../utils';
import { Coach } from '#libs/associated-coach/types';

type OwnProps = {
  onSubmit: (
    data: UserRoleData & {
      first_name: string;
      last_name: string;
    },
  ) => void;
  open: boolean;
  roles: Role[];
  onClose: () => void;
  coachList: Array<Coach>;
  coachListLoading: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  email?: string | null;
  password?: string | null;
  role?: number | null;
  first_name: string;
  last_name: string;
  coaches: SelectFieldItem[];
  staff_commission_percentage: number;
};

export class CreateStaffUser extends React.Component<Props, State> {
  state: State = {
    email: null,
    password: null,
    role: null,
    last_name: '',
    first_name: '',
    coaches: [],
    staff_commission_percentage: 0.0,
  };

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
      coaches,
      staff_commission_percentage,
    } = this.state;
    if (!email || !password || !role) return;
    const coaches_in_role_ids =
      !Object.values(COMMON_ROLES).includes(role) && coaches
        ? coaches.map((coach: SelectFieldItem) => coach.value)
        : [];
    this.props.onSubmit({
      email: email?.toLowerCase() || '',
      password,
      role,
      last_name,
      first_name,
      coaches_in_role_ids,
      staff_commission_percentage,
    });
    this.setState({
      email: null,
      password: null,
      role: null,
      last_name: '',
      first_name: '',
      coaches: [],
      staff_commission_percentage: 0,
    });
  };

  render() {
    const { t, classes } = this.props;
    return (
      <form>
        <Dialog open={this.props.open}>
          <DialogTitle>{t('forms.user.create.title')}</DialogTitle>
          <DialogContent>
            <TextField
              id="textfield_role_firstname"
              fullWidth
              value={this.state.first_name}
              className={classes.field}
              onChange={(ev) => this.setState({ first_name: ev.target.value })}
              label={t('forms.user.create.generalInfo.firstName.label')}
            />
            <TextField
              id="textfield_role_lastname"
              fullWidth
              value={this.state.last_name}
              className={classes.field}
              onChange={(ev) => this.setState({ last_name: ev.target.value })}
              label={t('forms.user.create.generalInfo.lastName.label')}
            />
            <TextField
              id="textfield_role_email"
              fullWidth
              required
              type="email"
              value={this.state.email}
              className={classes.field}
              onChange={(ev) => this.setState({ email: ev.target.value })}
              label={t('forms.user.create.generalInfo.email.label')}
            />
            <div className={classes.field}>
              <PasswordInput
                fullWidth
                required
                type="password"
                value={this.state.password}
                onChange={(ev: any) =>
                  this.setState({ password: ev.target.value })
                }
              />
            </div>
            <TextField
              id="textfield_role_commission"
              fullWidth
              castAsNumber
              label={t('forms.user.commissionHeader')}
              className={classes.field}
              value={`${this.state.staff_commission_percentage}`}
              InputProps={{
                inputProps: { min: 0, max: 100, step: 1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <p>%</p>
                  </InputAdornment>
                ),
              }}
              type="number"
              onChange={this.handleOnCommissionChange}
            />
            <FormControl className={classes.field}>
              <InputLabel htmlFor="rol-help" shrink>
                {t('forms.user.create.role.selectRole.topLabel')}
              </InputLabel>
              <Select
                id="textfield_role_role"
                className={classes.selectRole}
                value={this.state.role}
                required
                onChange={(ev: any) => {
                  this.setState({ role: parseInt(ev.target.value, 10) });
                }}
                name="role"
              >
                {this.props.roles
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
                <div className={classes.field}>
                  <InputLabel htmlFor="rol-help" shrink>
                    {t('forms.user.selectCoach')}
                  </InputLabel>
                  <MaterialUISelector
                    placeholder={t('forms.user.selectCoach')}
                    isLoading={this.props.coachListLoading}
                    name="coaches"
                    menuPlacement="top"
                    menuPosition="fixed"
                    value={this.state.coaches}
                    onChange={(values: SelectFieldItem[]) =>
                      this.setState({ coaches: values })
                    }
                    options={[...this.props.coachList].map((coach: Coach) => ({
                      value: coach?.id,
                      label: coach?.name,
                    }))}
                    isMulti
                  />
                </div>
              )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              {t('forms.user.create.cancel')}
            </Button>
            <Button
              type="submit"
              onClick={this.onSubmit}
              color="primary"
              id="button_role_save"
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
});

export default compose<any, OwnProps>(
  withTranslation(['role']),
  withStyles(styles),
)(CreateStaffUser);
