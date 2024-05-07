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
// @ts-expect-error
import WaitingListConfigurationPage from './WaitingListConfigurationPage.page';
import BroadcastConfiguration from './BroadcastConfiguration.page';
// @ts-expect-error
import ShopConfigurationPage from './ShopConfigurationPage.page';
// @ts-expect-error
import ThemeConfigurationPage from './ThemeConfiguration.page';
import CoachPlaceSettingsPage from './CoachPlaceSettings.page';
// @ts-expect-error
import SettingsPersonalizePage from './SettingsPersonalizePage.page';
// @ts-expect-error
import WebhookConfigurationPage from './WebhookConfigurationPage.page';
import NotificationRulePage from './NotificationRule.page';
import NotificationRuleDetailPage from './NotificationRuleDetail.page';
import PartnershipPage from './Partnership.page';
import ActiveCampaignPage from './ActiveCampaignPage.page';
import EditReferralProgramSettingsPage from './EditReferralProgramSettingsPage.page';
// @ts-expect-error
import CompanyOnboardingSettingPage from './CompanyOnboardingSetting.page';
import PlatformBillingSettingPage from './PlatformBillingSetting.page';
import PaymentMethodSettings from './PaymentMethodSettings.page';
import MarketplaceSettings from './MarketplaceSettings.page';
import CustomSignUpConfiguration from './CustomSignUpConfiguration.page';
import WidgetRouter from './SettingsWidget.router';
import QuickBookPage from './QuickBooks.page';
import Quicksale from './quicksale';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import SettingsMobileRouter from './SettingsMobile.router';
import SettingsPersonalization from './SettingsPersonalization.router';
import { displayReworkedMemberProfile } from '#libs/consumer-space/constants';

type Props = {};

export const Settings = () => {
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
      <Route exact component={ShopConfigurationPage} path="/settings/shop" />
      <Route exact component={ThemeConfigurationPage} path="/settings/theme" />
      {displayReworkedMemberProfile ? (
        <Route
          component={SettingsPersonalization}
          path={['/settings/personalization/:tab', '/settings/personalization']}
        />
      ) : (
        <Route
          exact
          component={SettingsPersonalizePage}
          path="/settings/personalization"
        />
      )}
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
      <Route
        component={Quicksale}
        path={['/settings/quicksale/:tab', '/settings/quicksale']}
      />
      <Route
        component={() => <Redirect to="/settings/general" />}
        path="/settings"
      />
    </Switch>
  );
};

export default compose<any, Props>(
  withTranslation(['settings']),
  // @ts-expect-error
  routerParamsToProps({ tab: 'tab' }),
  withRouter,
  connect(null, { push }),
  withTitle(({ t }: { t: TFunction }) => t('titles:settings')),
)(Settings);
