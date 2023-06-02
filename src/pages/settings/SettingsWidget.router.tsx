import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import Config from '../../config';
// @ts-ignore
import asyncComponent from '../../AsyncComponent';
// @ts-ignore
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withPageHeightHOC, { WithPageHeight } from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

const WidgetCustomizationComponentPage = asyncComponent(
  () => import('./WidgetCustomizationComponent.page'),
);
const WidgetGeneratorPage = asyncComponent(
  () => import('./WidgetGenerator.page'),
);
const WidgetCustomizationPage = asyncComponent(
  () => import('./WidgetCustomization.page'),
);

type Props = {
  tab: 'create' | 'customize' | 'customize-css';
} & ConnectedProps<typeof connector> &
  WithPageHeight;

const tabsData = Immutable([
  { label: 'tab.widget.create', value: 'create' },
  { label: 'tab.widget.customize', value: 'customize' },
  ...(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production'
    ? [{ label: 'tab.widget.customizeCss', value: 'customize-css' }]
    : []),
]);

const SettingsWidget: React.FC<Props> = ({
  tab,
  pushToWidgetTab,
  pageHeight,
}) => {
  const onChange = useCallback(
    (newTab: string) => {
      pushToWidgetTab(newTab);
    },
    [pushToWidgetTab],
  );

  return (
    <ContentWithAppBar
      tab={tab}
      onChange={onChange}
      pageHeight={pageHeight}
      tabsData={tabsData}
    >
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
        <Route
          exact
          path="/settings/widget/customize-css/:page/:componentId"
          component={WidgetCustomizationComponentPage}
        />
        <Redirect to="/settings/widget/create" />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(() => ({}), {
  pushToWidgetTab: (newTab: string) => {
    if (newTab === 'customize-css') {
      return pushFunc('/settings/widget/customize-css/calendar/cardOffer');
    }
    return pushFunc(`/settings/widget/${newTab}`);
  },
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('widget'),
  withPageHeightHOC(),
)(SettingsWidget);
