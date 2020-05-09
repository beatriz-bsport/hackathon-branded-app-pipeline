// @flow
import React from 'react';

import { withRouter, Switch, Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Particles from 'react-particles-js';
import Hidden from '@material-ui/core/Hidden';
import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import parse from '../../query-string';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { disconnect } from '../../actions/auth.actions';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';

import LoginPro from './LoginPro.component';
import LoginConsumer from './LoginConsumer.component';
import Signout from './Signout.component';
import ResetPassword from './ResetPassword.component';
import ChangePassword from './ChangePassword.component';

type Props = {
  membership: ?string,
  fetchCompanyTheme: (string) => void,
  classes: Object,
  theme: CompanyTheme,
};

export class LoginRouter extends React.Component<Props> {
  componentDidMount() {
    if (this.props.membership) {
      this.props.fetchCompanyTheme(this.props.membership);
    }
  }

  componentDidUpdate(prevProps) {
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
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Grid container>
          <Hidden xsDown>
            <Grid item sm={6} md={6} lg={7} className={classes.logoContainer}>
              <div
                style={{
                  position: 'fixed',
                  zIndex: 0,
                  width: '100vw',
                  height: '100vh',
                }}
              >
                <Particles
                  id="particle-js"
                  style={{
                    position: 'fixed',
                    zIndex: 0,
                    width: '100%',
                    height: '100vh',
                  }}
                  params={{
                    particles: {
                      number: {
                        value: 20,
                        density: {
                          enable: true,
                          value_area: 150,
                        },
                      },
                    },
                  }}
                />
              </div>
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
          <Grid item xs={12} sm={6} md={6} lg={5} style={{ zIndex: 20 }}>
            <Paper elevation={16} className={classes.loginContainer}>
              <Switch>
                <Route path="/login/signout" component={Signout} />
                <Route path="/login/reset_password" component={ResetPassword} />
                <Route path="/login/pro" component={LoginPro} />
                <Route path="/login/customer" component={LoginConsumer} />
                <Route path="/login/reset_password" component={ResetPassword} />
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
    membership: parse(props.location.search).membership,
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
