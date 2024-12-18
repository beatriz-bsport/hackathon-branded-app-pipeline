import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
// @ts-expect-error
import SettingsPersonalizePage from './SettingsPersonalizePage.page';
import MemberProfileSettingsPage from './MemberProfileSettings.page';

type Props = {
  tab: string;
  pageHeight: number;
  push: (url: string) => void;
};

const tabsData = Immutable([
  { label: 'tab.settings.theme.general', value: 'general' },
  { label: 'tab.settings.theme.memberProfile', value: 'memberProfile' },
]);

const SettingsPersonalization: React.FC<Props> = React.memo(
  ({ tab, pageHeight, push }) => {
    const { t } = useTranslation('theme');
    const pushToTab = useCallback(
      (_tab: 'general' | 'memberProfile') =>
        push(`/settings/personalization/${_tab}`),
      [push],
    );
    return (
      <ContentWithAppBar
        onChange={pushToTab}
        pageHeight={pageHeight}
        tab={tab}
        tabsData={tabsData}
      >
        <Helmet>
          <title>{t('pageTitles.personalization')}</title>
        </Helmet>
        <Switch>
          <Route
            exact
            component={SettingsPersonalizePage}
            path="/settings/personalization/general"
          />
          <Route
            exact
            component={MemberProfileSettingsPage}
            path="/settings/personalization/memberProfile"
          />
          <Route exact path="/settings/personalization">
            <Redirect to="/settings/personalization/general" />
          </Route>
        </Switch>
      </ContentWithAppBar>
    );
  },
);

export default compose(
  routerParamsToProps({ tab: 'tab:string' }),
  connect(null, {
    push: pushRouter,
  }),
  withPageHeightHOC(),
)(SettingsPersonalization);
