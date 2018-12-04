// @flow

import React, { Component } from 'react';

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

type Props = {
  t: TFunction,
  push: (string) => void,
  classes: *,
};
type State = {
  tab: 'payment-rules' | 'settings',
};

export class Settings extends Component<Props, State> {
  state = {
    tab: 'payment-rules',
  };

  handleChange = (event, value) => {
    this.setState({ tab: value });
    this.props.push(`/settings/${value}`);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default">
          <Tabs value={this.state.tab} onChange={this.handleChange}>
            <Tab label={t('tab.paymentRules')} value="payment-rules" />
            <Tab label={t('tab.company')} value="company" />
          </Tabs>
        </AppBar>
        <Switch>
          <Route exact path="/settings/company" component={CompanyDetailPage} />
          <Route
            exact
            path="/settings/payment-rules"
            component={PaymentRuleSetsDashboard}
          />
        </Switch>
      </div>
    );
  }
}

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
  withRouter,
  connect(
    null,
    { push },
  ),
)(Settings);
