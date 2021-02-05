// @flow
import React from 'react';

import { withRouter, Switch, Redirect, Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import Hidden from '@material-ui/core/Hidden';
import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import { parseQueryString } from '../../http';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { disconnect } from '../../actions/auth.actions';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';

import LoginPro from './LoginPro.component';
import ValidateEmailWithTokenPage from './ValidateEmailWithToken.page';
import LoginConsumer from './LoginConsumer.component';
import asyncComponent from '../../AsyncComponent';

import Signout from './Signout.component';
import ResetPassword from './ResetPassword.component';
import ChangePassword from './ChangePassword.component';

const CompanyOnboardingRouter = asyncComponent(() =>
  import('./CompanyOnboarding.router'),
);

type Props = {
  membership: ?string,
  fetchCompanyTheme: (string) => void,
  classes: Object,
  theme: CompanyTheme,
  loginProcessing: boolean,
  disconnect: () => void,
};

export class LoginRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.membership !== prevProps.membership &&
      this.props.membership
    ) {
      this.props.fetchCompanyTheme(this.props.membership);
    }
  }

  componentWillMount() {
    if (this.props.loginProcessing) {
      this.props.disconnect();
    }
  }

  render() {
    const { classes } = this.props;
    const isWidget = (
      window &&
      window.env &&
      (window.env.APP_CONTEXT === 'widget')
    );
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Grid container>
          {!isWidget && (
            <Hidden xsDown>
              <Grid item sm={6} md={6} lg={7} className={classes.logoContainer}>
                <div
                  style={{
                    position: 'fixed',
                    zIndex: 0,
                    width: '100vw',
                    height: '100vh',
                  }}
                />
                <Fade in>
                  <img
                    src={
                      this.props.theme
                        ? this.props.theme.cover
                        : '/logo-fond-bleu.svg'
                    }
                    className={classes.logo}
                    alt="bsport-logo"
                  />
                </Fade>
              </Grid>
            </Hidden>
          )}
          <Grid
            item
            xs={12}
            sm={6 + (isWidget ? 6 : 0)}
            md={6 + (isWidget ? 6 : 0)}
            lg={5 + (isWidget ? 7 : 0)}
            style={{ zIndex: 20 }}
          >
            <Paper elevation={16} className={classes.loginContainer}>
              <Switch>
                <Route path="/login/signout" component={Signout} />
                <Route path="/login/reset_password" component={ResetPassword} />
                <Route path="/login/pro" component={LoginPro} />
                <Route path="/login/customer" component={LoginConsumer} />
                <Route
                  path="/login/company_onboarding/:activeStep/"
                  component={CompanyOnboardingRouter}
                />
                <Route
                  path="/login/company_onboarding"
                  component={() => (
                    <Redirect to="/login/company_onboarding/welcome" />
                  )}
                />
                <Route path="/login/reset_password" component={ResetPassword} />
                <Route
                  path="/login/email_validation/:uid/:token"
                  component={ValidateEmailWithTokenPage}
                />
                <Route path="/login/signout" component={Signout} />
                <Route
                  path="/login/change_password/:uid/:token"
                  component={ChangePassword}
                />
                <Route path="/login" component={LoginConsumer} />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  logoContainer: (props) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.membership ? 'white' : '#07162D',
    position: 'relative',
    zIndex: 9,
  }),
  logo: {
    marginTop: '-10%',
    maxWidth: '40%',
    position: 'absolute',
    zIndex: 20,
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
};

export default compose(
  withRouter,
  withProps((props) => ({
    membership: parseQueryString(props.location.search).membership,
  })),
  withStyles(styles),
  connect(
    (state, { membership }) => ({
      theme: !!membership && themeSelectors.getTheme(state),
      loginProcessing: state.auth.loading,
    }),
    {
      fetchCompanyTheme,
      disconnect,
    },
  ),
)(LoginRouter);
