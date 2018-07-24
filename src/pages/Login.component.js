import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { auth as authActions } from '../actions';
import { LoginBase } from '../components';

const styles = (theme) => ({
  loading: {
    margin: theme.spacing.unit * 2,
  },
});

export class Login extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  updateEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  updatePassword = (event) => {
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

  onSubmit = (event) => {
    event.preventDefault();
    this.login();
  };

  render() {
    const { t, classes } = this.props;

    if (this.props.authenticated) {
      return <Redirect push to="/" />;
    }
    return (
      <LoginBase>
        <form onSubmit={this.onSubmit}>
          <div>
            <TextField type="email" onChange={this.updateEmail} label="Email" />
          </div>
          <div>
            <TextField
              onChange={this.updatePassword}
              label={t('login.password')}
              type="password"
            />
            <div style={{ paddingTop: 12 }}>
              <Link to="/reset_password" style={{ textDecoration: 'none' }}>
                <Typography color="secondary" variant="caption">
                  {t('login.forgottenPassword')}
                </Typography>
              </Link>
              {this.props.error ? (
                <Typography color="error">{t('login.authError')}</Typography>
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
              <Button type="submit" color="primary" variant="raised">
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
      </LoginBase>
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
export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(withStyles(styles)(Login)),
);
