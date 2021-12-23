// @flow

import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { withRouter, RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form';
import chroma from 'chroma-js';

import classnames from 'classnames';
import type { Dispatch, OptionCallback } from '../../state/types';
import themeSelectors from '#libs/theme/selectors';
import { parseQueryString } from '../../http';
import { requestLogin } from '../../actions/auth.actions';

import { fetchCompanyTheme } from '#libs/theme/actions';
import Analytics from '#components/analytics/Analytics.component';
import Login from '#libs/login/components/Login.component';
import LoginBackground from '#libs/login/components/LoginBackground.component';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#libs/custom-form/actions';
import CustomFormView from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import { getSignUpCustomFormWithEnabledField } from '#libs/custom-form/selectors';
import type { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import {
  CustomFormFilled,
  CustomFormFieldAnswer,
} from '#libs/custom-form/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import { CustomFormTitle } from '#libs/custom-form/components/CustomFormTitle.component';

type OwnProps = {
  location: RouteComponentProps;
  membership: string;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  typeof properMapDispatchToProps;

type Props = OwnProps &
  StateHandlerType &
  ConnectedProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const STEPS = {
  WELCOME: 0,
  SIGNIN: 1,
  SIGNUP: 2,
};

export class ConsumerLoginPage extends Component<Props> {
  state = {
    step: STEPS.WELCOME,
  };

  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.fetchCompanyCustomSignUp({
        company: parseInt(this.props.membership),
      });
    }
  }

  switchToSignUp = () => {
    this.setState({
      step: STEPS.SIGNUP,
    });
  };

  cancelSignUp = () => {
    this.setState({
      step: STEPS.WELCOME,
    });
  };

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(
      formdata,
      this.props?.membership || null,
      {
        onSuccess: () => {
          this.props.doEmailLogin(this.props.loginInformations);
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: () => {
          if (options && options.onError) options.onError();
        },
      },
    );
  };

  render() {
    const {
      authenticated,
      errorLogin,
      errorFields,
      loginProcessing,
      doEmailLogin,
      classes,
      t,
      is_premium,
    } = this.props;
    if (authenticated) {
      const { next } = parseQueryString(this.props.location.search);
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }
    const { step } = this.state;

    return (
      <>
        <Hidden
          xsDown={this.state.step === STEPS.WELCOME}
          mdDown={this.state.step !== STEPS.WELCOME}
        >
          <LoginBackground company={!!this.props.membership} />
          <Fade in>
            <div>
              <img
                src={
                  this.props.theme ? this.props.theme.cover : '/logo_bsport.png'
                }
                className={classes.logo}
                alt={
                  this.props.theme
                    ? `${this.props.company} - logo`
                    : 'bsport-logo'
                }
              />
            </div>
          </Fade>
        </Hidden>
        <div className={classes.loginContainer}>
          <div
            className={classnames(classes.container, classes.flexColumnCenter)}
          >
            {step === STEPS.WELCOME && (
              <Login
                doEmailLogin={doEmailLogin}
                error={errorLogin}
                errorFields={errorFields}
                loading={loginProcessing}
                requestSignUp={this.switchToSignUp}
                isPremium={is_premium}
                company={!!this.props.membership}
                theme={this.props.theme}
                t={t}
              />
            )}
            {step !== STEPS.WELCOME && (
              <>
                <CustomFormTitle
                  title={t('signup.title')}
                  company={!!this.props.membership}
                />
                {this.props.signUpCustomForm && (
                  <div className={classes.customForm}>
                    <CustomFormView
                      initial={this.props.signUpCustomForm}
                      onSubmit={this.submitCustomForm}
                      onSubmitDraft={(values: CustomFormFilled) =>
                        this.props.setLoginInformations(values)
                      }
                      layouts={this.props.signUpCustomForm.layout}
                      waiver={this.props.theme.waiver}
                      general_terms_and_conditions={
                        this.props.theme.general_terms_of_use
                      }
                      onCancel={() => this.cancelSignUp()}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {!!this.props.theme && this.props.membership && (
            <Analytics username="" theme={this.props.theme} />
          )}
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch, props: OwnProps) {
  const search = ((props && props.location) || {}).search || '';
  const opts = {
    goNext: ({ is_franchisor }: { is_franchisor: boolean }) =>
      !is_franchisor ? push(parseQueryString(search).next) : null,
    company: parseQueryString(search).membership,
  };
  return {
    doEmailLogin({ email, password }: { email: string; password: string }) {
      dispatch(requestLogin(email, password, opts));
    },
  };
}

const properMapDispatchToProps = {
  submitSignUpCustomForm,
  fetchCompanyTheme,
  fetchCompanyCustomSignUp,
};
const mapStateToProps = (
  state: RootState,
  { membership }: { membership: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  authenticated: state.auth.authenticated,
  errorLogin: state.auth.error,
  loginProcessing: state.auth.loading,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
  is_premium: state.theme.theme.is_premium,
  signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
  company: state.theme.theme.company_name,
});
const withStateHandlersInit = {
  loginInformations: { email: '', password: '' },
};

const withStateHandlersSetter = {
  setLoginInformations: () => (customFormAnswers: CustomFormFilled) => {
    const email =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
      )?.answer || '';

    const password =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
      )?.answer || '';
    return { loginInformations: { email, password } };
  },
};
const styles = (theme: Theme): any => ({
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'absolute',
    zIndex: 2,
  },
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(1),
    width: '100%',
    overflow: 'auto',
    height: WidgetUtils.isWidget() ? '100%' : '92vh',
    marginTop: WidgetUtils.isWidget() ? 0 : '8vh',
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
    },
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signup: {
    fontSize: 36,
    fontWeight: 700,
  },
  signupTitle: {
    position: 'relative',
    marginBottom: theme.spacing(5),
  },
  iconButton: {
    position: 'absolute',
    top: 4,
    right: '-30%',
    marginLeft: theme.spacing(2),
  },
  customForm: {
    marginBottom: theme.spacing(14),
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  rectangle: (props: Props) => ({
    height: 5,
    background: props.membership
      ? `linear-gradient(90deg,${theme.palette.primary.main} 4.66%, ${chroma(
          theme.palette.primary.main,
        ).darken(1.5)} 88.6%)`
      : 'linear-gradient(90deg, #499C7C 4.66%, #2D767F 88.6%)',
    width: 146,
    marginBottom: theme.spacing(3),
  }),
  logo: {
    position: 'absolute',
    left: '6%',
    top: '6%',
    height: 50,
    zIndex: 9,
  },
});

export default compose(
  withRouter,
  withStyles(styles),
  withTranslation(['login']),
  withProps((props: OwnProps) => ({
    membership: parseQueryString(props.location.search).membership,
    goNext: parseQueryString(props.location.search).next,
  })),
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(ConsumerLoginPage);
