// @flow

import React, { Component } from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import { withRouter, RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import type { Theme } from '@material-ui/core/styles';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form';
import getCalendyLinkFromCountry from '../../i18n/utils/calendy-link-language';

import type { Dispatch, OptionCallback } from '../../state/types';
import themeSelectors from '../../libs/theme/selectors';
import { parseQueryString } from '../../http';
import { openIntercomHelp } from '../../intercom';
import { requestLogin } from '../../actions/auth.actions';

import { fetchCompanyTheme } from '../../libs/theme/actions';
import Analytics from '../../components/analytics/Analytics.component';
import Login from '../../libs/login/components/Login.component';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '../../libs/custom-form/actions';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import { getSignUpCustomFormWithEnabledField } from '../../libs/custom-form/selectors';
import type { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import {
  CustomFormFilled,
  CustomFormFieldAnswer,
} from '../../libs/custom-form/types';

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
      this.props.fetchCompanyTheme(this.props.membership);
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
    if (step === STEPS.WELCOME) {
      return (
        <div className={classes.welcomeContainer}>
          <Login
            doEmailLogin={doEmailLogin}
            error={errorLogin}
            errorFields={errorFields}
            loading={loginProcessing}
            requestSignUp={this.switchToSignUp}
          />
          {!!this.props.theme && this.props.membership && (
            <Analytics username="" theme={this.props.theme} />
          )}
          {!is_premium && (
            <div className={classes.bottom}>
              <Hidden smDown>
                <a href={getCalendyLinkFromCountry()}>
                  <Typography variant="caption">{t('contactUs')}</Typography>
                </a>
              </Hidden>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className={classes.container}>
        <>
          <div className={classes.flexContainer}>
            <Typography variant="h4">{t('signup.title')}</Typography>
            <IconButton onClick={() => openIntercomHelp('login')}>
              <HelpIcon />
            </IconButton>
          </div>

          {this.props.signUpCustomForm && (
            <div>
              <CustomFormView
                initial={this.props.signUpCustomForm}
                onSubmit={this.submitCustomForm}
                onSubmitDraft={(values: CustomFormFilled) =>
                  this.props.setLoginInformations(values)
                }
                layouts={this.props.signUpCustomForm.layout}
                waiver={this.props.theme.waiver}
                general_terms_and_conditions={
                  this.props.theme.general_terms_and_conditions
                }
                onCancel={() => this.cancelSignUp()}
              />
            </div>
          )}
        </>
        {!!this.props.theme && this.props.membership && (
          <Analytics username="" theme={this.props.theme} />
        )}
      </div>
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
const styles = (theme: Theme) => ({
  welcomeContainer: {
    padding: theme.spacing(6),
    width: '100%',
    overflow: 'auto',
    height: '90vh',
    marginTop: '10vh',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {},
  container: {
    padding: theme.spacing(6),
    width: '100%',
    overflow: 'auto',
    height: '90vh',
    marginTop: '10vh',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
