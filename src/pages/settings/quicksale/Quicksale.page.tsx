import React from 'react';
import Immutable from 'seamless-immutable';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import { makeStyles } from '@material-ui/core';

// @ts-expect-error
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

import QuicksaleSectionListPage from './QuicksaleSectionList/QuicksaleSectionList.page';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import QuicksaleRoleConfiguration from './QuicksaleRoleConfiguration.page';

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
      tab={tab}
      pageHeight={pageHeight}
      tabsData={tabsData}
      onChange={pushToTab}
      customClasses={classes}
      dense
      fullHeight
    >
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Switch>
        <Route
          exact
          path="/settings/quicksale/configuration"
          component={QuicksaleSectionListPage}
        />
        <Route
          exact
          path="/settings/quicksale/access"
          component={QuicksaleRoleConfiguration}
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
  routerParamsToProps({ tab: 'tab' }),
  connect(() => {}, {
    pushToTab: (tab: 'configuration' | 'access') =>
      pushRouter(`/settings/quicksale/${tab}`),
  }),
  withPageHeightHOC(),
)(Quicksale);
