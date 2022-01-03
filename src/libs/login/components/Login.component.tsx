// @flow

import React, { Component } from 'react';
import classnames from 'classnames';
import { compose } from 'recompose';
import chroma from 'chroma-js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import './LoginBackground.css';
import './Login.css';
import HelpIcon from '@material-ui/icons/Help';
import { withTranslation, TFunction } from 'react-i18next';

import Fade from '@material-ui/core/Fade';
import { Theme } from '@material-ui/core/styles/createTheme';
import { CompanyTheme } from '#libs/theme/types';
import PasswordInput from '../../../components/input/PasswordInput.component';

import FormField from '../../../components/input/FormField.component';
import { openIntercomHelp } from '../../../intercom';
import getCalendlyLinkFromCountry from '../../../i18n/utils/calendly-link-language';
import WidgetUtils from '#libs/widget/WidgetUtils';
import Config from '../../../config';

type Props = {
  doEmailLogin: (Obj: { email: string; password: string }) => void;
  requestSignUp: () => void;
  loading: boolean;
  classes: any;
  error?: boolean;
  errorFields?: {
    email?: string;
    password?: string;
  };
  t: TFunction;
  isPremium?: boolean;
  company?: boolean;
  theme?: CompanyTheme;
  logoHidden?: boolean;
  marketplace?: boolean;
  franchisor?: boolean;
};

