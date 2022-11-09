import React from 'react';
import { compose, withProps } from 'recompose';

import { connect } from 'react-redux';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import asyncComponent from '../../AsyncComponent';
import withQueryParams from '#hocs/with-query-params.hoc';
import themeSelectors from '#libs/theme/selectors';
import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '#libs/theme/actions';
import LoginBackgroundComponent from '#libs/login/components/LoginBackground.component';
import LanguageButton from '../../components/button/LanguageButton.component';
import { Theme } from '#libs/theme/types';

const ConfirmingEmailPage = asyncComponent(
  () => import('./ConfirmingEmail.page'),
);
const EmailConfirmationPage = asyncComponent(
  () => import('./EmailConfirmation.page'),
);

type Props = {
  theme: Theme;
};

export const ConfirmEmailRouter = (props: Props) => {
  let src: string = 'https://cdn.bsport.io/bsport_logo_txt.png';
  let alt: string = 'bsport-logo';
  if (props.theme) {
    src = props.theme.cover;
    alt = `${props.theme.company_name} - logo`;
  }
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={getTheme(props.theme)}>
      <Hidden xsDown>
        <LoginBackgroundComponent company />
        <Fade in>
          <div className={classes.header}>
            <img src={src} className={classes.logo} alt={alt} />

            <LanguageButton />
          </div>
        </Fade>
      </Hidden>
      <Switch>
        <Route
          path="/login/email_confirmation/:uuid/:token"
          component={ConfirmingEmailPage}
        />
        <Route
          path="/login/email_confirmation/"
          component={EmailConfirmationPage}
        />
      </Switch>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    zIndex: 2,
  },
  header: {
    display: 'flex',
    position: 'absolute',
    padding: theme.spacing(5),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9,
  },
  logo: {
    height: 50,
  },
}));
export default compose(
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchCompanyTheme,
    },
  ),
)(ConfirmEmailRouter);
