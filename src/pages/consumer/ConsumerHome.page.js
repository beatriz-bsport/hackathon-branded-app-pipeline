// @flow
import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Switch, Route, withRouter } from 'react-router-dom';
import {
  push as pushRouter,
  replace as replaceRouter,
} from 'connected-react-router';
import { getProgramList } from '#src/libs/performance-tracking/selector';
import { fetchProgram as fetchProgramAction } from '#src/libs/performance-tracking/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import Analytics from '../../components/analytics/Analytics.component';
import withTitle from '../../hocs/with-title.hoc';
import { parseQueryString, buildUrlParams } from '../../http';
import { withTranslation } from 'react-i18next';

import asyncComponent from '../../AsyncComponent';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import {
  getConsumerMembershipList,
  getMembership,
} from '../../libs/membership/selectors';
import {
  fetchMembershipByCompany,
  linkMeToCompany,
  setActiveActions,
  requestMembershipValidation,
  fetchMembershipListAsConsumer,
} from '../../libs/membership/actions';
import { getOfferWithRelated } from '../../libs/offer/selectors';

import { fetchBasketGeneratedObjects as fetchBasketGeneratedObjectsAction } from '../../libs/checkout/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import { getBasketGeneratedObjects } from '../../libs/checkout/selectors';

import { getTheme } from '../../theme';
import themeSelectors from '../../libs/theme/selectors';
import { fetchCountObjects as fetchCountObjectsAction } from '../../libs/member/actions';
import ConsumerLoading from '../../libs/consumer-space/components/ConsumerLoading.component';
import ConsumerDrawer from '../../components/navigation/ConsumerDrawer.component';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import type { Membership } from '../../libs/membership/types';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import CongratulationDialog from '../../libs/consumer-space/components/CongratulationDialog.component';
import { fetchSubscriptionListByMember } from '../../libs/subscription/actions';
import { getSubscriptionByMemberPendingAction } from '../../libs/subscription/selectors';
import MemberShipValidationWrapper from './MemberShipValidationWrapper.component';
import { fetchMyControlableMemberList } from '../../libs/relationship/actions';

import { getMyControlableMemberList } from '../../libs/relationship/selectors';
import {
  navigateToRelationAccount as navigateToRelationAccountAction,
  navigateBackToMasterRelation as navigateBackToMasterRelationAction,
} from '../../actions/auth.actions';
import { displayReworkedMemberProfile } from '../../libs/consumer-space/constants';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import { getItemInStorage } from '../../utils/storage';
import { STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN } from '../../actions/constants';
import { ChevronRight } from '#src/components/untitledui';

import ConsumerNavigation from '#src/libs/consumer-space/components/reworked/@Navigation/ConsumerNavigation';
import { getCheckoutUrl } from '../../libs/marketplace/routing-utils';
import Config from '../../config';
import {
  urlToMarketplacePassTab,
  urlToMarketplaceSessionTab,
  urlToMarketplaceSubscriptionTab,
} from '../../libs/marketplace/utils/navigation';

const isWidget = WidgetUtils.isWidget();