type State = {
  email: string;
  password: string;
};

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onFormFieldChange = (id: string) => (value: any) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => {
    const { classes, error, errorFields, t } = this.props;
    let errorMessage = t('error.authError');

    if (errorFields && errorFields.password) {
      errorMessage = t('error.invalidPassword');
    }
    if (errorFields && errorFields.email) {
      errorMessage = t('error.invalidEmail');
    }

    return (
      <div className={`${classes.flexColumnCenter} ${classes.getEmailLogin}`}>
        {!WidgetUtils.isWidget() && !this.props.logoHidden && (
          <div className={classes.logoDiv}>
            <Hidden smUp>
              <Fade in>
                <div>
                  <img
                    src={
                      this.props.theme
                        ? this.props.theme.cover
                        : 'https://cdn.bsport.io/bsport_logo_txt.png'
                    }
                    className={classes.logo}
                    alt={
                      this.props.theme
                        ? `${this.props.theme.company_name} - logo`
                        : 'bsport-logo'
                    }
                  />
                </div>
              </Fade>
            </Hidden>
          </div>
        )}
        <div className={classes.flexRowCenter}>
          <div
            className={classnames(
              classes.flexColumnCenter,
              classes.connectionTitle,
            )}
          >
            <Typography className={classes.connection}>
              {t('signin.connection')}
            </Typography>
            <div
              className={classnames([classes.rectangle, 'reactangle-animated'])}
            />
            <IconButton
              className={classes.iconButton}
              onClick={() => openIntercomHelp('login')}
            >
              <HelpIcon />
            </IconButton>
          </div>
        </div>
        <div className={classes.connect}>
          <Typography variant="body1">{t('signin.connect')}</Typography>
        </div>
        <form className={classes.column} onSubmit={this.doEmailLogin}>
          <div className={classes.field}>
            <FormField
              id="email"
              name="login"
              onChange={this.onFormFieldChange}
              fullWidth
            />
          </div>
          <div className={classes.field}>
            <PasswordInput
              fullWidth
              value={this.state.password}
              className={classes.field}
              onChange={(ev: any) =>
                this.onFormFieldChange('password')(ev.target.value)
              }
            />
          </div>
          {error ? (
            <div
              className={classnames(
                classes.errorMessage,
                classes.flexRowCenter,
              )}
            >
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
              <IconButton onClick={() => openIntercomHelp('login')}>
                <HelpIcon />
              </IconButton>
            </div>
          ) : null}
          <Button
            className={classes.signInButton}
            variant="contained"
            type="submit"
            id="btn-signin"
          >
            {t('actions.signin')}
          </Button>
          <div
            className={classnames(
              classes.flexRowCenter,
              classes.forgottenPassword,
            )}
          >
            <a
              href={`${Config.PUBLIC_URL}/login/reset_password`}
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="body2" align="center">
                <p className={classes.forgottenPasswordText}>
                  {t('actions.forgottenPassword')}
                </p>
              </Typography>
            </a>
          </div>
        </form>
      </div>
    );
  };

  doEmailLogin = (e: any) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.doEmailLogin({ email, password });
  };

  render() {
    const { loading, t, classes } = this.props;

    if (loading) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }

    const { requestSignUp } = this.props;
    return (
      <div className={classnames(classes.flexColumnCenter, classes.container)}>
        {this.getEmailLogin()}
        <div className={classes.signupDivider} />
        <div>
          <Typography variant="body2">
            {t('actions.signup.noAccount')}
          </Typography>
        </div>
        <Button
          id="btn-goto-signup"
          variant="outlined"
          onClick={requestSignUp}
          className={classes.registerButton}
        >
          {t('actions.signup.register')}
        </Button>
        {!this.props.isPremium && (
          <div className={classes.studioManager}>
            <a href={getCalendlyLinkFromCountry()} className={classes.link}>
              <Typography variant="body2">{t('contactUs')}</Typography>
            </a>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme): any => ({
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
    width: 408,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    marginBottom: WidgetUtils.isWidget() ? theme.spacing(10) : 0,
  },
  connectionTitle: {
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    top: 4,
    right: '-30%',
    marginLeft: theme.spacing(2),
  },
  signInButton: (props: Props) => ({
    marginTop: theme.spacing(2),
    background:
      props.company || props.franchisor
        ? `linear-gradient(90deg,${theme.palette.primary.main} 4.66%, ${chroma(
            theme.palette.primary.main,
          ).darken(1.2)} 88.6%)`
        : 'linear-gradient(90deg, #499C7C 4.66%, #2D767F 88.6%)',
    borderRadius: 8,
    height: 48,
    color:
      chroma(theme.palette.primary.main).luminance() > 0.5
        ? '#000000'
        : '#ffffff',
    '&:hover': {
      background:
        props.company || props.franchisor
          ? `linear-gradient(90deg,${chroma(theme.palette.primary.main).darken(
              1.05,
            )} 4.66%, ${chroma(theme.palette.primary.main).darken(1.25)} 88.6%)`
          : `linear-gradient(90deg, ${chroma('#499C7C').darken(
              1.05,
            )} 4.66%, ${chroma('#2D767F').darken(1.05)} 88.6%)`,
    },
  }),
  field: {
    marginBottom: theme.spacing(3),
    color: 'rgba(117, 117, 117, 1)',
  },
  errorMessage: {
    marginLeft: theme.spacing(2.5),
    alignSelf: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: 408,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  rectangle: (props: Props) => ({
    height: 5,
    background:
      props.company || props.franchisor
        ? `linear-gradient(90deg,${theme.palette.primary.main} 4.66%, ${chroma(
            theme.palette.primary.main,
          ).darken(1.1)} 88.6%)`
        : 'linear-gradient(90deg, #499C7C 4.66%, #2D767F 88.6%)',
    width: 146,
    marginBottom: theme.spacing(3),
  }),
  connection: {
    fontSize: 36,
    fontWeight: 700,
  },
  connect: {
    color: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    textAlign: 'center',
  },
  forgottenPassword: {
    alignSelf: 'center',
  },
  forgottenPasswordText: {
    color:
      chroma(theme.palette.secondary.main).luminance() < 0.3
        ? theme.palette.secondary.main
        : `${chroma(theme.palette.secondary.main).darken(1.1)}`,
  },
  registerButton: {
    borderRadius: 42,
    border: '1px solid #4D4D4D',
    minWidth: 200,
    minHeight: 46,
    '&:hover': {
      background: theme.palette.primary.main,
      color:
        chroma(theme.palette.primary.main).luminance() > 0.5
          ? '#000000'
          : '#ffffff',
      border: 'none',
    },
  },
  signupDivider: (props: Props) => ({
    maxWidth: 274,
    minWidth: '65%',
    height: 1,
    border: '0.5px solid #E5E5E5',
    marginTop:
      WidgetUtils.isWidget() || props.marketplace
        ? theme.spacing(2)
        : theme.spacing(6),
    marginBottom:
      WidgetUtils.isWidget() || props.marketplace
        ? theme.spacing(5)
        : theme.spacing(9),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(5),
      minWidth: '50%',
      width: 190,
    },
  }),
  studioManager: {
    marginTop: theme.spacing(5),
    whiteSpace: 'pre-line',
    textAlign: 'center',
    width: 408,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  },
  link: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&:link': {
      color:
        chroma(theme.palette.secondary.main).luminance() < 0.4
          ? theme.palette.secondary.main
          : `${chroma(theme.palette.secondary.main).darken(1.1)}`,
    },
    '&:visited': {
      color:
        chroma(theme.palette.secondary.main).luminance() < 0.4
          ? theme.palette.secondary.main
          : `${chroma(theme.palette.secondary.main).darken(1.1)}`,
    },
  },
  logo: {
    marginBottom: theme.spacing(3),
    height: 38,
  },
  logoDiv: {
    alignSelf: 'start',
  },
  getEmailLogin: {
    width: '90%',
  },
});

export default compose<any, Props>(
  withStyles(styles),
  withTranslation(['login']),
)(ConsumerLogin);
