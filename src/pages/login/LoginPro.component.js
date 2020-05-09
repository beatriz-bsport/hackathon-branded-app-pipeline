// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Redirect, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { auth as authActions } from '../../actions';
import LoginBase from '../../components/navigation/LoginBase.component';
import PasswordInput from '../../components/input/PasswordInput.component';

const styles = (theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  input: { marginBottom: theme.spacing(1) },
  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  loading: {
    margin: theme.spacing(2),
  },
  paddedContent: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
});

type Props = {
  login: ({ email: string, password: string }) => void,
  authenticated: boolean,
  loading: boolean,
  error: boolean,
  errorFields: ?{
    email: ?string,
    password: ?string,
  },

  t: TFunction,
  classes: Object,
};
type State = {
  email: string,
  password: string,
};

export class Login extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  componentWillMount() {
    document.title = 'Login - bsport';
  }

  updateEmail = (event: SyntheticEvent<HTMLElement>) => {
    this.setState({
      email: event.target.value,
    });
  };

  updatePassword = (event: StyntheticEvent<HTMLElement>) => {
    this.setState({
      password: event.target.value,
    });
  };

  login = () => {
    const { email, password } = this.state;
    this.props.login({
      email,
      password,
    });
  };

  onSubmit = (event: SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    this.login();
  };

  render() {
    const { t, classes, errorFields } = this.props;

    if (this.props.authenticated) {
      return <Redirect push to="/" />;
    }

    const { loading, error } = this.props;
    let errorMessage = t('login.authError');
    if (errorFields && errorFields.password) {
      errorMessage = t('login.error.invalidPassword');
    }
    if (errorFields && errorFields.email) {
      errorMessage = t('login.error.invalidEmail');
    }

    return (
      <LoginBase loading={loading}>
        <form onSubmit={this.onSubmit} className={classes.container}>
          <TextField
            type="email"
            fullWidth
            onChange={this.updateEmail}
            label="Email"
            className={classes.input}
          />
          <PasswordInput
            fullWidth
            value={this.state.password}
            onChange={this.updatePassword}
          />
          {!!error && (
            <div style={{ paddingTop: 12 }}>
              <Typography color="error">
                {error ? errorMessage : <br />}
              </Typography>
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            variant="contained"
            className={classes.button}
          >
            {t('button.login')}
          </Button>
          <Link to="/login/reset_password" style={{ textDecoration: 'none' }}>
            <Typography color="secondary" variant="caption">
              {t('login.forgottenPassword')}
            </Typography>
          </Link>
        </form>
      </LoginBase>
    );
  }
}

export default compose(
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
      error: state.auth.error,
      loading: state.auth.loading,
      errorFields: state.auth.invalidFields,
    }),
    {
      login: ({ email, password }) => authActions.requestLogin(email, password),
    },
  ),
  withNamespaces(),
  withStyles(styles),
)(Login);
