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

import asyncComponent from '../../AsyncComponent';
import { RootState } from '../../reducers';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';
import { getPermissions } from '#libs/role/selectors';

const ClockInRealTime = asyncComponent(() => import('./ClockInRealTime.page'));
const ClockInHistory = asyncComponent(() => import('./ClockInHistory.page'));

type Props = {
  tab: 'real-time' | 'history';
} & WithTranslation &
  ConnectedProps<typeof connector>;

const ClockInRouter: React.FC<Props> = ({ permissions, tab, push, t }) => {
  const classes = useStyles();

  if (
    permissions?.navigationMenu?.payments?.clockIn?.clockInForOther &&
    permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory
  ) {
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default">
          <Tabs
            scrollButtons="off"
            variant="scrollable"
            value={tab}
            onChange={(e, newTab) => {
              push(`/clock-in/${newTab}`);
            }}
          >
            <Tab label={t('tabRealTime')} value="real-time" />
            <Tab label={t('tabHistory')} value="history" />
          </Tabs>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route
              exact
              path="/clock-in/real-time"
              component={ClockInRealTime}
            />
            <Route exact path="/clock-in/history" component={ClockInHistory} />
            <Redirect to="/clock-in/real-time" />
          </Switch>
        </div>
      </div>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.clockInForOther) {
    return (
      <div className={classes.page}>
        <Switch>
          <Route exact path="/clock-in/real-time" component={ClockInRealTime} />
          <Redirect to="/clock-in/real-time" />
        </Switch>
      </div>
    );
  }

  if (permissions?.navigationMenu?.payments?.clockIn?.canAccessHistory) {
    return (
      <div className={classes.page}>
        <Switch>
          <Route exact path="/clock-in/history" component={ClockInHistory} />
          <Redirect to="/clock-in/history" />
        </Switch>
      </div>
    );
  }

  return <Redirect to="/" />;
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
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

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
)(ClockInRouter);
