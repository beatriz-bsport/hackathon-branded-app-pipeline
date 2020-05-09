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

import PrivateServiceDetail from './PrivateServiceDetail.page';
import PrivateServiceCalendar from './PrivateServiceCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

export class PrivateServiceRouter extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.classes.container}>
        <AppBar position="static" color="default">
          <Tabs
            scrollButtons="off"
            variant="scrollable"
            value={this.props.tab}
            onChange={(e, newTab) => {
              this.props.pushToTab(this.props.id, newTab);
            }}
          >
            <Tab
              label={this.props.t('service.detail.tab.general')}
              value="general"
            />
            <Tab
              label={this.props.t('service.detail.tab.calendar')}
              value="calendar"
            />
          </Tabs>
        </AppBar>
        <div className={this.props.classes.content}>
          <Switch>
            <Route
              path="/private-service/service/:id/calendar"
              component={PrivateServiceCalendar}
            />
            <Route
              path="/private-service/service/:id/general"
              component={PrivateServiceDetail}
            />
            <Route
              path="/private-service/service/:id"
              component={PrivateServiceDetail}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(4),
    marginTop: -theme.spacing(3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing(3),
      width: 'auto',
      marginRight: -theme.spacing(3),
      marginTop: -theme.spacing(2),
    },
  },
  content: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    marginTop: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withNamespaces(['privateService']),
  withStyles(styles),
  connect(
    null,
    {
      pushToTab: (id, tab) => push(`/private-service/service/${id}/${tab}`),
    },
  ),
)(PrivateServiceRouter);
