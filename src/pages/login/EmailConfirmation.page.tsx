import React from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { push, goBack as goBackRouter } from 'connected-react-router';
import {
  isWidthDown,
  Paper,
  withWidth,
  Theme,
  makeStyles,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import withQueryParams from '#hocs/with-query-params.hoc';
import { EmailConfirmation } from '#libs/login/components/EmailConfirmation.component';
import {
  sendEmailForConfirmation as sendEmailForConfirmationAction,
  disconnect as disconnectAction,
  goToLastCompanySignup as goToLastCompanySignupAction,
} from '../../actions/auth.actions';

type Props = {
  sendEmailForConfirmation: (companyId: number, options: any) => void;
  goToLastCompanySignup: () => void;
  disconnect: () => void;
  lastTimeSentEmailConfirmation: string;
  companyId: number;
  goToCompanySignup: (companyId: number) => void;

  width: Breakpoint;
};

export const EmailConfirmationPage = (props: Props) => {
  const goBackToSignup = () => {
    if (props.companyId) {
      props.goToCompanySignup(props.companyId);
    } else if (props.isAuthenticated) {
      props.goToLastCompanySignup();
    }

    props.disconnect();
  };

  const { width } = props;
  const classes = useStyles();
  const isMobile = isWidthDown('sm', width);
  return (
    <Paper className={classes.container}>
      <div>
        <EmailConfirmation
          goBackToLogin={goBackToSignup}
          sendEmailForConfirmation={(options) =>
            props.sendEmailForConfirmation(props?.companyId, options)
          }
          lastTimeSentEmailConfirmation={props.lastTimeSentEmailConfirmation}
          isMobile={isMobile}
        />
      </div>
    </Paper>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    textAlign: 'center',
    padding: 0,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    boxShadow: 'none',
    minWidth: '80%',
    maxWidth: '800px',
  },
  bsportLogo: {
    marginTop: 30,
    height: 80,
    width: 80,
  },
  content: {
    padding: theme.spacing(1),
  },
}));

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
        push(`/login/signup?membership=${companyId}`),
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
)(EmailConfirmationPage);
