// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { compose } from 'recompose';
import { Redirect, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/HelpOutlined';

import { withTranslation, TFunction } from 'react-i18next';

import { resetPassword } from '../../actions/auth.actions';

type Props = {
  resetPassword: (email: string, options: any) => void,
  loading: boolean,
  classes: Object,
  resetError: ?Error,
  t: TFunction,
  last_password_reset_request: string,
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
        justifyContent: 'flex-end',
      }}
    >
      <Link style={{ textDecoration: 'none' }} to="/login">
        <Button>{this.props.t('resetPassword.actions.cancel')}</Button>
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
          {this.props.t('resetPassword.actions.reset')}
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
        {this.props.t('resetPassword.emailHasBeenSent', {
          email: this.state.email,
        })}
      </Typography>
      {this.props.last_password_reset_request &&
        moment(this.props.last_password_reset_request).isAfter(
          moment().add(-4, 'hours'),
        ) && (
          <div className={this.props.classes.helpReset}>
            <WarningIcon
              fontSize="large"
              color="secondary"
              className={this.props.classes.helpIcon}
            />
            <div>
              <Typography color="error">
                {this.props.t('resetPassword.hasProblem')}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography style={{ marginRight: 12 }}>
                  {this.props.t('resetPassword.contactUs')}
                </Typography>
                <a href="mailto:support+reset-password@bsport.io">
                  support+reset-password@bsport.io
                </a>
              </div>
            </div>
          </div>
        )}
      <div style={{ paddingTop: 20 }}>
        <Button
          color="primary"
          onClick={this.redirectLogin}
          variant="contained"
        >
          {this.props.t('resetPassword.actions.backToLogin')}
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
      <form onSubmit={this.onSubmit} className={classes.container}>
        {hasSent ? (
          <div />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" align="left" style={{ marginBottom: 20 }}>
              {this.props.t('resetPassword.title')}
            </Typography>
            <Typography align="left" className={this.props.classes.textBlock}>
              {this.props.t('resetPassword.explain1')}
            </Typography>
            <Typography align="left" className={this.props.classes.textBlock}>
              {this.props.t('resetPassword.explain2')}
            </Typography>
            <TextField
              type="email"
              className={this.props.classes.textBlock}
              onChange={this.updateEmail}
              variant="outlined"
              name="email"
              fullWidth
              label="Email"
            />
          </div>
        )}
        {this.props.resetError ? (
          <Typography color="error" align="left" variant="caption">
            {this.props.t('resetPassword.noEmail')}
          </Typography>
        ) : null}
        <div style={{ paddingTop: 16 }}>
          {!hasSent ? this.getSendingButton() : this.getSuccessMsg()}
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  textBlock: { marginBottom: theme.spacing(1) },
  container: {
    textAlign: 'center',
    padding: theme.spacing(6),
    width: '100%',
    maxWidth: 600,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  helpReset: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  helpIcon: {
    height: 90,
    width: 90,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
});

export default compose(
  withTranslation(['authentication']),
  connect(
    (state) => ({
      resetError: state.auth.resetPassword.error,
      loading: state.auth.resetPassword.loading,
      last_password_reset_request:
        state.auth.resetPassword.last_password_reset_request,
    }),
    { resetPassword },
  ),
  withStyles(styles),
)(ResetPassword);
