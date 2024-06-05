import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { Route, Switch, Redirect } from 'react-router';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import themeSelectors from '../../libs/theme/selectors';
import ReplacementManagement from './ReplacementManagement.page';
import ReplacementDisciplineGroup from './ReplacementDisciplineGroup.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';

type OwnProps = {
  tab: string;
  pageHeight: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.replacement.management', value: 'management' },
  { label: 'tab.replacement.disciplineGroup', value: 'discipline-group' },
]);

export const ReplacementRouter: React.FC<Props> = (props) => {
  const { pageHeight, tab, pushToTab } = props;
  const onChange = useCallback(
    (newTab: string) => {
      pushToTab(newTab);
    },
    [pushToTab],
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
          component={ReplacementDisciplineGroup}
          path="/replacement/discipline-group"
        />
        <Route
          exact
          component={ReplacementManagement}
          path="/replacement/management"
        />
        <Redirect to="/replacement/management" />
      </Switch>
    </ContentWithAppBar>
  );
};

const mapStateToProps = (state: RootState) => ({
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  pushToTab: (tab: string) => push(`/replacement/${tab}`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any>(
  withTranslation(['replacement', 'titles']),
  withTitle(({ t }: { t: TFunction }) => t('titles:replacement')),
  routerParamsToProps({
    // @ts-expect-error
    tab: 'tab',
  }),
  connector,
  withPageHeightHOC(),
)(ReplacementRouter);
