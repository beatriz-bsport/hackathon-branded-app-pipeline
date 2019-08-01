// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';

import LoginBase from '../../components/navigation/LoginBase.component';
import api from '../../api';
import { snackbarSuccess } from '../../actions/snackbar.actions';

const styles = (theme) => ({
  formContainer: {
    margin: theme.spacing.unit * 2,
  },
});

type Props = {
  match: Object,
  pushToLogin: (successMessage: string) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  password1: ?string,
  password2: ?string,
  error: ?string,
  processing: boolean,
};

export class ChangePassword extends Component<Props, State> {
  state = {
    password1: null,
    password2: null,
    error: null,
    processing: false,
  };

  componentWillMount() {
    this.uid = this.props.match.params.uid;
    this.token = this.props.match.params.token;
  }

  handlePassword1Change = (event) => {
    this.setState({ password1: event.target.value });
  };

  handlePassword2Change = (event) => {
    this.setState({ password2: event.target.value });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ processing: true });
    const { t } = this.props;
    const { password1, password2 } = this.state;
    if (password1 !== password2) {
      this.setState({
        processing: false,
        error: t('form.login.passwordMismatch'),
      });
    } else {
      const { uid, token } = this;
      try {
        const response = await api.auth.changePassword({
          uid,
          token,
          password: password1,
        });
        if (response.status !== 200) {
          this.setState({
            processing: false,
            error: t('form.login.passwordTooEasy'),
          });
        } else {
          this.props.pushToLogin(t('form.login.passwordChangedSuccess'));
        }
      } catch (e) {
        this.setState({
          processing: false,
          error: t('form.login.passwordTooEasy'),
        });
      }
    }
  };

  render() {
    const { t, classes } = this.props;
    const { processing, password1, error, password2 } = this.state;
    return (
      <LoginBase>
        <form onSubmit={this.onSubmit} className={classes.formContainer}>
          <Grid container direction="column" spacing={16} alignItems="center">
            <Grid item>
              <Typography variant="h6">
                {t('form.login.changePasswordTitle')}
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                type="password"
                name="password"
                value={password1}
                required
                placeholder={t('form.login.password')}
                onChange={this.handlePassword1Change}
              />
            </Grid>
            <Grid item>
              <TextField
                type="password"
                name="passwordConfirm"
                value={password2}
                required
                placeholder={t('form.login.confirmPassword')}
                onChange={this.handlePassword2Change}
              />
            </Grid>
            {error ? (
              <Grid item>
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              </Grid>
            ) : null}
            <Grid item>
              {processing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  id="btn-new-password-confirm"
                >
                  OK
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </LoginBase>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pushToLogin(successMessage) {
      dispatch(snackbarSuccess(successMessage));
      dispatch(pushRouter('/login'));
    },
  };
}

export default withStyles(styles)(
  withNamespaces()(
    connect(
      null,
      mapDispatchToProps,
    )(ChangePassword),
  ),
);
