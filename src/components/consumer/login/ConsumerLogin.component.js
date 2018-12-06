// @flow

import React, { Component } from 'react';

import {
  CircularProgress,
  Typography,
  Grid,
  Button,
  withStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import RedButton from '../../button/RedButton.component';

import { FormField } from '../../input';

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
  },
  title: {
    margin: theme.spacing.unit * 2,
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

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <PersonIcon className={this.props.classes.headIcon} />
      </Grid>
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
        <div style={{ paddingTop: 12 }}>
          <Typography color="error">
            {this.props.error ? this.props.t('login.authError') : ''}
          </Typography>
          <div />
          <Link to="/login/reset_password" style={{ textDecoration: 'none' }}>
            <Typography color="secondary" variant="caption">
              {this.props.t('login.forgottenPassword')}
            </Typography>
          </Link>
        </div>
      </Grid>
      <Grid item>
        <Button
          className={this.props.classes.bottomButton}
          color="primary"
          variant="contained"
          onClick={this.doEmailLogin}
        >
          LOGIN
        </Button>
      </Grid>
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
    <RedButton variant="contained" onClick={this.props.requestSignUp}>
      {this.props.t('login.signUpConsumer')}
    </RedButton>
  );

  render() {
    const { loading, classes } = this.props;

    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Grid container direction="column" alignItems="center" spacing={24}>
        <Grid item>{this.getEmailLogin()}</Grid>
        <Grid item>{this.getDivider()}</Grid>
        <Grid item>{this.getSignUpButton()}</Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(translate()(ConsumerLogin));
