// @flow
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { createCompany as createCompanyAction } from '../../libs/company/actions';
import {
  checkEmailExists,
  requestLogin as requestLoginAction,
} from '../../actions/auth.actions';

import CompanyOnboardingForm from '../../libs/login/components/CompanySignupForm.component';

import type { OptionCallback } from '../../state/types';

type Props = {
  checkEmailExists: (email: string) => void,
  checkEmailExistsLoading: boolean,
  emailExists: boolean,
  createCompany: (data: any, options: OptionCallback) => void,
};

export const CompanyOnboardingFormPage = (props: Props) => {
  return (
    <CompanyOnboardingForm
      checkEmailExists={props.checkEmailExists}
      checkEmailExistsLoading={props.checkEmailExistsLoading}
      emailExists={props.emailExists}
      onSubmit={props.createCompany}
    />
  );
};

export default compose(
  connect(
    (state) => ({
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
    }),
    {
      createCompany: createCompanyAction,
      checkEmailExists,
      requestLogin: requestLoginAction,
      goToEmailValidation: (email) =>
        push(
          `/login/company_onboarding/email_validation/${encodeURIComponent(
            email,
          )}`,
        ),
    },
  ),
  withHandlers({
    createCompany: ({ createCompany, requestLogin, goToEmailValidation }) => (
      data,
      options,
    ) => {
      createCompany(data, {
        onSuccess: (...args) => {
          requestLogin(data.email, data.password);
          goToEmailValidation(data.email);
          if (options && options.onSuccess) options.onSuccess(...args);
        },
        onError: options && options.onError,
      });
    },
  }),
)(CompanyOnboardingFormPage);
