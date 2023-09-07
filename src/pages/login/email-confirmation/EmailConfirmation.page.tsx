import React from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { push, goBack as goBackRouter } from 'connected-react-router';
import { withWidth } from '@material-ui/core';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import { EmailConfirmation } from '#libs/login/components/email-confirmation/EmailConfirmation.component';
import {
  sendEmailForConfirmation as sendEmailForConfirmationAction,
  disconnect as disconnectAction,
  goToLastCompanySignup as goToLastCompanySignupAction,
  // @ts-expect-error
} from '../../../actions/auth.actions';
import type { RootState } from '../../../reducers';
import './EmailConfirmationStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getIsUISimplified } from '#libs/theme/selectors';

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

export const EmailConfirmationPage: React.FC<Props> = ({
  sendEmailForConfirmation,
  goToLastCompanySignup,
  disconnect,
  lastTimeSentEmailConfirmation,
  companyId,
  goToCompanySignup,
  isAuthenticated,
  simplifyUI,
}) => {
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
          company={!!companyId}
          goBackToLogin={goBackToSignup}
          lastTimeSentEmailConfirmation={lastTimeSentEmailConfirmation}
          sendEmailForConfirmation={(options) =>
            sendEmailForConfirmation(companyId, options)
          }
          simplifyUI={simplifyUI}
        />
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      resetError: state.auth.resetPassword.error,
      loading: state.auth.resetPassword.loading,
      lastTimeSentEmailConfirmation:
        state.auth.emailConfirmation.last_time_sent_email_confirmation,
      email: state.auth.username,
      companyId: state.theme.theme.company,
      simplifyUI: getIsUISimplified(state),
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
