// @flow

import React from 'react';

import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { checkEmailValidation as checkEmailValidationAPI } from '../../libs/login/api';
import { requestValidationEmail as requestValidationEmailAction } from '../../libs/login/actions';
import EmailValidation from '../../libs/login/components/EmailValidation.component';
import { disconnect as disconnectAction } from '../../actions/auth.actions';

import type { OptionCallback } from '../../state/types';

type Props = {
  requestValidationEmail: (options: OptionCallback) => void,
  checkEmailValidation: (callback: () => void) => void,
  disconnect: () => void,
};

export const EmailValidationPage = (props: Props) => {
  return (
    <EmailValidation
      requestValidationEmail={props.requestValidationEmail}
      checkEmailValidation={props.checkEmailValidation}
      disconnect={props.disconnect}
    />
  );
};

export default compose(
  routerParamsToProps({ email: 'email' }),
  connect(null, {
    goToRoot: () => push('/'),
    requestValidationEmail: requestValidationEmailAction,
    disconnect: disconnectAction,
  }),
  withHandlers({
    disconnect: ({ disconnect, goToRoot }) => () => disconnect(goToRoot),
    requestValidationEmail: ({ requestValidationEmail, email }) => (options) =>
      requestValidationEmail(email, options),
    checkEmailValidation: ({ email, goToRoot }) => (callback) => {
      checkEmailValidationAPI(decodeURIComponent(email))
        .then((r) => {
          if (r.data.validated) {
            callback();
            setTimeout(goToRoot, 3000);
          }
        })
        .catch(() => {});
    },
  }),
)(EmailValidationPage);
