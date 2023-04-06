import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import withPageHeightHOC from '#hocs/with-page-height.hoc';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';

import WorkshopActivityList from './WorkshopActivityList.page';
import WorkshopActivityGroup from './WorkshopActivityGroup.page';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

type Props = {
  tab: 'list' | 'groups';
  pageHeight: number;
} & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'workshop:tabList', value: 'list' },
  { label: 'workshop:tabGroups', value: 'groups' },
]);

const WorkshopActivityInnerRouter: React.FC<Props> = ({
  pageHeight,
  tab,
  push,
}) => {
  const onChange = useCallback(
    (newTab: string) => {
      push(`/workshop-activity/tabs/${newTab}`);
    },
    [push],
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
    </ContentWithAppBar>
  );
};

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
