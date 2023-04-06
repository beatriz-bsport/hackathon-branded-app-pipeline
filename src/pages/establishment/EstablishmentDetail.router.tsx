import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import EstablishmentDetail from './EstablishmentDetail.page';
import EstablishmentCalendar from './EstablishmentCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import withPageHeightHOC from '#hocs/with-page-height.hoc';

type OwnProps = {
  tab: string;
  id: number;
  pushToTab: (id: number, tab: string) => void;
  pageHeight: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.establishment.general', value: 'general' },
  { label: 'tab.establishment.calendar', value: 'calendar' },
]);

export const EstablishmentDetailRouter = (props: Props) => {
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
          exact
          path="/establishment/details/:id/calendar"
          component={EstablishmentCalendar}
        />
        <Route
          path="/establishment/details/:id/general"
          component={EstablishmentDetail}
        />
        <Route
          path="/establishment/details/:id"
          component={EstablishmentDetail}
        />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(null, {
  pushToTab: (id: number, tab: string) =>
    push(`/establishment/details/${id}/${tab}`),
});

export default compose<any, Props>(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withTranslation('establishment'),
  connector,
  withPageHeightHOC(),
)(EstablishmentDetailRouter);
