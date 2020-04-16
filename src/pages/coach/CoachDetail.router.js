// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { push } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';

import CoachDetail from './CoachDetail.page';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  classes: Object,
  tab: string,
  pushToTab: (id: number, tab: string) => void,
  coachId: number,
  t: TFunction,
};

export const CoachDetailRouter = (props: Props) => (
  <div className={props.classes.container}>
    <AppBar position="static" color="default">
      <Tabs
        scrollButtons="off"
        variant="scrollable"
        value={props.tab}
        onChange={(e, newTab) => {
          props.pushToTab(props.coachId, newTab);
        }}
      >
        <Tab label={props.t('detail.tab.general')} value="general" />
        <Tab label={props.t('detail.tab.calendar')} value="private-calendar" />
      </Tabs>
    </AppBar>
    <div className={props.classes.content}>
      <Switch>
        <Route
          exact
          path="/coach/:coachId/private-calendar"
          component={CoachPrivateCalendar}
        />
        <Route path="/coach/:coachId" component={CoachDetail} />
      </Switch>
    </div>
  </div>
);
const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: -theme.spacing.unit * 3,
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing.unit * 3,
      width: 'auto',
      marginRight: -theme.spacing.unit * 3,
      marginTop: -theme.spacing.unit * 2,
    },
  },
  content: {
    marginBottom: theme.spacing.unit * 8,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 8,
    },
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({
    tab: 'tab',
    coachId: 'coachId:number',
  }),
  withNamespaces(['coach']),
  withStyles(styles),
  connect(
    null,
    {
      pushToTab: (id, tab) => push(`/coach/${id}/${tab}`),
    },
  ),
)(CoachDetailRouter);
