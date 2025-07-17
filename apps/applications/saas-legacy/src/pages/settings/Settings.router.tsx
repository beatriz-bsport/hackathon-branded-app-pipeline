import React from 'react';

import { connect, ConnectedProps, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';

import PaymentRuleSetsDashboard from '#src/pages/settings/PaymentRuleSetsDashboard.page';
import CompanyDetailPage from '#src/pages/settings/CompanyDetailPage.page';
import RoleConfigurationPage from '#src/pages/settings/RoleConfiguration.page';
import InvoiceConfigurationPage from '#src/pages/settings/InvoiceConfigurationPage.page';
// @ts-expect-error
import WaitingListConfigurationPage from '#src/pages/settings/WaitingListConfigurationPage.page';
import BroadcastConfiguration from '#src/pages/settings/BroadcastConfiguration.page';
// @ts-expect-error
import ShopConfigurationPage from '#src/pages/settings/ShopConfigurationPage.page';
// @ts-expect-error
import ThemeConfigurationPage from '#src/pages/settings/ThemeConfiguration.page';
import CoachPlaceSettingsPage from '#src/pages/settings/CoachPlaceSettings.page';
// @ts-expect-error
import WebhookConfigurationPage from '#src/pages/settings/WebhookConfigurationPage.page';
import NotificationRulePage from '#src/pages/settings/NotificationRule.page';
import NotificationRuleDetailPage from '#src/pages/settings/NotificationRuleDetail.page';
import PartnershipPage from '#src/pages/settings/Partnership.page';
import ActiveCampaignPage from '#src/pages/settings/ActiveCampaignPage.page';
import EditReferralProgramSettingsPage from '#src/pages/settings/EditReferralProgramSettingsPage.page';
// @ts-expect-error
import CompanyOnboardingSettingPage from '#src/pages/settings/CompanyOnboardingSetting.page';
import PlatformBillingSettingPage from '#src/pages/settings/PlatformBillingSetting.page';
import PaymentMethodSettings from '#src/pages/settings/PaymentMethodSettings.page';
import MarketplaceSettings from '#src/pages/settings/MarketplaceSettings.page';
import CustomSignUpConfiguration from '#src/pages/settings/CustomSignUpConfiguration.page';
import WidgetRouter from '#src/pages/settings/SettingsWidget.router';
import QuickBookPage from '#src/pages/settings/QuickBooks.page';
import Quicksale from '#src/pages/settings/quicksale';

import withTitle from '#src/hocs/with-title.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import SettingsMobileRouter from '#src/pages/settings/SettingsMobile.router';
import SettingsPersonalization from '#src/pages/settings/SettingsPersonalization.router';
import themeSelectors from '#src/libs/theme/selectors';
import { RootState } from '#src/reducers';

type SettingsRouterConnectedProps = ConnectedProps<typeof connector>;

export const Settings: React.FC<SettingsRouterConnectedProps> = () => {
  const displayNewWebshop = useSelector(
    (state: RootState) => themeSelectors.getTheme(state).display_new_webshop,
  );

  return (
    <Switch>
      <Route
        exact
        component={ThemeConfigurationPage}
        path="/settings/general"
      />

      <Route
        exact
        component={MarketplaceSettings}
        path="/settings/marketplace-settings"
      />

      <Route component={WidgetRouter} path="/settings/widget/:tab" />

      <Route
        exact
        component={NotificationRulePage}
        path="/settings/notification-rule"
      />
      <Route
        exact
        component={NotificationRuleDetailPage}
        path="/settings/notification-rule/:eventName"
      />
      <Route exact component={CompanyDetailPage} path="/settings/company" />
      <Route exact component={RoleConfigurationPage} path="/settings/role" />
      <Route
        exact
        component={InvoiceConfigurationPage}
        path="/settings/invoice"
      />
      <Route
        exact
        component={PaymentRuleSetsDashboard}
        path="/settings/payment-rules"
      />
      <Route
        exact
        component={PaymentMethodSettings}
        path="/settings/payment-methods"
      />
      <Route
        exact
        component={BroadcastConfiguration}
        path="/settings/broadcast"
      />
      <Route
        exact
        component={WaitingListConfigurationPage}
        path="/settings/waiting-list"
      />
      {!displayNewWebshop && (
        <Route exact component={ShopConfigurationPage} path="/settings/shop" />
      )}
      <Route exact component={ThemeConfigurationPage} path="/settings/theme" />
      <Route
        component={SettingsPersonalization}
        path={['/settings/personalization/:tab', '/settings/personalization']}
      />
      <Route
        component={SettingsMobileRouter}
        path="/settings/mobile-personalisation/:tab"
      />

      <Route
        exact
        component={CustomSignUpConfiguration}
        path="/settings/forms"
      />
      <Route
        exact
        component={WebhookConfigurationPage}
        path="/settings/webhook"
      />
      <Route exact component={PartnershipPage} path="/settings/partnership" />
      <Route exact component={QuickBookPage} path="/settings/quickbooks" />
      <Route
        exact
        component={ActiveCampaignPage}
        path="/settings/active-campaign"
      />
      <Route
        exact
        component={EditReferralProgramSettingsPage}
        path="/settings/referral"
      />
      <Route
        exact
        component={CompanyOnboardingSettingPage}
        path="/settings/company_onboarding"
      />
      <Route
        exact
        component={PlatformBillingSettingPage}
        path="/settings/platform-billing"
      />
      <Route
        exact
        component={CoachPlaceSettingsPage}
        path="/settings/coach-userspace"
      />
      <Route component={Quicksale} path="/settings/quicksale" />
      <Route
        component={() => <Redirect to="/settings/general" />}
        path="/settings"
      />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    companyId: state.theme.theme.company,
  }),
  { push },
);

export default compose(
  withTranslation(['settings']),
  // @ts-expect-error
  routerParamsToProps({ tab: 'tab' }),
  withRouter,
  connector,
  withTitle(({ t }: { t: TFunction }) => t('titles:settings')),
)(Settings);
