import React, { Component } from 'react';

import {
  CircularProgress,
  Typography,
  Grid,
  Button,
  Paper,
  withStyles,
} from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import FacebookLoginButton from '../button/FacebookLoginButton.component';
import FormField from '../FormField.component';
import { auth as authActions } from '../../actions';

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  bottomButton: {
    marginTop: theme.spacing.unit,
  },
});

type Props = {};

const EMAIL_LOGIN = 'email';
const PHONE_LOGIN = 'phone';
const FACEBOOK_LOGIN = 'facebook';

export class ConsumerLogin extends Component<Props> {
  state = {
    email: '',
    phone: '',
    password: '',
    loginMethod: null,
  };

  onFormFieldChange = (id) => (value, error) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => (
    <Grid container direction="column" alignItems="flex-start">
      <Grid item>
        <FormField id="email" onChange={this.onFormFieldChange} />
      </Grid>
      <Grid item>
        <FormField
          id="password"
          onChange={this.onFormFieldChange}
          type="password"
        />
      </Grid>
      <Grid item>
        <Button
          className={this.props.classes.bottomButton}
          color="primary"
          variant="raised"
          onClick={this.doEmailLogin}
        >
          LOGIN
        </Button>
      </Grid>
    </Grid>
  );

  getPhoneLogin = () => (
    <Grid container direction="row" alignItems="center" spacing={16}>
      <Button
        color="primary"
        variant="raised"
        onClick={() => this.setState({ loginMethod: PHONE_LOGIN })}
      >
        <CallIcon className={this.props.classes.buttonIcon} />
        SMS LOGIN
      </Button>
    </Grid>
  );

  getDivider = () => (
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
        <Typography variant="caption">{this.props.t('common.or')}</Typography>
      </Grid>
      <Grid item>
        <div style={{ width: 50, height: 1, backgroundColor: '#E1E1E1' }} />
      </Grid>
    </Grid>
  );

  doEmailLogin = () => {
    const { email, password } = this.state;
    this.props.emailLogin({ email, password });
  };

  render() {
    const { loginMethod } = this.state;
    const { loading } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    switch (loginMethod) {
      case EMAIL_LOGIN:
        return (
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="stretch"
            spacing={16}
          >
            <Grid item xs={9}>
              <FormField
                id="password"
                onChange={this.onFormFieldChange}
                type="password"
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                color="primary"
                variant="raised"
                onClick={this.doEmailLogin}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Grid container direction="column" alignItems="center" spacing={24}>
            <Grid item>{this.getPhoneLogin()}</Grid>
            <Grid item>{this.getDivider()}</Grid>
            <Grid item>
              <Grid
                container
                item
                direction="row"
                justify="center"
                alignItems="center"
              >
                <FacebookLoginButton />
              </Grid>
            </Grid>
            <Grid item>{this.getDivider()}</Grid>
            <Grid item>{this.getEmailLogin()}</Grid>
          </Grid>
        );
    }
  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    emailLogin({ email, password }) {
      dispatch(authActions.requestLogin(email, password));
    },
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(ConsumerLogin)),
);
