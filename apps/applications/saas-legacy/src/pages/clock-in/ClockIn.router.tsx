import React, { memo, useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withTitle from '#src/hocs/with-title.hoc';
import { getPermissions } from '#src/libs/role/selectors';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import { RolePermission } from '#src/libs/role/types';
import { RootState } from '../../reducers';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

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
        <Route exact component={ClockInRealTime} path="/clock-in/real-time" />
        <Route exact component={ClockInHistory} path="/clock-in/history" />
        <Redirect to="/clock-in/real-time" />
      </Switch>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.clockInForOther) {
    return (
      <Switch>
        <Route exact component={ClockInRealTime} path="/clock-in/real-time" />
        <Redirect to="/clock-in/real-time" />
      </Switch>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory) {
    return (
      <Switch>
        <Route exact component={ClockInHistory} path="/clock-in/history" />
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
      onChange={onChange}
      pageHeight={pageHeight}
      tab={tab}
      // @ts-expect-error
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
    // @ts-expect-error
    tab: 'tab',
  }),
  withTranslation('clockIn'),
  withTitle(({ t }) => t('pageTitle')),
  withPageHeightHOC(),
)(ClockInRouter);
