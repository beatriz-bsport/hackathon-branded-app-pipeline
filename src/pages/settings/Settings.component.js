// @flow

import React from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import PaymentRuleSetsDashboard from './PaymentRuleSetsDashboard.component';
import CompanyDetailPage from './CompanyDetailPage.component';
import RoleConfigurationPage from './RoleConfiguration.component';
import InvoiceConfigurationPage from './InvoiceConfigurationPage.component';
import WaitingListConfigurationPage from './WaitingListConfigurationPage.component';
import ShopConfigurationPage from './ShopConfigurationPage.component';
import ThemeConfigurationPage from './ThemeConfiguration.component';
import SettingsPersonalizePage from './SettingsPersonalizePage.component';
import WebhookConfigurationPage from './WebhookConfigurationPage.component';
import NotificationRulePage from './NotificationRule.page';
import PartnershipPage from './Partnership.page';
import ActiveCampaignPage from './ActiveCampaignPage.component';

import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { drawerWidth } from '../../components/navigation/ResponsiveDrawer.component';

type Props = {
  t: TFunction,
  push: (string) => void,
  tab: string,
  classes: *,
};

export const Settings = (props: Props) => {
  const { t, classes } = props;
  return (
    <div className={classes.container}>
      <AppBar className={classes.appBar} position="static" color="default">
        <Tabs
          value={props.tab}
          variant="scrollable"
          onChange={(ev, value) => props.push(`/settings/${value}/`)}
        >
          <Tab label={t('tab.general')} value="general" />
          <Tab label={t('tab.role')} value="role" />
          <Tab label={t('tab.personalization')} value="personalization" />
          <Tab label={t('tab.notificationRule')} value="notification-rule" />
          <Tab label={t('tab.paymentRules')} value="payment-rules" />
          <Tab label={t('tab.company')} value="company" />
          <Tab label={t('tab.invoice')} value="invoice" />
          <Tab label={t('tab.waitingList')} value="waiting-list" />
          <Tab label={t('tab.shop')} value="shop" />
          <Tab label={t('tab.webhook')} value="webhook" />
          <Tab label={t('tab.partnership')} value="partnership" />
          <Tab label={t('tab.active_campaign')} value="active-campaign" />
        </Tabs>
      </AppBar>
      <Switch>
        <Route
          exact
          path="/settings/general"
          component={ThemeConfigurationPage}
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
      </Switch>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    maxWidth: '100vw',
    marginTop: -theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing.unit * 3,
      marginRight: -theme.spacing.unit * 3,
    },
  },
  appBar: {
    marginTop: -theme.spacing.unit * 2,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: `calc(100vw - ${drawerWidth}px)`,
    },
  },
});

export default compose(
  withNamespaces(['settings']),
  withStyles(styles),
  routerParamsToProps({ tab: 'tab' }),
  withRouter,
  connect(
    null,
    { push },
  ),
  withTitle(({ t }: { t: TFunction }) => t('titles:settings')),
)(Settings);
