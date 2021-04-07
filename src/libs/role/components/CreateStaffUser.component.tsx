import React from 'react';
import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';

import { WithTranslation, withTranslation } from 'react-i18next';

// @ts-ignore
import PasswordInput from '../../../components/input/PasswordInput.component';
import { Role, UserRoleData } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { OWNER_ROLE } from '../role-types';
import { getRoleName } from '../utils';

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
};

export class CreateStaffUser extends React.Component<Props, State> {
  state: State = {
    email: null,
    password: null,
    role: null,
    last_name: '',
    first_name: '',
  };

  onSubmit = (ev: any) => {
    ev.preventDefault();
    const { email, password, role, last_name, first_name } = this.state;
    if (!email || !password || !role) return;
    this.props.onSubmit({ email, password, role, last_name, first_name });
    this.setState({
      email: null,
      password: null,
      role: null,
      last_name: '',
      first_name: '',
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
              label={t('forms.user.create.firstName.label')}
            />
            <TextField
              id="textfield_role_lastname"
              fullWidth
              value={this.state.last_name}
              className={classes.field}
              onChange={(ev) => this.setState({ last_name: ev.target.value })}
              label={t('forms.user.create.lastName.label')}
            />
            <TextField
              id="textfield_role_email"
              fullWidth
              required
              type="email"
              value={this.state.email}
              className={classes.field}
              onChange={(ev) => this.setState({ email: ev.target.value })}
              label={t('forms.user.create.email.label')}
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
            <FormControl className={classes.field}>
              <InputLabel htmlFor="rol-help" shrink>
                {t('forms.user.create.role.label')}
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
