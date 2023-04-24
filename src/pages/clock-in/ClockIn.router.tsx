// @ts-nocheck
import React, { memo, useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import asyncComponent from '../../AsyncComponent';
import { RootState } from '../../reducers';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';
import { getPermissions } from '#libs/role/selectors';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import { RolePermission } from '#libs/role/types';

const ClockInRealTime = asyncComponent(() => import('./ClockInRealTime.page'));
const ClockInHistory = asyncComponent(() => import('./ClockInHistory.page'));

type Props = {
  tab: 'real-time' | 'history';
  pageHeight: number;
} & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.clockIn.realTime', value: 'real-time' },
  { label: 'tab.clockIn.history', value: 'history' },
]);

const ClockInSwitcher: React.FC<{
  permissions: RolePermission;
}> = memo(({ permissions }) => {
  if (
    permissions?.navigationMenu?.payments?.clockIn?.clockInForOther &&
    permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory
  ) {
    return (
      <Switch>
        <Route exact path="/clock-in/real-time" component={ClockInRealTime} />
        <Route exact path="/clock-in/history" component={ClockInHistory} />
        <Redirect to="/clock-in/real-time" />
      </Switch>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.clockInForOther) {
    return (
      <Switch>
        <Route exact path="/clock-in/real-time" component={ClockInRealTime} />
        <Redirect to="/clock-in/real-time" />
      </Switch>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory) {
    return (
      <Switch>
        <Route exact path="/clock-in/history" component={ClockInHistory} />
        <Redirect to="/clock-in/history" />
      </Switch>
    );
  }

  return <Redirect to="/" />;
});

const ClockInRouter: React.FC<Props> = ({
  permissions,
  tab,
  push,
  pageHeight,
}) => {
  const onChange = useCallback(
    (newTab: string) => {
      push(`/clock-in/${newTab}`);
    },
    [push],
  );

  const isNavBar =
    permissions?.navigationMenu?.payments?.clockIn?.clockInForOther &&
    permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory;

  return (
    <ContentWithAppBar
      tab={tab}
      onChange={onChange}
      pageHeight={pageHeight}
      tabsData={isNavBar ? tabsData : []}
    >
      <ClockInSwitcher permissions={permissions} />
    </ContentWithAppBar>
  );
};

const connector = connect(
  (state: RootState) => ({
    permissions: getPermissions(state),
  }),
  {
    push: pushFunc,
  },
);

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('clockIn'),
  withTitle(({ t }) => t('pageTitle')),
  withPageHeightHOC(),
)(ClockInRouter);
