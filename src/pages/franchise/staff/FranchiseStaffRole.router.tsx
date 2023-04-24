// @ts-nocheck
import React from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import asyncComponent from '../../../AsyncComponent';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

const FranchiseStaffListPage = asyncComponent(
  () => import('./FranchiseStaffList.page'),
);
const FranchiseRoleListPage = asyncComponent(
  () => import('./FranchiseRoleList.page'),
);

type Props = {
  tab: 'staff' | 'role';
  pageHeight: number;
} & WithTranslation &
  ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.franchise.staff.staffAccount', value: 'staff' },
  { label: 'tab.franchise.staff.role', value: 'role' },
]);

const SettingsWidget: React.FC<Props> = ({
  tab,
  pushToFranchiseStaffRoleTab,
  pageHeight,
}) => {
  return (
    <ContentWithAppBar
      tab={tab}
      onChange={pushToFranchiseStaffRoleTab}
      pageHeight={pageHeight}
      tabsData={tabsData}
    >
      <Switch>
        <Route
          exact
          path="/f/staffrole/staff"
          component={FranchiseStaffListPage}
        />
        <Route
          exact
          path="/f/staffrole/role"
          component={FranchiseRoleListPage}
        />
        <Redirect to="/f/staffrole/staff" />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(() => ({}), {
  pushToFranchiseStaffRoleTab: (newTab: string) =>
    pushFunc(`/f/staffrole/${newTab}`),
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('franchise'),
  withPageHeightHOC(),
)(SettingsWidget);
