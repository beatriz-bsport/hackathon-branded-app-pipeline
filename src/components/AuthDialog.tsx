import React from 'react';
import compose from 'recompose/compose';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import 'react-phone-number-input/style.css';

import SignUpForm from 'bsport-saas/src/components/form/SignUpForm.component';
import ConsumerLogin from 'bsport-saas/src/components/consumer/login/ConsumerLogin.component';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

const SignUpFormStyled = themify(SignUpForm);

type OwnProps = {
  showLogin: boolean,
  showSignup: boolean,
  authenticated: boolean,
  loading: boolean,
  error: any,
  errorFields: any,
  emailExists: boolean,
  checkEmailExists: boolean,
  checkEmailExistsLoading: boolean,
  theme: Theme,
  onLogin: (data: any) => void,
  onSignup: (data: any) => void,
  onLoginClose: () => void,
  onSignupClose: () => void,
  onSignupShow: () => void,
};

type Props = OwnProps & WithTranslation;

class AuthDialog extends React.PureComponent<Props> {
  render() {
    return (
      <>
        <Dialog
          open={this.props.showLogin && !this.props.authenticated}
          onClose={this.props.onLoginClose}
        >
          <DialogContent>
            <React.Suspense fallback={<CircularProgress />}>
              <ConsumerLogin
                doEmailLogin={this.props.onLogin}
                errorFields={this.props.errorFields}
                error={this.props.error}
                loading={this.props.loading}
                requestSignUp={this.props.onSignupShow}
              />
            </React.Suspense>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.props.showSignup && !this.props.authenticated}
          onClose={this.props.onSignupClose}
        >
          <Grid container direction="column" spacing={2}>
            <React.Suspense fallback={<CircularProgress />}>
              <Grid item>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                />
              </Grid>
              <Grid item>
                <SignUpFormStyled
                  loading={this.props.loading}
                  theme={this.props.theme}
                  emailExists={this.props.emailExists}
                  checkEmailExistsLoading={this.props.checkEmailExistsLoading}
                  checkEmailExists={this.props.checkEmailExists}
                  onComplete={this.props.onSignup}
                  onCancel={this.props.onSignupClose}
                  consumerProfile={this.props.consumerProfile}
                />
              </Grid>
            </React.Suspense>
          </Grid>
        </Dialog>
      </>
    );
  }
}

export default compose<any, OwnProps>(withTranslation(['login']))(AuthDialog);
