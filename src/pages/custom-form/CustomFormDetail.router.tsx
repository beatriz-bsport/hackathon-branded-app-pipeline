// @ts-nocheck
import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CustomFormDetail from './CustomFormDetail.page';
import CustomFormStatistics from './CustomFormStatistics.page';
import CustomFormLayout from './CustomFormLayout.page';
import { CustomForm } from '../../libs/custom-form/types';
import themeSelectors from '../../libs/theme/selectors';
import type { RootState } from '../../reducers';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import withPageHeightHOC from '#hocs/with-page-height.hoc';

type Props = {
  tab: string;
  pushToTab: (id: number, tab: string) => void;
  id: number;
  pageHeight: number;
};

const tabsData = Immutable([
  { label: 'tab.customForm.general', value: 'general' },
  { label: 'tab.customForm.statistics', value: 'statistics' },
  { label: 'tab.customForm.layout', value: 'layout' },
]);

export const CustomFormDetailRouter = (props: Props) => {
  const { pushToTab, id } = props;
  const onChange = useCallback(
    (newTab: string) => {
      pushToTab(id, newTab);
    },
    [pushToTab, id],
  );

  return (
    <ContentWithAppBar
      tab={props.tab}
      onChange={onChange}
      pageHeight={props.pageHeight}
      tabsData={tabsData}
    >
      <Switch>
        <Route
          path="/custom-form/details/:id/layout"
          component={CustomFormLayout}
        />
        <Route
          exact
          path="/custom-form/details/:id/statistics"
          component={CustomFormStatistics}
        />
        <Route
          path="/custom-form/details/:id/general"
          component={CustomFormDetail}
        />
        <Route path="/custom-form/details/:id" component={CustomFormDetail} />
      </Switch>
    </ContentWithAppBar>
  );
};

export default compose<any, Props>(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withTranslation('marketing'),
  connect(
    (state: RootState) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      pushToTab: (id: number, tab: string) =>
        push(`/custom-form/details/${id}/${tab}`),
    },
  ),
  withTitle(({ customForm }: { customForm: CustomForm }) => {
    return customForm ? `${customForm.name}` : '';
  }),
  withPageHeightHOC(),
)(CustomFormDetailRouter);
