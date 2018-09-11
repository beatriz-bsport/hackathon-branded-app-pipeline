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
} from '@material-ui/core';

import { auth as authActions } from '../actions';
import { LoginBase } from '../components';

type Props = {
  resetPassword: (string) => void,
  loading: boolean,
};

type State = {
  email: string,
  hasSent: boolean,
  redirectLogin: boolean,
};

export class ResetPassword extends Component<Props, State> {
  state = {
    email: '',
    hasSent: false,
    redirectLogin: false,
  };

  updateEmail = (event: Object) => {
    this.setState({
      email: event.target.value,
    });
  };

  onSubmit = (event: Object) => {
    event.preventDefault();
    if (!this.state.email) {
      return;
    }
    this.resetPassword();
  };

  resetPassword = () => {
    this.props.resetPassword(this.state.email);
    this.setState({ hasSent: true });
  };

  getSendingButton = () => (
    <div>
      <Link style={{ textDecoration: 'none' }} to="/login">
        <Button>ANNULER</Button>
      </Link>
      <Button type="submit" color="primary" variant="raised">
        OK
      </Button>
      {this.props.loading ? <CircularProgress /> : <div />}
    </div>
  );

  resetComponent = () => {
    this.setState({ hasSent: false });
  };

  redirectLogin = () => {
    this.setState({
      redirectLogin: true,
    });
  };

  getSuccessMsg = () => (
    <Grid direction="column" container>
      <Typography>
        Un email a été envoyé à {this.state.email} pour récupérer votre mot de
        passe
      </Typography>
      <Grid direction="row" style={{ paddingTop: 20 }} container>
        <Button onClick={this.resetComponent}>Renvoyer</Button>
        <Button color="primary" onClick={this.redirectLogin} variant="raised">
          OK
        </Button>
      </Grid>
    </Grid>
  );

  render() {
    const { hasSent, redirectLogin } = this.state;
    if (redirectLogin) {
      return <Redirect to="/" />;
    }
    return (
      <LoginBase>
        <form onSubmit={this.onSubmit}>
          {hasSent ? (
            <div />
          ) : (
            <Grid style={{ marginTop: 20 }}>
              <Typography variant="title" style={{ marginBottom: 20 }}>
                Récupération de mot de passe
              </Typography>
              <Typography>Quel était l email du compte ?</Typography>
              <Typography>
                Nous vous enverrons des instructions de récupération
              </Typography>
              <TextField
                type="email"
                style={{ alignSelf: 'center' }}
                onChange={this.updateEmail}
                label="Email"
              />
            </Grid>
          )}
          <div style={{ paddingTop: 16 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              {!hasSent ? this.getSendingButton() : this.getSuccessMsg()}
            </Grid>
          </div>
        </form>
      </LoginBase>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword(email) {
      dispatch(authActions.resetPassword(email));
    },
  };
}
export default connect(
  null,
  mapDispatchToProps,
)(ResetPassword);
