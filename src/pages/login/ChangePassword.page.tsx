import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  withStyles,
  createStyles,
  type WithStyles,
  type Theme,
} from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { withProps, compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import { RootState } from '../../reducers';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
import { parseQueryString, buildUrlParams } from '../../http';
import type { Theme as CompanyTheme } from '#libs/theme/types';

import { changePassword as changePasswordAPI } from '../../libs/login/api';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { retrieveFranchise } from '../../libs/franchise/actions';
import { getFranchisor } from '../../libs/franchise/selectors';

// @ts-expect-error
import B_ASSET from '../../public/images/b_dark.jpg';

const styles = (theme: Theme) =>
  createStyles({
    formContainer: {
      margin: theme.spacing(2),
    },
    button: (props: Props) => ({
      borderRadius: props.simplifyUI ? 24 : 8,
    }),
    container: {
      maxWidth: 320,
      textAlign: 'center',
      padding: 0,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    bsportLogo: {
      marginTop: 30,
      marginLeft: 10,
      marginRight: 10,
      maxWidth: '40vw',
      width: 140,
    },
    content: {
      padding: theme.spacing(1),
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
  simplifyUI?: boolean;
  franchisorId?: number;
  franchisor?: CompanyTheme;
  membership?: number;
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
        onSuccess: (theme: CompanyTheme) => {
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
    const theme = this.props.franchisor || this.props.theme;

    return (
      <Paper className={classes.container}>
        <img
          alt={`${theme?.company_name || 'bsport'} logo`}
          className={classes.bsportLogo}
          src={theme?.cover || B_ASSET}
        />
        <div className={classes.content}>
          <form className={classes.formContainer} onSubmit={this.onSubmit}>
            <Grid container alignItems="center" direction="column" spacing={2}>
              <Grid item>
                <Typography variant="h6">
                  {t('form.login.changePasswordTitle')}
                </Typography>
              </Grid>
              {!hasExpired && (
                <Grid item>
                  <TextField
                    required
                    name="password"
                    onChange={this.handlePassword1Change}
                    placeholder={t('form.login.password')}
                    type="password"
                    value={password1}
                  />
                </Grid>
              )}
              {!hasExpired && (
                <Grid item>
                  <TextField
                    required
                    name="passwordConfirm"
                    onChange={this.handlePassword2Change}
                    placeholder={t('form.login.confirmPassword')}
                    type="password"
                    value={password2}
                  />
                </Grid>
              )}
              {error ? (
                <Grid item>
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item>
                {!!processing && <CircularProgress />}
                {!processing && !hasExpired && (
                  <Button
                    className={classes.button}
                    color="primary"
                    id="btn-new-password-confirm"
                    type="submit"
                    variant="contained"
                  >
                    {t('common.ok')}
                  </Button>
                )}
                {!!hasExpired && (
                  <Button
                    className={classes.button}
                    color="primary"
                    onClick={() =>
                      this.props.requestResetLink(
                        this.props.membership,
                        this.props.franchisorId,
                      )
                    }
                    variant="contained"
                  >
                    {this.props.t('form.login.resetAgainPassword')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Paper>
    );
  }
}

const connector = connect(
  (state: RootState, { membership }: { membership: number | null }) => ({
    theme: !!membership && themeSelectors.getTheme(state),
    simplifyUI: !!membership && getIsUISimplified(state),
  }),

  {
    fetchCompanyTheme,
    retrieveFranchise,
    requestResetLink: (
      membership: number | null,
      franchisorId: number | null,
    ) =>
      pushRouter(
        `/login/reset_password${buildUrlParams({
          ...(membership ? { membership } : {}),
          ...(franchisorId ? { franchisor: franchisorId } : {}),
        })}`,
      ),
    pushToLogin: (
      successMessage: string,
      membership: number | null,
      franchisorId: number | null,
    ) =>
      pushRouter(
        `/login${buildUrlParams({
          ...(membership ? { membership } : {}),
          ...(franchisorId ? { franchisor: franchisorId } : {}),
        })}`,
      ),
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['translation', 'common']),
  withProps(({ location }) => {
    const { membership, franchisor }: any = parseQueryString(
      location?.search || '',
    );
    return {
      membership,
      franchisorId: franchisor,
    };
  }),
  connector,
  connect((state: RootState, { theme, franchisorId }: any) => ({
    franchisor:
      theme?.franchisor || franchisorId ? getFranchisor(state) : undefined,
  })),
)(ChangePassword);
