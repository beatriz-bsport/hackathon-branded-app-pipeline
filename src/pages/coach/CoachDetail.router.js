// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import CoachDetail from './CoachDetail.page';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

type Props = {
  tab: string,
  pushToTab: (id: number, tab: string) => void,
  coachId: number,
  pageHeight: number,
};

export const CoachDetailRouter = (props: Props) => {
  const tabsData = [
    { label: 'tab.coach.general', value: 'general' },
    { label: 'tab.coach.calendar', value: 'private-calendar' },
  ];

  const { pushToTab, coachId } = props;
  const onChange = useCallback(
    (newTab: string) => {
      pushToTab(coachId, newTab);
    },
    [pushToTab, coachId],
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
          exact
          path="/coach/:coachId/private-calendar"
          component={CoachPrivateCalendar}
        />
        <Route path="/coach/:coachId" component={CoachDetail} />
      </Switch>
    </ContentWithAppBar>
  );
};

export default compose(
  routerParamsToProps({
    tab: 'tab',
    coachId: 'coachId:number',
  }),
  withTranslation(['coach']),
  connect(null, {
    pushToTab: (id, tab) => push(`/coach/${id}/${tab}`),
  }),
  withPageHeightHOC(),
)(CoachDetailRouter);
