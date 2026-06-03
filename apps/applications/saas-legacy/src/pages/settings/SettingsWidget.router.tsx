import React, { useCallback, useEffect } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch, useLocation } from 'react-router';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withPageHeightHOC, {
  WithPageHeight,
} from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import type { RootState } from '#src/reducers';
import { REVAMPED_WIDGET_SETTINGS_URL } from '#src/revamp';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { getTheme } from '#src/libs/theme/selectors';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

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
  { label: 'tab.widget.customizeCss', value: 'customize-css' },
]);

const WidgetGeneratorRoute: React.FC = () => {
  const isWidgetsSettingsPageEnabled = useSafeFlag(
    FeatureFlags.BOOKING_WIDGETS_SETTINGS_PAGE,
  );
  const isRevampedBackofficeEnabled = useSelector((state: RootState) =>
    Boolean(
      getTheme(state)?.revamped_backoffice_enabled &&
        state.auth?.has_enabled_revamped_backoffice,
    ),
  );
  const location = useLocation();
  const shouldRedirectToRevampedWidgets =
    isWidgetsSettingsPageEnabled && isRevampedBackofficeEnabled;

  useEffect(() => {
    if (!shouldRedirectToRevampedWidgets) {
      return;
    }

    window.location.assign(`${REVAMPED_WIDGET_SETTINGS_URL}${location.search}`);
  }, [shouldRedirectToRevampedWidgets, location.search]);

  if (shouldRedirectToRevampedWidgets) {
    return null;
  }

  return <WidgetGeneratorPage />;
};

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
      onChange={onChange}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <Switch>
        <Route
          exact
          component={WidgetGeneratorRoute}
          path="/settings/widget/create"
        />
        <Route
          exact
          component={WidgetCustomizationPage}
          path="/settings/widget/customize"
        />
        <Route
          exact
          component={WidgetCustomizationComponentPage}
          path="/settings/widget/customize-css/:page/:componentId"
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
    tab: 'tab:string',
  }),
  withTranslation('widget'),
  withPageHeightHOC(),
)(SettingsWidget);
