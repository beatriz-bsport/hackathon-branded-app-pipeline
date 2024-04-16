import React, { useCallback, useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import Immutable from 'seamless-immutable';
import { makeStyles } from '@material-ui/core';

import withPageHeightHOC, { WithPageHeight } from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { getPermissions } from '#libs/role/selectors';
import MemberVisit from './MemberVisit.page';
import LiveHistory from './LiveHistory.page';
import AccessControlSettings from './AccessControlSettings.page';

import type { RootState } from '../../reducers';
import type { RolePermission } from '#libs/role/types';
import {
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';

type TabType = 'perform' | 'monitor' | 'settings';

type Props = {
  tab: TabType;
} & ConnectedProps<typeof connector> &
  WithPageHeight &
  WithTranslation;

/**
 * This component is responsible for switching between the tabs of the Access Monitoring page.
 *
 * According to the user permissions, it will render the tabs that the user has access to.
 * If the user has no access to any tab, it will redirect to the home page.
 */
const AccessMonitoringSwitcher: React.FC<{ permissions: RolePermission }> = ({
  permissions,
}) => {
  const { accessMonitoring: accessMonitoringPermissions } =
    permissions?.navigationMenu || {};

  const paths = {
    perform: '/access-monitoring/perform',
    monitor: '/access-monitoring/monitor',
    settings: '/access-monitoring/settings',
  };

  const components = {
    perform: <MemberVisit />,
    monitor: <LiveHistory />,
    settings: <AccessControlSettings />,
  };

  const routes = Object.keys(paths).map((key) => ({
    key,
    path: paths[key as TabType],
    component: components[key as TabType],
  }));

  // The routes the user has access to
  const routesFiltered = routes.filter(
    ({ key }) => accessMonitoringPermissions?.[key as TabType],
  );

  if (!routesFiltered?.length) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      {routesFiltered.map(({ path, component }) => (
        <Route key={path} exact path={path}>
          {component}
        </Route>
      ))}
      <Redirect to={routesFiltered[0].path} />
    </Switch>
  );
};

/**
 * This component is responsible for rendering the Access Monitoring page.
 *
 * It will display, if needed, the navigation tabs to switch between the different features,
 * and call the AccessMonitoringSwitcher component to render the content of the selected tab.
 */
const AccessMonitoringRouter: React.FC<Props> = ({
  fetchAllEstablishmentGroup,
  fetchEstablishments,
  pageHeight,
  permissions,
  push,
  tab,
  theme,
}) => {
  const classes = useStyles();

  // Fetch data on component mount
  useEffect(() => {
    if (theme.enable_multi_localization) {
      fetchAllEstablishmentGroup();
    }
    fetchEstablishments();
  }, [fetchAllEstablishmentGroup, fetchEstablishments, theme]);

  const tabsData = Immutable([
    ...(permissions?.navigationMenu?.accessMonitoring?.perform
      ? [{ label: 'tab.accessMonitoring.perform', value: 'perform' }]
      : []),
    ...(permissions?.navigationMenu?.accessMonitoring?.monitor
      ? [{ label: 'tab.accessMonitoring.monitor', value: 'monitor' }]
      : []),
    ...(permissions?.navigationMenu?.accessMonitoring?.settings
      ? [{ label: 'tab.accessMonitoring.settings', value: 'settings' }]
      : []),
  ]);

  const onChange = useCallback(
    (newTab: string) => {
      push(`/access-monitoring/${newTab}`);
    },
    [push],
  );

  const hideAppBar = tabsData.length <= 1;

  return (
    <ContentWithAppBar
      onChange={onChange}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={hideAppBar ? Immutable([]) : tabsData}
    >
      <div className={classes.container}>
        <AccessMonitoringSwitcher permissions={permissions} />
      </div>
    </ContentWithAppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const connector = connect(
  (state: RootState) => ({
    permissions: getPermissions(state),
    theme: state.theme.theme,
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    push: pushFunc,
  },
);

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab:string',
  }),
  withPageHeightHOC(),
)(AccessMonitoringRouter);
