// @flow

import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';

import RedButton from '../../button/RedButton.component';
import PasswordInput from '../../input/PasswordInput.component';

import { FormField } from '../../input';
import { openIntercomHelp } from '../../../intercom.js';

const styles = (theme) => ({
  headIcon: {
    height: 90,
    width: 90,
    marginBottom: theme.spacing.unit * 2,
  },
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  bottomButton: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  errorMessage: {
    marginTop: theme.spacing.unit,
  },
  title: {
    margin: theme.spacing.unit * 2,
  },
  loginContainer: {
    textAlign: 'center',
    maxWidth: 300,
  },
});

type Props = {
  doEmailLogin: ({ email: string, password: string }) => void,
  requestSignUp: () => void,
  loading: boolean,
  classes: Object,
  error: ?boolean,
  t: (x: string) => string,
};

type State = {
  email: string,
  password: string,
};

type DividerProps = {
  t: TFunction,
};
function Divider(props: DividerProps) {
  const { t } = props;
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      direction="row"
      spacing={16}
      style={{ paddingLeft: 10, paddingRight: 10 }}
    >
      <Grid item>
        <div style={{ width: 50, height: 1, backgroundColor: '#E1E1E1' }} />
      </Grid>
      <Grid item style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Typography variant="caption">{t('common.or')}</Typography>
      </Grid>
      <Grid item>
        <div style={{ width: 50, height: 1, backgroundColor: '#E1E1E1' }} />
      </Grid>
    </Grid>
  );
}

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => {
    const { classes, error, t } = this.props;
    return (
      <div className={classes.loginContainer}>
        <PersonIcon className={classes.headIcon} />
        <form>
          <FormField
            id="email"
            name="login"
            onChange={this.onFormFieldChange}
            fullWidth
          />
          <PasswordInput
            fullWidth
            value={this.state.password}
            onChange={(ev) =>
              this.onFormFieldChange('password')(ev.target.value)
            }
          />
          {error ? (
            <Typography color="error" className={classes.errorMessage}>
              {t('login.authError')}{' '}
            </Typography>
          ) : null}
          <Button
            className={classes.bottomButton}
            color="primary"
            variant="contained"
            onClick={this.doEmailLogin}
            type="submit"
            id="btn-signin"
          >
            LOGIN
          </Button>
        </form>
        <Link to="/login/reset_password" style={{ textDecoration: 'none' }}>
          <Typography color="secondary" variant="caption">
            {t('login.forgottenPassword')}
          </Typography>
        </Link>
      </div>
    );
  };

  doEmailLogin = () => {
    const { email, password } = this.state;
    this.props.doEmailLogin({ email, password });
  };

  render() {
    const { loading, t } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    const { requestSignUp } = this.props;
    return (
      <Grid container direction="column" alignItems="center" spacing={16}>
        <Grid item>{this.getEmailLogin()}</Grid>
        <Grid item>
          <Divider t={t} />
        </Grid>
        <Grid item>
          <RedButton
            id="btn-goto-signup"
            variant="contained"
            onClick={requestSignUp}
          >
            {t('login.signUpConsumer')}
          </RedButton>
        </Grid>
        <IconButton
          style={{ position: 'absolute', top: 12, right: 12 }}
          onClick={openIntercomHelp}
        >
          <HelpIcon />
        </IconButton>
      </Grid>
    );
  }
}
export default withStyles(styles)(withNamespaces([])(ConsumerLogin));
