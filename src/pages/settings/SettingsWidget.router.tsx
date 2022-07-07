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
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import Config from '../../config';

const WidgetGeneratorPage = asyncComponent(
  () => import('./WidgetGenerator.page'),
);
const WidgetCustomizationPage = asyncComponent(
  () => import('./WidgetCustomization.page'),
);

type Props = {
  tab: 'create' | 'history';
} & WithTranslation &
  ConnectedProps<typeof connector>;

const SettingsWidget: React.FC<Props> = ({ tab, pushToWidgetTab, t }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default">
        {Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
          <Tabs
            scrollButtons="off"
            variant="scrollable"
            value={tab}
            onChange={pushToWidgetTab}
          >
            <Tab label={t('create')} value="create" />
            <Tab label={t('customize')} value="customize" />
          </Tabs>
        )}
      </AppBar>
      <div className={classes.content}>
        <Switch>
          <Route
            exact
            path="/settings/widget/create"
            component={WidgetGeneratorPage}
          />
          <Route
            exact
            path="/settings/widget/customize"
            component={WidgetCustomizationPage}
          />
          <Redirect to="/settings/widget/create" />
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
}));

const connector = connect(() => ({}), {
  pushToWidgetTab: (_, newTab: string) =>
    pushFunc(`/settings/widget/${newTab}`),
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('widget'),
)(SettingsWidget);
