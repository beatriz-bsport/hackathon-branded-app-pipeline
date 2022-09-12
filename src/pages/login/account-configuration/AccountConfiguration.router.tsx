import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Route, Switch } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import { compose } from 'recompose';
import { RootState } from '../../../reducers';
import WelcomeStepPage from './AccountConfigurationWelcomeStep.page';
import PaymentMethodStepPage from './AccountConfigurationPaymentMethodStep.page';
import AccountConfigurationFinalStepPage from './AccountConfigurationFinalStep.page';
import AccountConfigurationStepSwitcherRouter from './AccountConfigurationStepSwitcher.router';
import { retrieveStripeCompanyAction } from '#libs/company/actions';
import AccountConfigurationStripeStepPage from './AccountConfigurationStripeStep.page';
import AccountConfigurationBankAccountStepPage from './AccountConfigurationBankAccountStep.page';
import LanguageButton from '../../../components/button/LanguageButton.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import themeSelectors from '#libs/theme/selectors';
import CompanyThemifierHoc from '#hocs/company-themifier.hoc';

export const AccountConfigurationWelcomeStepUrl =
  '/login/accountConfiguration/welcome/';

export const AccountConfigurationStripeStepUrl =
  '/login/accountConfiguration/stripeStep/';

export const AccountConfigurationBankAccountStepUrl =
  '/login/accountConfiguration/bankAccountStep/';

export const AccountConfigurationPaymentMethodStepUrl =
  '/login/accountConfiguration/paymentMethodStep/';

export const AccountConfigurationFinalStepUrl =
  '/login/accountConfiguration/finalStep/';

export const AccountConfiguration: React.FC<
  ConnectedProps<typeof connector>
> = ({ retrieveStripeCompany, fetchCompanyTheme, stripeCompany, theme }) => {
  const classes = useStyles();

  React.useEffect(() => {
    retrieveStripeCompany({ refreshed: true });
    fetchCompanyTheme();
  }, [retrieveStripeCompany, fetchCompanyTheme]);

  if (!stripeCompany || !theme) {
    return <LinearProgress />;
  }
  const {
    has_completed_stripe_configuration,
    has_completed_bank_account_configuration,
    has_completed_payment_method_configuration,
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
    has_completed_account_configuration_on_boarding,
  } = stripeCompany;

  if (
    has_completed_account_configuration_on_boarding ||
    (has_no_need_for_stripe_configuration &&
      has_no_need_for_payment_method_configuration &&
      has_no_need_for_bank_account_configuration)
  ) {
    return <Route path="/" component={AccountConfigurationFinalStepPage} />;
  }
  const bankAccountStepCompletedOrNotMandatory =
    has_completed_bank_account_configuration ||
    has_no_need_for_stripe_configuration ||
    has_no_need_for_bank_account_configuration;

  const stripeConfigurationStepCompletedOrNotMandatory =
    has_completed_stripe_configuration || has_no_need_for_stripe_configuration;

  const paymentMethodStepCompletedOrNotMandatory =
    has_completed_payment_method_configuration ||
    has_no_need_for_payment_method_configuration;

  const need_stripe_configuration = !has_no_need_for_stripe_configuration;

  const need_bank_account_configuration =
    !has_no_need_for_bank_account_configuration;

  const need_payment_method_configuration =
    !has_no_need_for_payment_method_configuration;

  const src = 'https://cdn.bsport.io/bsport_logo_txt.png';
  const alt = 'bsport-logo';

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <img src={src} className={classes.logo} alt={alt} />
        <LanguageButton noLabel />
      </div>
      <Switch>
        <Route
          path={AccountConfigurationWelcomeStepUrl}
          component={WelcomeStepPage}
        />
        {need_stripe_configuration && (
          <Route
            path={AccountConfigurationStripeStepUrl}
            component={AccountConfigurationStripeStepPage}
          />
        )}

        {need_bank_account_configuration &&
          has_completed_stripe_configuration && (
            <Route
              path={AccountConfigurationBankAccountStepUrl}
              component={AccountConfigurationBankAccountStepPage}
            />
          )}

        {need_payment_method_configuration &&
          stripeConfigurationStepCompletedOrNotMandatory &&
          bankAccountStepCompletedOrNotMandatory && (
            <Route
              path={AccountConfigurationPaymentMethodStepUrl}
              component={PaymentMethodStepPage}
            />
          )}
        {stripeConfigurationStepCompletedOrNotMandatory &&
          bankAccountStepCompletedOrNotMandatory &&
          paymentMethodStepCompletedOrNotMandatory && (
            <Route
              path={AccountConfigurationFinalStepUrl}
              component={AccountConfigurationFinalStepPage}
            />
          )}
        <Route path="/" component={AccountConfigurationStepSwitcherRouter} />
      </Switch>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  header: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    display: 'flex',
    padding: theme.spacing(2),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: 38,
  },

  container: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    top: '0%',
    left: '0%',
    position: 'absolute',
    [theme.breakpoints.down('xs')]: {
      position: 'unset',
    },
  },
}));
const connector = connect(
  (state: RootState) => ({
    stripeCompany: state.company.stripeCompany.data,
    theme: themeSelectors.getTheme(state),
  }),
  {
    retrieveStripeCompany: retrieveStripeCompanyAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
  },
);
export default compose(connector, CompanyThemifierHoc)(AccountConfiguration);
