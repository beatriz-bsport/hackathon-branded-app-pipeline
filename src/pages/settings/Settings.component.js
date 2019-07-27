// @flow

import React from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import PaymentRuleSetsDashboard from './PaymentRuleSetsDashboard.component';
import CompanyDetailPage from './CompanyDetailPage.component';
import InvoiceConfigurationPage from './InvoiceConfigurationPage.component';
import WaitingListConfigurationPage from './WaitingListConfigurationPage.component';

import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

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
      <AppBar position="static" color="default">
        <Tabs
          value={props.tab}
          onChange={(ev, value) => props.push(`/settings/${value}/`)}
        >
          <Tab label={t('tab.paymentRules')} value="payment-rules" />
          <Tab label={t('tab.company')} value="company" />
          <Tab label={t('tab.invoice')} value="invoice" />
          <Tab label={t('tab.waitingList')} value="waiting-list" />
        </Tabs>
      </AppBar>
      <Switch>
        <Route exact path="/settings/company" component={CompanyDetailPage} />
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
      </Switch>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    marginTop: -theme.spacing.unit * 2,
    marginLeft: -theme.spacing.unit * 3,
    marginRight: -theme.spacing.unit * 3,
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
  withDrawer(({ t }: { t: TFunction }) => t('pageTitle')),
)(Settings);
