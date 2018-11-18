// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Button,
  Grid,
  TextField,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { auth as authActions } from '../../actions';
import { LoginBase } from '../../components';

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 2,
  },
  loading: {
    margin: theme.spacing.unit * 2,
  },
  paddedContent: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
});

type Props = {
  login: ({ email: string, password: string }) => void,
  authenticated: boolean,
  loading: boolean,
  error: boolean,
  t: (x: string) => string,
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

  updateEmail = (event: Object) => {
    this.setState({
      email: event.target.value,
    });
  };

  updatePassword = (event: Object) => {
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

  onSubmit = (event: Object) => {
    event.preventDefault();
    this.login();
  };

  render() {
    const { t, classes } = this.props;

    if (this.props.authenticated) {
      return <Redirect push to="/" />;
    }
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <LoginBase>
            <Grid
              container
              alignItems="stretch"
              direction="column"
              spacing={16}
              className={classes.container}
            >
              <Grid item className={classes.paddedContent}>
                <form onSubmit={this.onSubmit}>
                  <div>
                    <TextField
                      type="email"
                      onChange={this.updateEmail}
                      label="Email"
                    />
                  </div>
                  <div>
                    <TextField
                      onChange={this.updatePassword}
                      label={t('login.password')}
                      type="password"
                    />
                    <div style={{ paddingTop: 12 }}>
                      <Link
                        to="/login/reset_password"
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography color="secondary" variant="caption">
                          {t('login.forgottenPassword')}
                        </Typography>
                      </Link>
                      {this.props.error ? (
                        <Typography color="error">
                          {t('login.authError')}
                        </Typography>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                  <div style={{ paddingTop: 16 }}>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justify="center"
                    >
                      <Button type="submit" color="primary" variant="contained">
                        OK
                      </Button>
                      {this.props.loading ? (
                        <CircularProgress className={classes.loading} />
                      ) : (
                        <div />
                      )}
                    </Grid>
                  </div>
                </form>
              </Grid>
            </Grid>
          </LoginBase>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    error: state.auth.error,
    loading: state.auth.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login({ email, password }) {
      dispatch(authActions.requestLogin(email, password));
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(withStyles(styles)(Login)));
