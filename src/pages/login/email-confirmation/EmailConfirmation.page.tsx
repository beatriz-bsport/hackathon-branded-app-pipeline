// @ts-nocheck
import React from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { push, goBack as goBackRouter } from 'connected-react-router';
import { withWidth } from '@material-ui/core';
import withQueryParams from '#hocs/with-query-params.hoc';
import { EmailConfirmation } from '#libs/login/components/email-confirmation/EmailConfirmation.component';
import {
  sendEmailForConfirmation as sendEmailForConfirmationAction,
  disconnect as disconnectAction,
  goToLastCompanySignup as goToLastCompanySignupAction,
} from '../../../actions/auth.actions';

import './EmailConfirmationStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

type Props = {
  sendEmailForConfirmation: (companyId: number, options: any) => void;
  goToLastCompanySignup: () => void;
  disconnect: () => void;
  lastTimeSentEmailConfirmation: string;
  companyId: number;
  goToCompanySignup: (companyId: number) => void;
  isAuthenticated: boolean;

  simplifyUI?: boolean;
};

export const EmailConfirmationPage = (props: Props) => {
  const {
    companyId,
    goToLastCompanySignup,
    isAuthenticated,
    goToCompanySignup,
    disconnect,
    simplifyUI,
  } = props;

  const goBackToSignup = () => {
    if (companyId) {
      goToCompanySignup(companyId);
    } else if (isAuthenticated) {
      goToLastCompanySignup();
    }
    disconnect();
  };

  return (
    <div className="bs-email-confirmation-container">
      <div>
        <EmailConfirmation
          goBackToLogin={goBackToSignup}
          sendEmailForConfirmation={(options) =>
            props.sendEmailForConfirmation(props?.companyId, options)
          }
          lastTimeSentEmailConfirmation={props.lastTimeSentEmailConfirmation}
          simplifyUI={simplifyUI}
          company={!!companyId}
        />
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      resetError: state.auth.resetPassword.error,
      loading: state.auth.resetPassword.loading,
      lastTimeSentEmailConfirmation:
        state.auth.emailConfirmation.last_time_sent_email_confirmation,
      email: state.auth.username,
      companyId: state.theme.theme.company,
      isAuthenticated: state.auth.authenticated,
    }),
    {
      goToCompanySignup: (companyId: number) =>
        push(`/login/?membership=${companyId}`),
      goBack: goBackRouter,
      sendEmailForConfirmation: sendEmailForConfirmationAction,
      disconnect: disconnectAction,
      goToLastCompanySignup: goToLastCompanySignupAction,
    },
  ),
  withQueryParams([['uuid', 'token'], 'queryParams']),
  withProps(({ queryParams }) => ({
    uuid: queryParams?.uuid,
    token: queryParams?.token,
  })),
  withWidth(),
  marketplaceCssHoc(),
)(EmailConfirmationPage);
