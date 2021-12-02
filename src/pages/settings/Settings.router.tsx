import React from 'react';

import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';

import PaymentRuleSetsDashboard from './PaymentRuleSetsDashboard.page';
import CompanyDetailPage from './CompanyDetailPage.page';
import RoleConfigurationPage from './RoleConfiguration.page';
import InvoiceConfigurationPage from './InvoiceConfigurationPage.page';
import WaitingListConfigurationPage from './WaitingListConfigurationPage.page';
import BroadcastConfiguration from './BroadcastConfiguration.page';
import ShopConfigurationPage from './ShopConfigurationPage.page';
import ThemeConfigurationPage from './ThemeConfiguration.page';
import SettingsPersonalizePage from './SettingsPersonalizePage.page';
import WebhookConfigurationPage from './WebhookConfigurationPage.page';
import NotificationRulePage from './NotificationRule.page';
import NotificationRuleDetailPage from './NotificationRuleDetail.page';
import PartnershipPage from './Partnership.page';
import ActiveCampaignPage from './ActiveCampaignPage.page';
import CompanyOnboardingSettingPage from './CompanyOnboardingSetting.page';
import PlatformBillingSettingPage from './PlatformBillingSetting.page';
import PaymentMethodSettings from './PaymentMethodSettings/PaymentMethodSettings.pages';
import MarketplaceSettings from './MarketplaceSettings.page';
import CustomSignUpConfiguration from './CustomSignUpConfiguration.page';
import WidgetGeneratorPage from './WidgetGenerator.page';
import QuickBookPage from './QuickBooks.page';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {};

export const Settings = () => {
  return (
    <Switch>
      <Route
        exact
        path="/settings/general"
        component={ThemeConfigurationPage}
      />

      <Route
        exact
        path="/settings/marketplace-settings"
        component={MarketplaceSettings}
      />

      <Route exact path="/settings/widget" component={WidgetGeneratorPage} />

      <Route
        exact
        path="/settings/notification-rule"
        component={NotificationRulePage}
      />
      <Route
        exact
        path="/settings/notification-rule/:eventName"
        component={NotificationRuleDetailPage}
      />
      <Route exact path="/settings/company" component={CompanyDetailPage} />
      <Route exact path="/settings/role" component={RoleConfigurationPage} />
      <Route
        exact
        path="/settings/invoice"
        component={InvoiceConfigurationPage}
      />
      <Route
        exact
        path="/settings/payment-rules"
        component={PaymentRuleSetsDashboard}
      />
      <Route
        exact
        path="/settings/payment-methods"
        component={PaymentMethodSettings}
      />
      <Route
        exact
        path="/settings/broadcast"
        component={BroadcastConfiguration}
      />
      <Route
        exact
        path="/settings/waiting-list"
        component={WaitingListConfigurationPage}
      />
      <Route exact path="/settings/shop" component={ShopConfigurationPage} />
      <Route exact path="/settings/theme" component={ThemeConfigurationPage} />
      <Route
        exact
        path="/settings/personalization"
        component={SettingsPersonalizePage}
      />
      <Route
        exact
        path="/settings/forms"
        component={CustomSignUpConfiguration}
      />
      <Route
        exact
        path="/settings/webhook"
        component={WebhookConfigurationPage}
      />
      <Route exact path="/settings/partnership" component={PartnershipPage} />
      <Route exact path="/settings/quickbooks" component={QuickBookPage} />
      <Route
        exact
        path="/settings/active-campaign"
        component={ActiveCampaignPage}
      />
      <Route
        exact
        path="/settings/company_onboarding"
        component={CompanyOnboardingSettingPage}
      />
      <Route
        exact
        path="/settings/platform-billing"
        component={PlatformBillingSettingPage}
      />
      <Route
        path="/settings"
        component={() => <Redirect to="/settings/general" />}
      />
    </Switch>
  );
};

export default compose<any, Props>(
  withTranslation(['settings']),
  routerParamsToProps({ tab: 'tab' }),
  withRouter,
  connect(null, { push }),
  withTitle(({ t }: { t: TFunction }) => t('titles:settings')),
)(Settings);
