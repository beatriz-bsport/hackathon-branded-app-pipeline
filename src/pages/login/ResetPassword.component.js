// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { resetPassword } from '../../actions/auth.actions';
import LoginBase from '../../components/navigation/LoginBase.component';

type Props = {
  resetPassword: (email: string, options: any) => void,
  loading: boolean,
  classes: Object,
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
    this.props.resetPassword(this.state.email, {
      onSuccess: () => this.setState({ hasSent: true }),
    });
  };

  getSendingButton = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Link style={{ textDecoration: 'none' }} to="/login">
        <Button>ANNULER</Button>
      </Link>
      {this.props.loading ? (
        <CircularProgress />
      ) : (
        <Button
          type="submit"
          color="primary"
          variant="contained"
          id="btn-reset-password"
        >
          OK
        </Button>
      )}
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
    <div>
      <Typography>
        Un email a été envoyé à {this.state.email} pour récupérer votre mot de
        passe
      </Typography>
      <div style={{ paddingTop: 20 }}>
        <Button
          color="primary"
          onClick={this.redirectLogin}
          variant="contained"
        >
          OK
        </Button>
      </div>
    </div>
  );

  render() {
    const { classes } = this.props;
    const { hasSent, redirectLogin } = this.state;
    if (redirectLogin) {
      return <Redirect to="/" />;
    }
    return (
      <LoginBase>
        <form onSubmit={this.onSubmit} className={classes.container}>
          {hasSent ? (
            <div />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginTop: 20,
              }}
            >
              <Typography
                variant="h6"
                align="left"
                style={{ marginBottom: 20 }}
              >
                Récupération de mot de passe
              </Typography>
              <Typography align="left" className={this.props.classes.textBlock}>
                {"Quel était l'email du compte ?"}
              </Typography>
              <Typography align="left" className={this.props.classes.textBlock}>
                Nous vous enverrons des instructions de récupération
              </Typography>
              <TextField
                type="email"
                className={this.props.classes.textBlock}
                onChange={this.updateEmail}
                name="email"
                fullWidth
                label="Email"
              />
            </div>
          )}
          {this.props.resetError ? (
            <Typography color="error" align="left" variant="caption">
              Cet email n'est pas enregistré
            </Typography>
          ) : null}
          <div style={{ paddingTop: 16 }}>
            {!hasSent ? this.getSendingButton() : this.getSuccessMsg()}
          </div>
        </form>
      </LoginBase>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 4,
  },
  textBlock: { marginBottom: theme.spacing.unit },
});

export default connect(
  (state) => ({
    resetError: state.auth.resetPassword.error,
    loading: state.auth.resetPassword.loading,
  }),
  { resetPassword },
)(withStyles(styles)(ResetPassword));
