// @ts-nocheck
import React, { Component } from 'react';
import { compose, withHandlers, withProps, withStateHandlers } from 'recompose';

import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form';

import type { Dispatch, OptionCallback } from '../../../state/types';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
import { buildUrlParams, parseQueryString } from '../../../http';
// @ts-expect-error
import { requestLogin } from '../../../actions/auth.actions';

import { fetchCompanyTheme } from '#libs/theme/actions';
// @ts-expect-error
import Analytics from '#components/analytics/Analytics.component';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#libs/custom-form/actions';
import CustomFormView from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import {
  getSignUpCustomFormWithEnabledField,
  getSignUpCustomFormLoading,
} from '#libs/custom-form/selectors';
import type { RootState } from '../../../reducers';
import { WithHandlerType } from '../../../utils/types';
import type {
  CustomFormFilled,
  CustomFormFieldAnswer,
  SignUpCustomFormPayload,
} from '#libs/custom-form/types';
import WidgetUtils from '#libs/widget/WidgetUtils';
import CustomFormTitle from '#libs/custom-form/components/CustomFormTitle.component';
import './SignupPageStyles.css';

type OwnProps = {
  location: {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: string;
  };
  previous: string;
  franchisor: string;
  next: string;
  membership: string;

  simplifyUI?: boolean;

  doEmailLogin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof properMapDispatchToProps;

type Props = OwnProps &
  StateHandlerType &
  ConnectedProps &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

export class SignupPage extends Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      if (this.props.theme?.id) Analytics.signupShow();
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.fetchCompanyCustomSignUp({
        company: parseInt(this.props.membership),
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.theme && this.props.theme?.id) Analytics.signupShow();
  }

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(
      formdata,
      this.props?.membership || null,
      {
        onSuccess: (data: SignUpCustomFormPayload) => {
          this.props.doEmailLogin(this.props.loginInformations);
          if (!data.email_confirmed) {
            this.props.pushRouter(
              `/login/email_confirmation/${buildUrlParams({
                membership: this.props.membership,
              })}`,
            );
          } else {
            if (this.props.membership && this.props.theme?.id)
              Analytics.signupSuccess(this.props.loginInformations);
            options?.onSuccess?.();
          }
        },
        onError: () => options?.onError?.(),
      },
    );
  };

  handleCancel = () => {
    this.props.goBackToLogin(this.props.membership);
  };

  render() {
    const {
      authenticated,
      t,
      membership,
      signUpCustomForm,
      theme,
      next,
      simplifyUI,
      signUpCustomFormLoading,
    } = this.props;

    if (authenticated) {
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }
    if (signUpCustomFormLoading) {
      return null;
    }
    const containerClass = WidgetUtils.isWidget()
      ? 'bs-signup-container--widget'
      : 'bs-signup-container--default';

    return (
      <div className={containerClass}>
        <div className="bs-signup-container--margin-top">
          <CustomFormTitle
            isCompany={!!membership}
            simplifyUI={simplifyUI}
            title={t('signup.title')}
          />
          {signUpCustomForm && signUpCustomForm.layout && (
            <div className="bs-signup-container__custom-form">
              <CustomFormView
                general_terms_and_conditions={theme.general_terms_of_use}
                initial={signUpCustomForm}
                layouts={signUpCustomForm.layout}
                onCancel={this.handleCancel}
                onSubmit={this.submitCustomForm}
                onSubmitDraft={this.props.setLoginInformations}
                simplifyUI={simplifyUI}
                waiver={theme.waiver}
              />
            </div>
          )}

          {!!theme && membership && <Analytics theme={theme} username="" />}
        </div>
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
  pushRouter: push,

  goBackToFranchisePage: (franchisor: string | null) =>
    franchisor ? push(`/login?franchisor=${franchisor}`) : push(`/login`),
};

const mapWithHandlers = {
  goBackToLogin:
    ({ previous, pushRouter }: OwnProps & ConnectedProps) =>
    (membership: string) => {
      if (previous) {
        pushRouter(previous);
      } else if (membership) {
        pushRouter(`/login?membership=${membership}`);
      } else {
        pushRouter(`/login`);
      }
    },
};
const mapStateToProps = (
  state: RootState,
  { membership }: { membership: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  simplifyUI: !!membership && getIsUISimplified(state),
  authenticated: state.auth.authenticated,
  signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
  signUpCustomFormLoading: getSignUpCustomFormLoading(state),
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

export default compose(
  withRouter,
  withTranslation(['login']),
  withProps((props: OwnProps) => {
    const { membership, franchisor, next, previous } = parseQueryString(
      props.location.search,
    );
    return { membership, franchisor, next, previous };
  }),
  connect(mapStateToProps, mapDispatchToProps),
  connect(null, properMapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(SignupPage);
