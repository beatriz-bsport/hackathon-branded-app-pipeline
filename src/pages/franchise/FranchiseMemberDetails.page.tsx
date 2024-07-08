import React from 'react';
import Immutable from 'seamless-immutable';
import { push as pushAction } from 'connected-react-router';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import { getFranchiseUserInfo } from '#src/libs/franchise/selectors';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import type { RootState } from '#src/reducers';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';
import { fetchFranchiseUserInfo as fetchFranchiseUserInfoAction } from '#src/libs/franchise/actions';

const FranchiseMemberDetailInfo = asyncComponent(
  () => import('./FranchiseMemberDetailInfo.page'),
);
const FranchiseMemberDetailPass = asyncComponent(
  () => import('./FranchiseMemberDetailPass.page'),
);
const FranchiseMemberDetailPrivateConsumerPass = asyncComponent(
  () => import('./FranchiseMemberDetailPrivateConsumerPass.page'),
);
const FranchiseMemberDetailGiftcard = asyncComponent(
  () => import('./FranchiseMemberDetailGiftcard.page'),
);
const FranchiseMemberDetailBillingPlan = asyncComponent(
  () => import('./FranchiseMemberDetailBillingPlan.page'),
);

type ParamsProps = {
  userId: number;
  tab: string;
};

type WithPageHeightHOC = {
  pageHeight: number;
};

type Props = ParamsProps & WithPageHeightHOC & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.member.info', value: 'info' },
  {
    label: 'tab.member.paymentPack',
    value: 'pass',
  },
  {
    label: 'tab.member.privateConsumerPass',
    value: 'private-consumer-pass',
  },
  { label: 'tab.member.giftcard', value: 'giftcard' },
  { label: 'tab.member.subscription', value: 'subscription' },
]);

const FranchiseMemberDetails: React.FC<Props> = ({
  userId,
  user,
  tab,
  pageHeight,
  push,
  fetchFranchiseUserInfo,
}) => {
  const pushToTab = (id: number, newTab: string) =>
    push(`/f/members/${id}/member/${newTab}`);

  const handleOnChange = (newTab: string) => {
    pushToTab(userId, newTab);
  };

  React.useEffect(() => {
    fetchFranchiseUserInfo({ user_id: userId });
  }, [fetchFranchiseUserInfo, userId]);

  return (
    <ContentWithAppBar
      onChange={handleOnChange}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <Helmet>
        <title>{user ? user.name : ''}</title>
      </Helmet>
      <Switch>
        <Route
          exact
          component={FranchiseMemberDetailInfo}
          path="/f/members/:userId/member/info"
        />
        <Route
          exact
          component={FranchiseMemberDetailPass}
          path="/f/members/:userId/member/pass/:selectedConsumerPaymentPackId"
        />
        <Route
          exact
          component={FranchiseMemberDetailPass}
          path="/f/members/:userId/member/pass"
        />
        <Route
          exact
          component={FranchiseMemberDetailPrivateConsumerPass}
          path="/f/members/:userId/member/private-consumer-pass/:selectedPrivateConsumerPassId"
        />
        <Route
          exact
          component={FranchiseMemberDetailPrivateConsumerPass}
          path="/f/members/:userId/member/private-consumer-pass"
        />
        <Route
          exact
          component={FranchiseMemberDetailGiftcard}
          path="/f/members/:userId/member/giftcard/:selectedConsumerGiftcardId"
        />
        <Route
          exact
          component={FranchiseMemberDetailGiftcard}
          path="/f/members/:userId/member/giftcard"
        />
        <Route
          exact
          component={FranchiseMemberDetailBillingPlan}
          path="/f/members/:userId/member/subscription/:selectedBillingPlanId"
        />
        <Route
          exact
          component={FranchiseMemberDetailBillingPlan}
          path="/f/members/:userId/member/subscription"
        />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(
  (state: RootState) => ({
    user: getFranchiseUserInfo(state),
  }),
  {
    push: pushAction,
    fetchFranchiseUserInfo: fetchFranchiseUserInfoAction,
  },
);

export default compose<Props, {}>(
  React.memo,
  routerParamsToProps({ userId: 'userId:number', tab: 'tab:string' }),
  withPageHeightHOC(),
  connector,
)(React.memo(FranchiseMemberDetails));
