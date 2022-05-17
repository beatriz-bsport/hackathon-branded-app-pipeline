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

import withPageHeightHOC from '#hocs/with-page-height.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';

import WorkshopActivityList from './WorkshopActivityList.page';
import WorkshopActivityGroup from './WorkshopActivityGroup.page';

type Props = {
  tab: 'list' | 'groups';
  pageHeight: number;
} & WithTranslation &
  ConnectedProps<typeof connector>;

const APP_HEIGHT = 32;

const WorkshopActivityInnerRouter: React.FC<Props> = ({
  pageHeight,
  tab,
  push,
  t,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default">
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={tab}
          onChange={(e, newTab) => {
            push(`/workshop-activity/tabs/${newTab}`);
          }}
        >
          <Tab label={t('workshop:tabList')} value="list" />
          <Tab label={t('workshop:tabGroups')} value="groups" />
        </Tabs>
      </AppBar>
      <div
        className={classes.content}
        style={{ maxHeight: pageHeight - APP_HEIGHT }}
      >
        <Switch>
          <Route
            exact
            path="/workshop-activity/tabs/list"
            component={WorkshopActivityList}
          />
          <Route
            exact
            path="/workshop-activity/tabs/groups/:selectedOfferId?"
            component={WorkshopActivityGroup}
          />
          <Redirect to="/workshop-activity/tabs/list" />
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
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
}));

const connector = connect(() => ({}), {
  push: pushFunc,
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation(['workshop', 'titles']),
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityList')),
  withPageHeightHOC(),
)(WorkshopActivityInnerRouter);
