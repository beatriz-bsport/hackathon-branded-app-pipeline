// @ts-nocheck
import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import asyncComponent from '../../AsyncComponent';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

const WidgetGeneratorPage = asyncComponent(
  () => import('./WidgetGenerator.page'),
);
const WidgetCustomizationPage = asyncComponent(
  () => import('./WidgetCustomization.page'),
);

type Props = {
  tab: 'create' | 'history';
  pageHeight: number;
} & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.widget.create', value: 'create' },
  { label: 'tab.widget.customize', value: 'customize' },
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
        <Redirect to="/settings/widget/create" />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(() => ({}), {
  pushToWidgetTab: (newTab: string) => pushFunc(`/settings/widget/${newTab}`),
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab',
  }),
  withTranslation('widget'),
  withPageHeightHOC(),
)(SettingsWidget);