const ConsumerDashboard = asyncComponent(() =>
  import('./ConsumerDashboard.page'),
);
const ConsumerGiftcard = asyncComponent(() =>
  import('./ConsumerGiftcard.page'),
);
const ConsumerBooking = asyncComponent(() => import('./ConsumerBooking.page'));
const ConsumerBookingReworked = asyncComponent(() =>
  import('./ConsumerBookingReworked.page'),
);
const ConsumerVOD = asyncComponent(() => import('./ConsumerVOD.page'));
const ConsumerBookingBroadcast = asyncComponent(() =>
  import('./ConsumerBookingBroadcast.page'),
);
const ConsumerPack = asyncComponent(() => import('./ConsumerPack.page'));
const ConsumerPassReworked = asyncComponent(() =>
  import('./ConsumerPassReworked.page'),
);
const ConsumerInvoice = asyncComponent(() => import('./ConsumerInvoice.page'));
const ConsumerInvoiceReworked = asyncComponent(() =>
  import('./ConsumerInvoiceReworked.page'),
);
const ConsumerSubscription = asyncComponent(() =>
  import('./ConsumerSubscription.page'),
);
const ConsumerSubscriptionReworked = asyncComponent(() =>
  import('./ConsumerSubscriptionReworked.page'),
);
const ConsumerProfile = asyncComponent(() => import('./ConsumerProfile.page'));
const ConsumerProfileReworked = asyncComponent(() =>
  import('./ConsumerProfileReworked.page'),
);
const ConsumerProgram = asyncComponent(() =>
  import('../performance-tracking/ConsumerProgram.page'),
);
type Props = {
  membership: ?Membership,
  companyId: number,
  linkMeToCompany: ({ company: number }) => void,
  theme: Theme,
  fetchCompanyTheme: (id: number) => void,

  goToMembershipPage: (path: string) => void,
  push: (path: string) => void,
  buildUrl: (string) => string,
  fetchMembershipListAsConsumer: (params: any) => void,
  membershipList: Array<Membership>,
  username: ?string,
  name: string,
  setActiveActions: (company: number) => void,
  classes: Object,
  disconnect: () => void,

  from_basket: ?string,
  fetchBasketGeneratedObjects: (basketId: string) => void,
  basketGeneratedObjects: BasketObjects,
  resetCongratulations: () => void,
  goToCalendar: (params: any) => void,

  from_direct_booking: ?string,
  from_basket: ?string,
  offerBooked: ?Offer,
  basketGeneratedObjects: ?BasketObjects,

  fetchOfferBulk: (ids: Array<number>) => void,
  subscriptionPendingActionCount: number,
  fetchSubscriptionListByMember: (params: any) => void,

  fetchCountObjects: () => void,
  infosOfMember: dict,

  requestMembershipValidation: ({ company: number }) => void,
  fetchMembershipListAsConsumer: (params: any) => void,
  missingInformation: boolean,
  isValidating: boolean,

  fetchMembershipByCompany: (id: number) => void,
  membershipCount: number,

  fetchProgram: (params: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  controlableMemberList: Array<Member>,
  fetchMyControlableMemberList: () => void,

  navigateToRelationAccount: (memberId: number) => void,

  navigateBackToMasterRelation: () => void,
  marketplaceSettings: MarketplaceSettings,
} & WithTranslation;
export class ConsumerHome extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    if (this.props.from_basket) {
      this.props.fetchBasketGeneratedObjects(this.props.from_basket);
    }
    if (this.props.from_direct_booking) {
      this.props.fetchOfferBulk([parseInt(this.props.from_direct_booking, 10)]);
    }
    // this.props.linkMeToCompany({ company: this.props.companyId });

    this.props.fetchMembershipByCompany(this.props.companyId);
    this.props.setActiveActions(this.props.companyId);
  }

  componentDidMount() {
    this.props.fetchMyControlableMemberList(this.props.companyId);
    if (this.props.membership) {
      this.props.fetchCountObjects(this.props.membership.id);
      this.props.fetchSubscriptionListByMember(this.props.membership.id, {
        page: 1,
        page_size: 10,
      });
    }
    if (this.props.companyId) {
      this.props.fetchProgram({
        is_disabled: false,
        company: this.props.companyId,
      });
    }
    this.props.fetchMembershipListAsConsumer({ page_size: 1 });
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId) {
      if (this.props.companyId) {
        this.props.fetchProgram({
          is_disabled: false,
          company: this.props.companyId,
        });
      }
    }
  }

  buildPath = (path: string) => this.props.push(this.props.buildUrl(path));

  attachConsumerProps = (MyComponent: React.Component<*>) => (props: any) =>
    (
      <MyComponent
        // eslint-disable-next-line react/no-this-in-sfc
        companyId={this.props.companyId}
        {...props}
        // eslint-disable-next-line react/no-this-in-sfc
        membership={this.props.membership}
        // eslint-disable-next-line react/no-this-in-sfc
        push={this.buildPath}
      />
    );

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  handleGetASubscriptionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSubscriptionTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  handleBuyPassClick = () => {
    const marketplaceTabPath = urlToMarketplacePassTab(
      this.props.marketplaceSettings?.config,
      this.props.theme.company_name,
      this.props.theme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

  /** A list of buttons shown in the footer on mobile */
  getConsumerMobileNavigationButtonsData = () => {
    const location = this.props.location;
    const isSubscriptionRoute = location.pathname.includes('/subscription');
    const isPassRoute = location.pathname.includes('/pack');

    return isWidget
      ? []
      : [
          {
            label: this.props.t('reworked.myBookings.bookASession'),
            onClick: this.handleBookASessionClick,
            rightIcon: <ChevronRight stroke="currentColor" />,
            ...((isSubscriptionRoute || isPassRoute) && {
              variant: 'outlined',
            }),
            ...((isSubscriptionRoute || isPassRoute) && { color: 'grey' }),
          },
          ...(isSubscriptionRoute
            ? [
                {
                  label: this.props.t(
                    'reworked.mySubscriptions.headerButtonsLabel.getSubscription',
                  ),
                  onClick: this.handleGetASubscriptionClick,
                  rightIcon: <ChevronRight stroke="currentColor" />,
                },
              ]
            : []),
          ...(isPassRoute
            ? [
                {
                  label: this.props.t('reworked.myPasses.buyANewPass'),
                  onClick: this.handleBuyPassClick,
                  rightIcon: <ChevronRight stroke="currentColor" />,
                },
              ]
            : []),
        ];
  };

  render() {
    const isRelationNavigation = !!getItemInStorage(
      'local',
      STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
    );

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <MemberShipValidationWrapper companyId={this.props.companyId}>
          <>
            {this.props.membership ? (
              displayReworkedMemberProfile ? (
                <ConsumerNavigation
                  buildUrl={this.props.buildUrl}
                  buttonsData={this.getConsumerMobileNavigationButtonsData()}
                  companyId={this.props.companyId}
                  companyLogo={this.props.theme ? this.props.theme.cover : null}
                  companyTheme={this.props.theme}
                  controlableMemberList={this.props.controlableMemberList}
                  hasFranchise={this.props.theme.franchisor}
                  hasMultipleMembership={
                    this.props.membershipCount && this.props.membershipCount > 1
                  }
                  infosOfMember={this.props.infosOfMember}
                  isRelationNavigation={isRelationNavigation}
                  memberName={this.props.userFullName}
                  membership={this.props.membership}
                  name={this.props.name}
                  navigateBackToMasterRelation={
                    this.props.navigateBackToMasterRelation
                  }
                  navigateToRelationAccount={
                    this.props.navigateToRelationAccount
                  }
                  programList={this.props.programList}
                  redirectToCart={this.props.redirectToCart}
                  redirectToMyProfile={this.props.redirectToMyProfile}
                  showCredit={
                    this.props.theme &&
                    this.props.theme.consumer_regularize_debt
                  }
                  subscriptionPendingActionCount={
                    this.props.subscriptionPendingActionCount
                  }
                >
                  <CongratulationDialog
                    basketGeneratedObjects={this.props.basketGeneratedObjects}
                    goToCalendar={this.props.goToCalendar}
                    offerBooked={
                      this.props.offerBooked && this.props.offerBooked.length
                        ? this.props.offerBooked[0]
                        : null
                    }
                    onCancel={this.props.resetCongratulations}
                    open={
                      !!this.props.from_basket ||
                      !!this.props.from_direct_booking
                    }
                  />

                  <Analytics
                    theme={this.props.theme}
                    username={this.props.username}
                  />
                  <Switch>
                    <Route
                      path="/c/:companyId/booking/"
                      render={this.attachConsumerProps(ConsumerBookingReworked)}
                    />
                    <Route
                      path="/c/:companyId/subscription/"
                      render={this.attachConsumerProps(
                        ConsumerSubscriptionReworked,
                      )}
                    />
                    <Route
                      path="/c/:companyId/pack/"
                      render={this.attachConsumerProps(ConsumerPassReworked)}
                    />
                    <Route
                      path="/c/:companyId/vod/"
                      render={this.attachConsumerProps(ConsumerVOD)}
                    />
                    <Route
                      path="/c/:companyId/broadcast/:bookingId/"
                      render={this.attachConsumerProps(
                        ConsumerBookingBroadcast,
                      )}
                    />
                    <Route
                      path="/c/:companyId/invoice/"
                      render={this.attachConsumerProps(ConsumerInvoiceReworked)}
                    />
                    <Route
                      path="/c/:companyId/profile/"
                      render={this.attachConsumerProps(ConsumerProfileReworked)}
                    />
                    <Route
                      path="/c/:companyId/giftcard/"
                      render={this.attachConsumerProps(ConsumerGiftcard)}
                    />
                    <Route
                      path="/c/:companyId/program/:memberProgramId/"
                      render={this.attachConsumerProps(ConsumerProgram)}
                    />
                    <Route
                      path="/c/:companyId/program/"
                      render={this.attachConsumerProps(ConsumerProgram)}
                    />
                    <Route
                      path="/c/:companyId/home/"
                      render={this.attachConsumerProps(ConsumerDashboard)}
                    />

                    <Route
                      path="/c/:companyId/"
                      render={this.attachConsumerProps(ConsumerDashboard)}
                    />
                  </Switch>
                </ConsumerNavigation>
              ) : (
                <ConsumerDrawer
                  buildUrl={this.props.buildUrl}
                  buttonsData={this.getConsumerMobileNavigationButtonsData()}
                  companyId={this.props.companyId}
                  companyLogo={this.props.theme ? this.props.theme.cover : null}
                  companyTheme={this.props.theme}
                  controlableMemberList={this.props.controlableMemberList}
                  disconnect={this.props.disconnect}
                  hasFranchise={this.props.theme.franchisor}
                  hasMultipleMembership={
                    this.props.membershipCount && this.props.membershipCount > 1
                  }
                  infosOfMember={this.props.infosOfMember}
                  isRelationNavigation={isRelationNavigation}
                  memberName={this.props.userFullName}
                  membership={this.props.membership}
                  name={this.props.name}
                  navigateBackToMasterRelation={
                    this.props.navigateBackToMasterRelation
                  }
                  navigateToRelationAccount={
                    this.props.navigateToRelationAccount
                  }
                  programList={this.props.programList}
                  redirectToCart={this.props.redirectToCart}
                  redirectToMyProfile={this.props.redirectToMyProfile}
                  showCredit={
                    this.props.theme &&
                    this.props.theme.consumer_regularize_debt
                  }
                  subscriptionPendingActionCount={
                    this.props.subscriptionPendingActionCount
                  }
                >
                  <CongratulationDialog
                    basketGeneratedObjects={this.props.basketGeneratedObjects}
                    goToCalendar={this.props.goToCalendar}
                    offerBooked={
                      this.props.offerBooked && this.props.offerBooked.length
                        ? this.props.offerBooked[0]
                        : null
                    }
                    onCancel={this.props.resetCongratulations}
                    open={
                      !!this.props.from_basket ||
                      !!this.props.from_direct_booking
                    }
                  />

                  <Analytics
                    theme={this.props.theme}
                    username={this.props.username}
                  />
                  <Switch>
                    <Route
                      path="/c/:companyId/booking/"
                      render={this.attachConsumerProps(ConsumerBooking)}
                    />
                    <Route
                      path="/c/:companyId/subscription/"
                      render={this.attachConsumerProps(ConsumerSubscription)}
                    />
                    <Route
                      path="/c/:companyId/pack/"
                      render={this.attachConsumerProps(ConsumerPack)}
                    />
                    <Route
                      path="/c/:companyId/vod/"
                      render={this.attachConsumerProps(ConsumerVOD)}
                    />
                    <Route
                      path="/c/:companyId/broadcast/:bookingId/"
                      render={this.attachConsumerProps(
                        ConsumerBookingBroadcast,
                      )}
                    />
                    <Route
                      path="/c/:companyId/invoice/"
                      render={this.attachConsumerProps(ConsumerInvoice)}
                    />
                    <Route
                      path="/c/:companyId/profile/"
                      render={this.attachConsumerProps(ConsumerProfile)}
                    />
                    <Route
                      path="/c/:companyId/giftcard/"
                      render={this.attachConsumerProps(ConsumerGiftcard)}
                    />
                    <Route
                      path="/c/:companyId/program/:memberProgramId/"
                      render={this.attachConsumerProps(ConsumerProgram)}
                    />
                    <Route
                      path="/c/:companyId/program/"
                      render={this.attachConsumerProps(ConsumerProgram)}
                    />
                    <Route
                      path="/c/:companyId/home/"
                      render={this.attachConsumerProps(ConsumerDashboard)}
                    />

                    <Route
                      path="/c/:companyId/"
                      render={this.attachConsumerProps(ConsumerDashboard)}
                    />
                  </Switch>
                </ConsumerDrawer>
              )
            ) : (
              <ConsumerLoading />
            )}
          </>
        </MemberShipValidationWrapper>
      </MuiThemeProvider>
    );
  }
}

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withRouter,
  withProps(({ location }) => ({
    from_basket: parseQueryString(location.search).from_basket,
    from_direct_booking: parseQueryString(location.search).from_direct_booking,
  })),
  connect(
    (state, { companyId, from_direct_booking }) => ({
      controlableMemberList: getMyControlableMemberList(state),
      membership: getMembership(state, companyId),
      programList: getProgramList(state),
      membershipCount: state.membership.asConsumer.count,
      isValidating: state.membership.memberShipValidation.loading,
      missingInformation:
        state.membership.memberShipValidation.missingInformation,
      theme: themeSelectors.getTheme(state),
      infosOfMember: state.member.count.data,
      membershipList: getConsumerMembershipList(state),
      username: state.auth.username,
      userFullName: state.auth.name,
      name: state.auth.name,
      basketGeneratedObjects: getBasketGeneratedObjects(state),
      subscriptionPendingActionCount:
        getSubscriptionByMemberPendingAction(state).length,
      offerBooked: from_direct_booking
        ? getOfferWithRelated(state, parseInt(from_direct_booking, 10))
        : null,
      marketplaceSettings: state.marketplace.settings,
    }),
    {
      linkMeToCompany,
      requestMembershipValidation,
      fetchMembershipListAsConsumer,
      fetchMembershipByCompany,
      fetchCompanyTheme,
      push: pushRouter,
      replace: replaceRouter,
      setActiveActions,
      fetchBasketGeneratedObjects: fetchBasketGeneratedObjectsAction,

      fetchOfferBulk: fetchOfferBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchSubscriptionListByMember,
      fetchProgram: fetchProgramAction,
      fetchCountObjects: (memberId: number) =>
        fetchCountObjectsAction(memberId),

      fetchMyControlableMemberList,
      navigateToRelationAccount: navigateToRelationAccountAction,
      navigateBackToMasterRelation: navigateBackToMasterRelationAction,
    },
  ),
  withHandlers({
    redirectToCart:
      ({ companyId, push, isNewCheckoutFlow }) =>
      () => {
        const checkoutUrl = getCheckoutUrl(companyId, isNewCheckoutFlow);
        push(checkoutUrl);
      },
    redirectToMyProfile:
      ({ companyId, push }) =>
      () => {
        push(`/c/${companyId}/profile/`);
      },
    disconnect:
      ({ companyId, push }) =>
      () => {
        push(`/login/signout?membership=${companyId}`);
      },
    navigateToRelationAccount:
      ({ companyId, navigateToRelationAccount }) =>
      (relatedMemberId) => {
        navigateToRelationAccount({
          relatedMemberId,
          company: companyId,
        });
      },
    navigateBackToMasterRelation:
      ({ companyId, navigateBackToMasterRelation }) =>
      () => {
        navigateBackToMasterRelation({ company: companyId });
      },
    fetchOfferBulk:
      ({
        fetchOfferBulk,
        fetchCoachBulk,
        fetchEstablishmentBulk,
        fetchMetaActivityBulk,
      }) =>
      (ids) => {
        fetchOfferBulk(ids, {
          onSuccess: (offerList) => {
            fetchMetaActivityBulk(offerList.map((b) => b.meta_activity));
            fetchCoachBulk([
              ...offerList.map((b) => b.coach),
              ...offerList.map((b) => b.coach_override),
            ]);
            fetchEstablishmentBulk([
              ...offerList.map((b) => b.establishment),
              ...offerList.map((b) => b.establishment_override),
            ]);
          },
        });
      },
  }),
  withHandlers({
    fetchBasketGeneratedObjects:
      ({ fetchBasketGeneratedObjects, fetchOfferBulk }) =>
      (company: number) => {
        fetchBasketGeneratedObjects(company, {
          onSuccess: (objects) =>
            fetchOfferBulk(
              objects.offerList
                .filter((o) => o.extra_data && o.extra_data.next_offer)
                .map((o) => o.extra_data.next_offer),
            ),
        });
      },
  }),
  withHandlers({
    buildUrl:
      ({ companyId }) =>
      (path) => {
        if (
          path.includes('login') ||
          path.includes('/c/') ||
          path.includes('/m/') ||
          path.includes('/checkout')
        ) {
          return path;
        }
        return `/c/${companyId}${path}`;
      },
    goToCalendar:
      ({ membership, push }) =>
      (params) =>
        push(
          `${urlToMarketplace(
            membership.company_name,
            membership.company,
          )}/calendar/${buildUrlParams({ ...params, filtersOpen: true })}`,
        ),
    resetCongratulations:
      ({ location, replace }) =>
      () => {
        const params = location.search.slice(1).split('&');
        const filtered_params = params.filter(
          (p) =>
            !p.includes('from_basket=') && !p.includes('from_direct_booking='),
        );
        replace(`${location.pathname}?${filtered_params.join('&')}`);
      },
  }),
  withTitle(({ membership }) => (membership ? membership.company_name : '')),
  withTranslation('consumerSpace'),
)(ConsumerHome);
