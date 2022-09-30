import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import asyncComponent from '../../../AsyncComponent';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';

const FranchiseStaffListPage = asyncComponent(
  () => import('./FranchiseStaffList.page'),
);
const FranchiseRoleListPage = asyncComponent(
  () => import('./FranchiseRoleList.page'),
);

type Props = {
  tab: 'staff' | 'role';
} & WithTranslation &
  ConnectedProps<typeof connector>;

const SettingsWidget: React.FC<Props> = ({
  tab,
  pushToFranchiseStaffRoleTab,
  t,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default" className={classes.appbar}>
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={tab}
          onChange={pushToFranchiseStaffRoleTab}
        >
          <Tab label={t('staff.staffAccountPageTitle')} value="staff" />
          <Tab label={t('staff.rolePageTitle')} value="role" />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
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
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(-3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      width: 'auto',
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
    },
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
  },
  content: {
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
    },
    marginTop: theme.spacing(2),
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
  },
  appbar: {
    zIndex: 1,
  },
}));

const connector = connect(() => ({}), {
  pushToFranchiseStaffRoleTab: (_, newTab: string) =>
    pushFunc(`/f/staffrole/${newTab}`),
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('franchise'),
)(SettingsWidget);
