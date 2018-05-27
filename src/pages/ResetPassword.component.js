import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { LoginBase } from '../components';
import {
  CircularProgress,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
} from '@material-ui/core';

import { auth as authActions } from '../actions';

export class ResetPassword extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      hasSent: false,
      redirectLogin: false,
    };
  }

  updateEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  onSubmit = (event) => {
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

  getSendingButton = () => {
    return (
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
  };

  resetComponent = () => {
    this.setState({ hasSent: false });
  };

  redirectLogin = () => {
    this.setState({
      redirectLogin: true,
    });
  };

  getSuccessMsg = () => {
    return (
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
  };

  render() {
    const { hasSent, redirectLogin } = this.state;
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
              <Typography>
                Quel était l'email du compte ?<br />Nous vous enverrons des
                instructions de récupération
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
export default connect(null, mapDispatchToProps)(ResetPassword);
