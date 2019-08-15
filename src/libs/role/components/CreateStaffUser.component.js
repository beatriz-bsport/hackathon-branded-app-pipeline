// @flow
import React from 'react';

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

import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PasswordInput from '../../../components/input/PasswordInput.component';
import type { Permission, UserRoleData } from '../types';

type Props = {
  t: TFunction,
  onSubmit: (UserRoleData) => void,
  classes: Object,
  open: boolean,
  permissions: Array<Permission>,
    onClose: () => void,
};

type State = {
  email: ?string,
  password: ?string,
  role: ?number,
};

export class CreateStaffUser extends React.Component<Props, State> {
  state = {
    email: null,
    password: null,
    role: null,
  };

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    const { email, password, role } = this.state;
    if (!email || !password || !role) return;
    this.props.onSubmit({ email, password, role });
    this.setState({ email: null, password: null, role: null });
  };

  render() {
    const { t, classes } = this.props;
    return (
      <form>
        <Dialog open={this.props.open}>
          <DialogTitle>{t('forms.user.create.title')}</DialogTitle>
          <DialogContent>
            <TextField
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
                onChange={(ev) =>
                  this.setState({ password: ev.target.value })
                }
              />
            </div>
            <FormControl className={classes.field}>
              <InputLabel htmlFor="rol-help" shrink>
                {t('forms.user.create.role.label')}
              </InputLabel>
              <Select
                className={classes.selectRole}
                value={this.state.role}
                required
                onChange={(ev) => {
                  this.setState({ role: parseInt(ev.target.value, 10) });
                }}
                name="role"
              >
                {this.props.permissions
                  .filter((perm) => perm.id !== 0)
                  .map((perm) => (
                    <MenuItem key={perm.id} value={perm.id}>
                      {perm.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              {t('forms.user.create.cancel')}
            </Button>
            <Button type="submit" onClick={this.onSubmit} color="primary">
              {t('forms.user.create.submit')}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    );
  }
}

const styles = (theme) => ({
  field: {
    marginBottom: theme.spacing.unit,
  },
  selectRole: {
    minWidth: 200,
  },
});

export default compose(
  withNamespaces(['role']),
  withStyles(styles),
)(CreateStaffUser);
