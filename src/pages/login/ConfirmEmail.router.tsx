// @ts-nocheck
import React from 'react';
import { compose, withProps } from 'recompose';

import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { useTranslation } from 'react-i18next';
import { BsportRequestFromHeaderValue } from '../../constants';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';
import asyncComponent from '../../AsyncComponent';
import withQueryParams from '#hocs/with-query-params.hoc';
import themeSelectors from '#libs/theme/selectors';
import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '#libs/theme/actions';
import LoginBackground from '#libs/login/components/LoginBackground.component';
import LanguageButton from '../../components/button/LanguageButton.component';
import { Theme } from '#libs/theme/types';
import { refreshValidationEmailStatus as refreshValidationEmailStatusAction } from '#libs/login/actions';

import namespaces from '../../i18n/namespaces.json';

import './ConfirmEmailRouterStyles.css';

const ConfirmingEmailPage = asyncComponent(
  () => import('./ConfirmingEmail.page'),
);
const EmailConfirmationPage = asyncComponent(
  () => import('./email-confirmation/EmailConfirmation.page'),
);

type Props = {
  theme: Theme;
  simplifyUI?: boolean;
};

export const ConfirmEmailRouter = (props: Props) => {
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_EMAIL_CONFIRMATION);

  const { refreshValidationEmailStatus, theme } = props;
  useTranslation(namespaces);

  let src: string = 'https://cdn.bsport.io/bsport_logo_txt.png';
  let alt: string = 'bsport-logo';

  if (theme) {
    src = theme.cover;
    alt = `${theme.company_name} - logo`;
  }

  React.useEffect(() => {
    refreshValidationEmailStatus();
  }, [refreshValidationEmailStatus]);

  return (
    <MuiThemeProvider theme={getTheme(theme)}>
      {!props.simplifyUI && (
        <Hidden xsDown>
          <LoginBackground company backgroundFixed />
          <Fade in>
            <div className="bs-confirm-email-header">
              <img
                src={src}
                className="bs-confirm-email-header__logo"
                alt={alt}
              />

              <LanguageButton />
            </div>
          </Fade>
        </Hidden>
      )}
      <Switch>
        <Route
          path="/login/email_confirmation/:uuid/"
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
      refreshValidationEmailStatus: refreshValidationEmailStatusAction,
    },
  ),
)(ConfirmEmailRouter);
