import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers } from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form.js';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
  fetchCompanyCustomMemberForm,
  submitCustomForm,
} from '#src/libs/custom-form/actions';
import {
  getReferralLinkStatusLoading,
  getTheReferralLinkStatus,
  getReferralRegistrationErrorCode,
} from '#src/libs/referral/selectors';
import { retrieveReferralLinkStatus } from '#src/libs/referral/actions';
import {
  withUserProfileData,
  getMemberCustomFormWithEnabledField,
  getSignUpCustomFormWithEnabledField,
  getSignUpCustomFormLoading,
} from '#src/libs/custom-form/selectors';
import CustomFormTitle from '#src/libs/custom-form/components/CustomFormTitle.component';
import CustomFormView from '#src/libs/custom-form/components/consumer-form/CustomFormView.form';
import ReferralLinkRegistrationInfo from '#src/libs/referral/components/ReferralLinkRegistrationInfo.component';
import { isReferralUsable } from '#src/libs/referral/utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import {
  CustomFormFilled,
  CustomFormFieldAnswer,
  SignUpSuccessResponse,
} from '#src/libs/custom-form/types';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '#src/libs/member/actions';
import {
  linkMeToCompany as linkMeToCompanyAction,
  requestMembershipValidation as requestMembershipValidationAction,
} from '#src/libs/membership/actions';
import { getMarketplaceRoute } from '#src/libs/marketplace/routing-utils';

import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import withThemeProvider from '#src/hocs/company-themifier.hoc';
import { buildUrlParams } from '../../http';
// @ts-expect-error not typed
import { requestLogin } from '../../actions/auth.actions';

import type { OptionCallback } from '../../state/types';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';

import analyticsUtils from '#src/components/analytics/analytics';

import './signup-page/SignupPageStyles.css';

type OwnProps = {
  title: string;
  referralUuid: string; // coming from the router
};
type StateHandlerType = typeof withLoginInformationsHandlersInit &
  WithHandlerType<typeof withLoginInformationHandlers>;

type State = {
  initialLoading: boolean;
  hasBeenRegistered: boolean;
  onFinish: (() => void) | null;
  processing: boolean;
};

type Props = OwnProps &
  StateHandlerType &
  ConnectedProps<typeof connector> &
  WithTranslation;

export class ReferralRegistration extends Component<Props, State> {
  state: State = {
    initialLoading: true, // to avoiuud flickering of various loading
    processing: false,
    hasBeenRegistered: false,
    onFinish: null,
  };

  componentDidMount() {
    this.props.retrieveReferralLinkStatus(this.props.referralUuid, {
      onError: () => this.setState({ initialLoading: false }),
      onSuccess: (referralLinkStatus) => {
        this.props.fetchCompanyTheme(referralLinkStatus.company_id);
        if (this.props.authenticated) {
          this.props.fetchMyUserProfile();
          this.props.fetchCompanyCustomMemberForm(
            this.props.referralLinkStatus.company_id,
            {
              onSuccess: () => this.setState({ initialLoading: false }),
              onError: () => this.setState({ initialLoading: false }),
            },
          );
        } else {
          this.props.fetchCompanyCustomSignUp({
            company: referralLinkStatus.company_id,
            options: {
              onSuccess: () => this.setState({ initialLoading: false }),
              onError: () => this.setState({ initialLoading: false }),
            },
          });
        }
      },
    });
  }

  submitCustomMemberForm = (
    formdata: CustomFormFieldAnswer,
    company: number,
    options: OptionCallback,
    referral_uuid: string,
  ) => {
    this.props.linkMeToCompany(
      { company, referral_uuid },
      {
        onSuccess: (payload: any) => {
          this.props.submitCustomFormAction(
            // @ts-expect-error
            { form_filled: formdata, companyId: company },
            {
              ...options,
              onSuccess: () => {
                this.props.fetchMember(payload.member.id);
                options.onSuccess();
                this.props.requestMembershipValidation({ company });
              },
            },
          );
        },
      },
    );
  };

