import React from 'react';
import Immutable from 'seamless-immutable';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import { makeStyles } from '@material-ui/core';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import QuicksaleSectionListPage from './QuicksaleSectionList.page';
import QuicksaleRoleConfiguration from './QuicksaleRoleConfiguration.page';
import QuicksaleItemListPage from './QuicksaleItemList.page';

const tabsData = Immutable([
  { label: 'tab.quicksale.configuration', value: 'configuration' },
  { label: 'tab.quicksale.access', value: 'access' },
]);

type Props = {
  tab: string;
  pageHeight: number;
  pushToTab: (tab: 'configuration' | 'access') => void;
};

const Quicksale: React.FC<Props> = ({ tab, pageHeight, pushToTab }) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles();

  return (
    <ContentWithAppBar
      dense
      fullHeight
      customClasses={classes}
      onChange={pushToTab}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Switch>
        <Route
          exact
          component={QuicksaleItemListPage}
          path="/settings/quicksale/configuration/:sectionId"
        />
        <Route
          exact
          component={QuicksaleSectionListPage}
          path="/settings/quicksale/configuration"
        />
        <Route
          exact
          component={QuicksaleRoleConfiguration}
          path="/settings/quicksale/access"
        />
        <Route exact path="/settings/quicksale">
          <Redirect to="/settings/quicksale/configuration" />
        </Route>
      </Switch>
    </ContentWithAppBar>
  );
};

const useStyles = makeStyles(() => ({
  tab: {
    maxWidth: 'none',
  },
}));

export default compose(
  routerParamsToProps({ tab: 'tab:string' }),
  connect(() => {}, {
    pushToTab: (tab: 'configuration' | 'access') =>
      pushRouter(`/settings/quicksale/${tab}`),
  }),
  withPageHeightHOC(),
)(Quicksale);
