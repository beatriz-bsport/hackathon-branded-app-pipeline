import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';
import CoachDetail from './CoachDetail.page';

type OwnProps = {
  tab: string;
  pushToTab: (id: number, tab: string) => void;
  coachId: number;
  pageHeight: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.coach.general', value: 'general' },
  { label: 'tab.coach.calendar', value: 'private-calendar' },
]);

export const CoachDetailRouter: React.FC<Props> = ({
  pushToTab,
  coachId,
  pageHeight,
  tab,
}) => {
  const onChange = useCallback(
    (newTab: string) => {
      pushToTab(coachId, newTab);
    },
    [pushToTab, coachId],
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
          component={CoachPrivateCalendar}
          path="/coach/:coachId/private-calendar"
        />
        <Route component={CoachDetail} path="/coach/:coachId" />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(null, {
  pushToTab: (id: number, tab: string) => push(`/coach/${id}/${tab}`),
});

export default compose<OwnProps, Props>(
  routerParamsToProps({
    tab: 'tab:string',
    coachId: 'coachId:number',
  }),
  connector,
  withPageHeightHOC(),
  React.memo,
)(CoachDetailRouter);
