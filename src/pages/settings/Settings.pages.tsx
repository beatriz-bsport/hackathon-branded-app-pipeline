import React from 'react';

import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import { Theme } from '@material-ui/core';


import withStyles from '@material-ui/core/styles/withStyles';

import PaymentRuleSetsDashboard from './PaymentRuleSetsDashboard.component.js';
import CompanyDetailPage from './CompanyDetailPage.component.js';
import RoleConfigurationPage from './RoleConfiguration.component.js';
import InvoiceConfigurationPage from './InvoiceConfigurationPage.component.js';
import WaitingListConfigurationPage from './WaitingListConfigurationPage.component.js';
import BroadcastConfiguration from './BroadcastConfiguration.page.js';
import ShopConfigurationPage from './ShopConfigurationPage.component.js';
import ThemeConfigurationPage from './ThemeConfiguration.component.js';
import SettingsPersonalizePage from './SettingsPersonalizePage.component.js';
import WebhookConfigurationPage from './WebhookConfigurationPage.component.js';
import NotificationRulePage from './NotificationRule.page.js';
import PartnershipPage from './Partnership.page.js';
import ActiveCampaignPage from './ActiveCampaignPage.component';
import CompanyOnboardingSettingPage from './CompanyOnboardingSetting.page.js';
import PlatformBillingSettingPage from './PlatformBillingSetting.page.js';
import MarketplaceSettings from './MarketplaceSettingsPages/MarketplaceSettings.pages.tsx';

import withTitle from '../../hocs/with-title.hoc.js';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc.js';

import { drawerWidth } from '../../components/navigation/ResponsiveDrawer.component.js';

type Props = {
  classes: any,
};

export const Settings = (props: Props) => {
  const { classes } = props;
  return (
    <div className={classes.container}>
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

        <Route
          exact
          path="/settings/notification-rule"
          component={NotificationRulePage}
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
          path="/settings/broadcast"
          component={BroadcastConfiguration}
        />
        <Route
          exact
          path="/settings/waiting-list"
          component={WaitingListConfigurationPage}
        />
        <Route exact path="/settings/shop" component={ShopConfigurationPage} />
        <Route
          exact
          path="/settings/theme"
          component={ThemeConfigurationPage}
        />
        <Route
          exact
          path="/settings/personalization"
          component={SettingsPersonalizePage}
        />
        <Route
          exact
          path="/settings/webhook"
          component={WebhookConfigurationPage}
        />
        <Route exact path="/settings/partnership" component={PartnershipPage} />
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
    </div>
  );
};

const styles = (theme: Theme) => ({
  container: {
    maxWidth: '100vw',
    marginTop: -theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing(3),
      marginRight: -theme.spacing(3),
    },
  },
  appBar: {
    marginTop: -theme.spacing(2),
    width: '100%',

    [theme.breakpoints.up('md')]: {
      width: `calc(100vw - ${drawerWidth}px)`,
    },
  },
});

export default compose(
  withTranslation(['settings']),
  withStyles(styles),
  routerParamsToProps({ tab: 'tab' }),
  withRouter,
  connect(null, { push }),
  withTitle(({ t }: { t: TFunction }) => t('titles:settings'))
)(Settings);
