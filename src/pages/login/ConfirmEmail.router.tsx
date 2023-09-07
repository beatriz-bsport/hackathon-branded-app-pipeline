import React from 'react';
import { compose, withProps } from 'recompose';

import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import { useTranslation } from 'react-i18next';
import { BsportRequestFromHeaderValue } from '../../constants';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
// @ts-expect-error
import withQueryParams from '#hocs/with-query-params.hoc';
import themeSelectors, { getIsUISimplified } from '#libs/theme/selectors';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import LoginBackground from '#libs/login/components/LoginBackground.component';
// @ts-expect-error
import LanguageButton from '../../components/button/LanguageButton.component';
import { Theme } from '#libs/theme/types';
import { refreshValidationEmailStatus as refreshValidationEmailStatusAction } from '#libs/login/actions';
// @ts-expect-error
import namespaces from '../../i18n/namespaces.json';
import { RootState } from '../../reducers';
import './ConfirmEmailRouterStyles.css';
import withThemeProvider from '#hocs/company-themifier.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

const ConfirmingEmailPage = asyncComponent(
  () => import('./ConfirmingEmail.page'),
);
const EmailConfirmationPage = asyncComponent(
  () => import('./email-confirmation/EmailConfirmation.page'),
);

type Props = {
  theme: Theme;
  simplifyUI?: boolean;
  refreshValidationEmailStatus: () => void;
  companyId: number;
} & ConnectedProps<typeof connector>;

export const ConfirmEmailRouter: React.FC<Props> = ({
  theme,
  simplifyUI,
  refreshValidationEmailStatus,
  companyId,
  fetchCompanyTheme,
}) => {
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_EMAIL_CONFIRMATION);

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

  React.useEffect(() => {
    if (companyId) {
      fetchCompanyTheme(companyId);
    }
  }, [fetchCompanyTheme, companyId]);

  return (
    <>
      {!simplifyUI && (
        <Hidden xsDown>
          <LoginBackground company />
          <Fade in>
            <div className="bs-confirm-email-header">
              <img
                alt={alt}
                className="bs-confirm-email-header__logo"
                src={src}
              />

              <LanguageButton />
            </div>
          </Fade>
        </Hidden>
      )}
      <Switch>
        <Route
          component={ConfirmingEmailPage}
          path="/login/email_confirmation/:uuid/"
        />
        <Route
          component={EmailConfirmationPage}
          path="/login/email_confirmation/"
        />
      </Switch>
    </>
  );
};

const connector = connect(
  (state: RootState, companyId: number) => ({
    theme: themeSelectors.getTheme(state),
    simplifyUI: !!companyId && getIsUISimplified(state),
  }),
  {
    fetchCompanyTheme: fetchCompanyThemeAction,
    refreshValidationEmailStatus: refreshValidationEmailStatusAction,
  },
);

export default compose(
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  connector,
  React.memo,
  withThemeProvider,
  marketplaceCssHoc(),
)(ConfirmEmailRouter);
