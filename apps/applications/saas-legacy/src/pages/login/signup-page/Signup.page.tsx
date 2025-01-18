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
} from '@bsport/common/lib/master-data/custom-form.js';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode.js';

import themeSelectors from '#src/libs/theme/selectors';

import { fetchCompanyTheme } from '#src/libs/theme/actions';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#src/libs/custom-form/actions';
import CustomFormView from '#src/libs/custom-form/components/consumer-form/CustomFormView.form';
import {
  getSignUpCustomFormWithEnabledField,
  getSignUpCustomFormLoading,
} from '#src/libs/custom-form/selectors';
import withScrollHeightListener from '#src/hocs/with-widget-scroll-height-listener.hoc';
import type {
  CustomFormFilled,
  CustomFormFieldAnswer,
  SignUpCustomFormPayload,
} from '#src/libs/custom-form/types';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import CustomFormTitle from '#src/libs/custom-form/components/CustomFormTitle.component';
import CustomFormTitleCSS from '#src/libs/custom-form/components/CustomFormTitleCSS';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import { isCustomFormCssVariantActivated } from '#src/libs/custom-form/utils';
import { isBookingFlowNext } from '#src/libs/marketplace/routing-utils';

import { COMPANY_IDS_TO_DISPLAY_REGISTER_BOOKING_TITLE } from '#src/libs/sign-up-form/utils';
import { WithHandlerType } from '../../../utils/types';
import type { RootState } from '../../../reducers';
// @ts-expect-error
import { requestLogin } from '../../../actions/auth.actions';
import { buildUrlParams, parseQueryString } from '../../../http';
import type { Dispatch, OptionCallback } from '../../../state/types';

import analyticsUtils from '#src/components/analytics/analytics';

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
  containerRef: React.MutableRefObject<any>;
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
      // add analytics
      // if (this.props.theme?.id) Analytics.signupShow();
      this.props.fetchCompanyTheme(parseInt(this.props.membership, 10));
      this.props.fetchCompanyCustomSignUp({
        company: parseInt(this.props.membership),
      });
      this.props.retrieveCompanyCssConfiguration(
        parseInt(this.props.membership, 10),
      );
      analyticsUtils.onShowSignup();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.theme && this.props.theme?.id) analyticsUtils.onShowSignup();
  }

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(
      // @ts-expect-error
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
              analyticsUtils.onSignupSuccess(this.props.loginInformations);
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

  shoulDisplayCssVariant = () =>
    isCustomFormCssVariantActivated(
      !!this.props.signUpCustomForm?.layout_configuration
        ?.use_custom_css_variant,
    );

  getContainerClass = () => {
    if (
      WidgetUtils.isWidget() &&
      WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED
    ) {
      return 'bs-signup-container--no_pop_up';
    }

    return WidgetUtils.isWidget()
      ? 'bs-signup-container--widget'
      : 'bs-signup-container--default';
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
      containerRef,
    } = this.props;

    const signUpTitle =
      isBookingFlowNext(next) &&
      COMPANY_IDS_TO_DISPLAY_REGISTER_BOOKING_TITLE.includes(
        parseInt(this.props.membership),
      )
        ? t('signup.titleAsResgisterBooking')
        : t('signup.title');

    if (authenticated) {
      if (next) {
        return <Redirect to={next} />;
      }
      return <Redirect to="/" />;
    }
    if (signUpCustomFormLoading) {
      return null;
    }
    // TODO : remove
    const fieldsAreIndependent = !!(
      // @ts-expect-error
      (this.props.membership === 2073 || this.props.membership === '2073')
    );

    return (
      <div ref={containerRef} className={this.getContainerClass()}>
        <div className="bs-signup-container--margin-top">
          {this.shoulDisplayCssVariant() ? (
            <CustomFormTitleCSS
              isCompany={!!membership}
              simplifyUI={simplifyUI}
              title={signUpTitle}
            />
          ) : (
            <CustomFormTitle
              isCompany={!!membership}
              simplifyUI={simplifyUI}
              title={signUpTitle}
            />
          )}
          {signUpCustomForm && signUpCustomForm.layout && (
            <div className="bs-signup-container__custom-form">
              <CustomFormView
                fieldsAreIndependent={fieldsAreIndependent}
                general_terms_and_conditions={theme.general_terms_of_use}
                initial={signUpCustomForm}
                isCssVariantActivated={this.shoulDisplayCssVariant()}
                layouts={signUpCustomForm.layout}
                onCancel={this.handleCancel}
                // @ts-expect-error
                onSubmit={this.submitCustomForm}
                onSubmitDraft={this.props.setLoginInformations}
                rowHeight={
                  this.props.signUpCustomForm?.layout_configuration?.row_height
                }
                simplifyUI={simplifyUI}
                waiver={theme.waiver}
              />
            </div>
          )}
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
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  goBackToFranchisePage: (franchisor: string | null) =>
    franchisor ? push(`/login?franchisor=${franchisor}`) : push(`/login`),
};

const mapWithHandlers = {
  goBackToLogin:
    ({ previous, pushRouter, location }: OwnProps & ConnectedProps) =>
    (membership: string) => {
      const search = (location || {}).search || '';

      const { next } = parseQueryString(search);
      const defaultNext = '';
      const nextOrDefault = next || defaultNext;

      if (previous) {
        pushRouter(`${previous}?next=${encodeURIComponent(nextOrDefault)}`);
      } else if (membership) {
        pushRouter(
          `/login?membership=${membership}&next=${encodeURIComponent(
            nextOrDefault,
          )}`,
        );
      } else {
        pushRouter(`/login?next=${encodeURIComponent(nextOrDefault)}`);
      }
    },
};
const mapStateToProps = (
  state: RootState,
  { membership }: { membership: string },
) => ({
  theme: !!membership && themeSelectors.getTheme(state),
  simplifyUI: !!membership,
  authenticated: state.auth.authenticated,
  signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
  signUpCustomFormLoading: getSignUpCustomFormLoading(state),
  // eslint-disable-next-line react/no-unused-prop-types
  customConfiguration: state.exportableComponents.customCss, // Mandatory prop consumed by WithCustomCSSProvider HOC.
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
  withScrollHeightListener,
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
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(SignupPage);
