import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { Route, Switch } from 'react-router';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import themeSelectors from '../../libs/theme/selectors';
import EstablishmentList from './EstablishmentList.page';
import EstablishmentGroupPage from './EstablishmentGroup.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

type OwnProps = {
  tab: string;
  pushToTab: (tab: string) => void;
  pageHeight: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.establishment.room', value: 'room' },
  { label: 'tab.establishment.location', value: 'location' },
]);

export const EstablishmentRoomLocationRouter = (props: Props) => {
  const { pushToTab } = props;
  const onChange = useCallback(
    (newTab: string) => {
      pushToTab(newTab);
    },
    [pushToTab],
  );
  if (props.companyTheme.enable_multi_localization) {
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
            path="/establishment/location"
            component={EstablishmentGroupPage}
          />
          <Route path="/" component={EstablishmentList} />
        </Switch>
      </ContentWithAppBar>
    );
  }

  return <Route path="/" component={EstablishmentList} />;
};

const mapStateToProps = (state: RootState) => ({
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  pushToTab: (tab: string) => push(`/establishment/${tab}`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any>(
  withTranslation('establishment'),
  routerParamsToProps({
    tab: 'tab',
  }),
  connector,
  withPageHeightHOC(),
)(EstablishmentRoomLocationRouter);