  submitCustomForm = (
    formdata: CustomFormFieldAnswer,
    options?: OptionCallback,
  ) => {
    let call: (
      formdata: CustomFormFieldAnswer,
      company: number,
      options: OptionCallback<SignUpSuccessResponse | void>,
      referral_uuid: string,
    ) => void = null;

    type OnSuccessType = (data: SignUpSuccessResponse) => void;

    let onSuccess: OnSuccessType = () => {};

    if (this.props.authenticated) {
      call = this.submitCustomMemberForm;
      onSuccess = () => {
        this.setState({
          hasBeenRegistered: true,
          onFinish: () => {
            window.location.href =
              this.props.referralLinkStatus.redirect_link ||
              getMarketplaceRoute(
                this.props.theme.company_name,
                this.props.theme.company,
                '',
              );
          },
        });
      };
    } else {
      call = this.props.submitSignUpCustomForm;

      onSuccess = (data: SignUpSuccessResponse) => {
        this.props.doEmailLogin(
          this.props.loginInformations.email,
          this.props.loginInformations.password,
        );
        this.setState({
          hasBeenRegistered: true,
          onFinish: () => {
            if (!data.email_confirmed) {
              this.props.pushRouter(
                `/login/email_confirmation/${buildUrlParams({
                  membership: this.props.referralLinkStatus.company_id,
                })}`,
              );
            } else if (
              this.props.referralLinkStatus.company_id &&
              this.props.theme?.id
            )
              analyticsUtils.onSignupSuccess(this.props.loginInformations);
            window.location.href =
              this.props.referralLinkStatus.redirect_link ||
              getMarketplaceRoute(
                this.props.theme.company_name,
                this.props.theme.company,
                '',
              );
          },
        });
      };
    }

    this.setState({ processing: true }, () => {
      call(
        formdata,
        this.props.referralLinkStatus.company_id,
        {
          onSuccess: (data?: SignUpSuccessResponse) => {
            this.setState({ processing: false });
            onSuccess(data);
          },
          onError: () => {
            this.setState({ processing: false });
            if (options?.onError) options.onError();
          },
        },
        isReferralUsable(this.props.referralLinkStatus)
          ? this.props.referralUuid
          : null,
      );
    });
  };

  render() {
    const {
      t,
      authenticated,
      signUpCustomForm,
      memberCustomForm,
      theme,
      referralRegistrationErrorCode,
      referralLinkStatus,
    } = this.props;

    const containerClass = WidgetUtils.isWidget()
      ? 'bs-signup-container--widget'
      : 'bs-signup-container--default';

    const form = authenticated ? memberCustomForm : signUpCustomForm;

    // this is for typescript, withUserProfileData states that it may return an array
    if (Array.isArray(form)) return null;

    if (
      (!form && !this.state.hasBeenRegistered) ||
      this.state.initialLoading ||
      this.state.processing ||
      this.props.memberCustomFormLoading
    ) {
      return (
        <div className={containerClass}>
          <div className="bs-signup-container--margin-top">
            <CircularProgress />
          </div>
        </div>
      );
    }

    return (
      <div className={containerClass}>
        <div className="bs-signup-container--margin-top">
          {!this.state.hasBeenRegistered && (
            <CustomFormTitle isCompany title={t('signup.title')} />
          )}
          <ReferralLinkRegistrationInfo
            companyName={theme.company_name}
            hasBeenRegistered={this.state.hasBeenRegistered}
            onConfirm={this.state.onFinish}
            referralExceptionCode={referralRegistrationErrorCode}
            referralLinkStatus={referralLinkStatus}
          />
          {!referralRegistrationErrorCode &&
            !this.state.hasBeenRegistered &&
            isReferralUsable(referralLinkStatus) &&
            form &&
            form.layout && (
              <div className="bs-signup-container__custom-form">
                <CustomFormView
                  hideBackButton
                  measureBeforeMount
                  simplifyUI
                  general_terms_and_conditions={theme.general_terms_of_use}
                  initial={form}
                  isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
                  layouts={form.layout}
                  onSubmit={this.submitCustomForm}
                  onSubmitDraft={this.props.setLoginInformations}
                  waiver={theme.waiver}
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

const withLoginInformationHandlers = {
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
const withLoginInformationsHandlersInit = {
  loginInformations: { email: '', password: '' },
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    referralLinkStatus: getTheReferralLinkStatus(state),
    referralLinkStatusLoading: getReferralLinkStatusLoading(state),
    signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
    theme: themeSelectors.getTheme(state),
    signUpCustomFormLoading: getSignUpCustomFormLoading(state),
    // if authenticated
    memberCustomForm: withUserProfileData(getMemberCustomFormWithEnabledField)(
      state,
    ),
    memberCustomFormLoading: state.customForm.memberForm.loading,
    referralRegistrationErrorCode: getReferralRegistrationErrorCode(state),
  }),
  {
    retrieveReferralLinkStatus,
    submitSignUpCustomForm,
    fetchCompanyTheme,
    fetchCompanyCustomSignUp,
    doEmailLogin: requestLogin,
    fetchMember: fetchMemberAction,
    fetchMyUserProfile,
    linkMeToCompany: linkMeToCompanyAction,
    requestMembershipValidation: requestMembershipValidationAction,
    fetchCompanyCustomMemberForm,
    submitCustomFormAction: submitCustomForm,
    pushRouter: push,
  },
);

export default compose(
  withTranslation(['login', 'referral']),
  routerParamsToProps({ referralUuid: 'referralUuid:string' }),
  connector,
  withStateHandlers(
    withLoginInformationsHandlersInit,
    withLoginInformationHandlers,
  ),
  withThemeProvider,
  marketplaceCssHoc(),
)(ReferralRegistration);
