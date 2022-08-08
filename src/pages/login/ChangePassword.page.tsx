import React, { Component } from 'react';
import { connect, ConnectedProps, Dispatch } from 'react-redux';
import { withStyles, WithStyles, Theme } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { withProps, compose } from 'recompose';
import { RootState } from '../../reducers';
import themeSelectors from '#libs/theme/selectors';
import { parseQueryString, buildUrlParams } from '../../http';

import LoginBase from '../../components/navigation/LoginBase.component';
import { changePassword as changePasswordAPI } from '../../libs/login/api';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { retrieveFranchise } from '../../libs/franchise/actions';
import { getFranchisor } from '../../libs/franchise/selectors';

const styles = (theme: Theme) => ({
  formContainer: {
    margin: theme.spacing(2),
  },
});

type OwnProps = {
  match: {
    params: {
      token: null | string;
      uid: string | null;
    };
  };
  classes: Object;
  membership: number | null;
};

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

type State = {
  password1: string | null;
  password2: string | null;
  error: string | null;
  processing: boolean;
  hasExpired: boolean;
};

export class ChangePassword extends Component<Props, State> {
  state: State = {
    password1: null,
    password2: null,
    error: null,
    processing: false,
    hasExpired: false,
  };

  uid: string | null;

  token: string | null;

  componentWillMount() {
    this.uid = this.props.match.params.uid;
    this.token = this.props.match.params.token;

    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership, {
        onSuccess: (theme) => {
          if (theme.franchisor) this.props.retrieveFranchise(theme.franchisor);
        },
      });
    }
    if (this.props.franchisor) {
      this.props.retrieveFranchise(this.props.franchisorId);
    }
  }

  handlePassword1Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ password1: event.target.value });
  };

  handlePassword2Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ password2: event.target.value });
  };

  onSubmit = async (event: React.FormEvent) => {
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
        const response = await changePasswordAPI({
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
          this.props.pushToLogin(
            'login.passwordChangedSuccess',
            this.props.membership,
            this.props.franchisorId,
          );
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.token) {
          this.setState({
            processing: false,
            hasExpired: true,
            error: t('form.login.tokenExpired'),
          });
        } else {
          this.setState({
            processing: false,
            error: t('form.login.passwordTooEasy'),
          });
        }
      }
    }
  };

  render() {
    const { t, classes } = this.props;
    const { processing, hasExpired, password1, error, password2 } = this.state;
    return (
      <LoginBase theme={this.props.franchisor || this.props.theme}>
        <form onSubmit={this.onSubmit} className={classes.formContainer}>
          <Grid container direction="column" spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6">
                {t('form.login.changePasswordTitle')}
              </Typography>
            </Grid>
            {!hasExpired && (
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
            )}
            {!hasExpired && (
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
            )}
            {error ? (
              <Grid item>
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              </Grid>
            ) : null}
            <Grid item>
              {!!processing && <CircularProgress />}
              {!processing && !hasExpired && (
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  id="btn-new-password-confirm"
                >
                  OK
                </Button>
              )}
              {!!hasExpired && (
                <Button
                  onClick={() =>
                    this.props.requestResetLink(
                      this.props.membership,
                      this.props.franchisorId,
                    )
                  }
                  color="primary"
                  variant="contained"
                >
                  {this.props.t('form.login.resetAgainPassword')}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </LoginBase>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { membership }: { membership: number | null },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchCompanyTheme(companyId: number) {
      dispatch(fetchCompanyTheme(companyId));
    },
    retrieveFranchise(franchisorId: number) {
      dispatch(retrieveFranchise(franchisorId));
    },
    requestResetLink(membership: number | null, franchisorId: number | null) {
      dispatch(
        pushRouter(
          `/login/reset_password${buildUrlParams({
            ...(membership ? { membership } : {}),
            ...(franchisorId ? { franchisor: franchisorId } : {}),
          })}`,
        ),
      );
    },
    pushToLogin(
      successMessage: string,
      membership: number | null,
      franchisorId: number | null,
    ) {
      dispatch(snackbarSuccess(successMessage));
      dispatch(
        pushRouter(
          `/login${buildUrlParams({
            ...(membership ? { membership } : {}),
            ...(franchisorId ? { franchisor: franchisorId } : {}),
          })}`,
        ),
      );
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withStyles(styles),
  withTranslation(),
  withProps((props) => {
    const { membership, franchisor } = parseQueryString(
      props.location?.search || '',
    );
    return {
      membership,
      franchisorId: franchisor,
    };
  }),
  connector,
  connect((state: RootState, { theme, franchisorId }) => ({
    franchisor:
      theme?.franchisor || franchisorId ? getFranchisor(state) : undefined,
  })),
)(ChangePassword);
