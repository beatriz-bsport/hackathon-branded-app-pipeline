// @flow

import React, { Component } from 'react';

import {
  CircularProgress,
  Typography,
  Grid,
  Button,
  withStyles,
} from '@material-ui/core';
import CallIcon from '@material-ui/icons/Call';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import RedButton from '../button/RedButton.component';

import { FormField } from '../input';

import ConsumerSMSLoginForm from '../form/ConsumerSMSLoginForm.component';

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  bottomButton: {
    marginTop: theme.spacing.unit,
  },
});

type Props = {
  doEmailLogin: ({ email: string, password: string }) => void,
  loading: boolean,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  loginMethod: ?number,
  email: string,
  password: string,
};

const EMAIL_LOGIN = 0;
const PHONE_LOGIN = 1;

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
    loginMethod: null,
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => (
    <Grid container direction="column" alignItems="center">
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
    this.props.doEmailLogin({ email, password });
  };

  getSignUpButton = () => (
    <Link style={{ textDecoration: 'none' }} to="/login/signup">
      <RedButton variant="raised">
        {this.props.t('login.signUpConsumer')}
      </RedButton>
    </Link>
  );

  render() {
    const { loginMethod } = this.state;
    const { loading } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    switch (loginMethod) {
      case PHONE_LOGIN:
        return <ConsumerSMSLoginForm />;
      case EMAIL_LOGIN:
      default:
        return (
          <Grid container direction="column" alignItems="center" spacing={24}>
            <Grid item>{this.getSignUpButton()}</Grid>
            <Grid item>{this.getDivider()}</Grid>
            <Grid item>{this.getEmailLogin()}</Grid>
            <Grid item>{this.getDivider()}</Grid>
            <Grid item>{this.getPhoneLogin()}</Grid>
          </Grid>
        );
    }
  }
}
export default withStyles(styles)(translate()(ConsumerLogin));
