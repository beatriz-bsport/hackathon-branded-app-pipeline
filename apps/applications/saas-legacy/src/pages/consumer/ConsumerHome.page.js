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
import withTitle from '../../hocs/with-title.hoc';
import { parseQueryString, buildUrlParams } from '../../http';
import { withTranslation } from 'react-i18next';
import withQueryParams from '../../hocs/with-query-params.hoc';

import asyncComponent from '../../AsyncComponent';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import {
  getConsumerMembershipList,
  getMembership,
} from '../../libs/membership/selectors';
import { retrieveFranchise as retrieveFranchiseAction } from '#src/libs/franchise/actions';
import { getFranchisor } from '#src/libs/franchise/selectors';
import {
  fetchMembershipByCompany,
  linkMeToCompany,
  setActiveActions,
  requestMembershipValidation,
  fetchMembershipListAsConsumer,
} from '../../libs/membership/actions';
import { fetchMarketplaceSettings as fetchMarketplaceSettingsAction } from '../../libs/marketplace/actions';
import { getMarketplaceSettingsConfig } from '../../libs/marketplace/selectors';
import { getOfferWithRelated } from '../../libs/offer/selectors';

import {
  fetchBasketGeneratedObjects as fetchBasketGeneratedObjectsAction,
  fetchCurrentBasket as fetchCurrentBasketAction,
} from '../../libs/checkout/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import {
  getBasketGeneratedObjects,
  getCurrentBasket,
} from '../../libs/checkout/selectors';

import { getTheme } from '../../theme';
import themeSelectors from '../../libs/theme/selectors';
import { fetchCountObjects as fetchCountObjectsAction } from '../../libs/member/actions';
import { getMember } from '../../libs/member/selectors';
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
import { getItemInStorage } from '../../utils/storage';
import { STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN } from '../../actions/constants';
import { ChevronRight, Edit03 } from '#src/components/untitledui';

import ConsumerNavigation from '#src/libs/consumer-space/components/reworked/@Navigation/ConsumerNavigation';
import {
  urlToMarketplacePassTab,
  urlToMarketplaceSessionTab,
  urlToMarketplaceSubscriptionTab,
} from '../../libs/marketplace/utils/navigation';
import { getBasketBuyableItemsCount } from '../../libs/checkout/utils';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import WidgetUtils from '../../libs/widget/WidgetUtils';

const ConsumerGiftcard = asyncComponent(() =>
  import('./ConsumerGiftcard.page'),
);
const ConsumerBookingReworked = asyncComponent(() =>
  import('./ConsumerBookingReworked.page'),
);
const ConsumerVOD = asyncComponent(() => import('./ConsumerVOD.page'));
const ConsumerBookingBroadcast = asyncComponent(() =>
  import('./ConsumerBookingBroadcast.page'),
);
const ConsumerPassReworked = asyncComponent(() =>
  import('./ConsumerPassReworked.page'),
);
const ConsumerInvoiceReworked = asyncComponent(() =>
  import('./ConsumerInvoiceReworked.page'),
);

const ConsumerSubscriptionReworked = asyncComponent(() =>
  import('./ConsumerSubscriptionReworked.page'),
);
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
  constructor(props) {
    super(props);
  }
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
    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (theme) => {
        if (theme.franchisor) this.props.retrieveFranchise(theme.franchisor);
      },
    });
    this.props.fetchCurrentBasket(this.props.companyId);
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

  /**
   * The consumer space context. If not provided the default context is WEB
   * @see {@link [ConsumerSpaceContextEnum](#src/libs/consumer-space/constants.ts)}
   */
  getConsumerSpaceContext = () => this.props.queryParams?.consumerspacecontextt;

  buildPath = (path: string) => this.props.push(this.props.buildUrl(path));

  attachConsumerProps = (MyComponent: React.Component<*>) => (props: any) =>
    (
      <MyComponent
        companyId={this.props.companyId}
        {...props}
        membership={this.props.membership}
        push={this.buildPath}
      />
    );

  /**
   * Trick to pass local state and setters to consumer profile page.
   * The structure of the pages, wrapped by the navigation that sets the pages footer
   * obliges us to pass this props down the component to handle mobile footer actions.
   */
  attachConsumerProfileProps =
    (MyComponent: React.Component<*>) => (props: any) =>
      (
        <MyComponent
          companyId={this.props.companyId}
          {...props}
          membership={this.props.membership}
          push={this.buildPath}
        />
      );

  getIsWidget = () =>
    WidgetUtils.getConsumerSpaceContext() !== ConsumerSpaceContextEnum.WEB &&
    WidgetUtils.getConsumerSpaceContext() !== null;

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettingsConfig,
      this.props.theme?.company_name,
      this.props.theme?.company?.toString(),
    );
    this.getIsWidget()
      ? window.open(marketplaceTabPath, '_blank')
      : this.props.push(marketplaceTabPath);
  };

  handleGetASubscriptionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSubscriptionTab(
      this.props.marketplaceSettingsConfig,
      this.props.theme?.company_name,
      this.props.theme?.company?.toString(),
    );
    this.getIsWidget()
      ? window.open(marketplaceTabPath, '_blank')
      : this.props.push(marketplaceTabPath);
  };

  handleBuyPassClick = () => {
    const marketplaceTabPath = urlToMarketplacePassTab(
      this.props.marketplaceSettingsConfig,
      this.props.theme?.company_name,
      this.props.theme?.company?.toString(),
    );
    this.getIsWidget()
      ? window.open(marketplaceTabPath, '_blank')
      : this.props.push(marketplaceTabPath);
  };

  /** A list of buttons shown in the footer on mobile */
  getConsumerMobileNavigationButtonsData = () => {
    const location = this.props.location;
    const isSubscriptionRoute = location.pathname.includes('/subscription');
    const isPassRoute = location.pathname.includes('/pack');
    const isProfileRoute = location.pathname.includes('/profile');

    if (isProfileRoute)
      return [
        {
          label: this.props.t('reworked.myProfile.header.buttons.editProfile'),
          onClick: this.openEditProfilePortalOnMobile,
          rightIcon: <Edit03 stroke="currentColor" />,
        },
      ];

    return [
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
              <ConsumerNavigation
                basketProductListCount={getBasketBuyableItemsCount(
                  this.props.currentBasket?.checkout_items ?? [],
                )}
                buildUrl={this.props.buildUrl}
                buttonsData={this.getConsumerMobileNavigationButtonsData()}
                companyId={this.props.companyId}
                companyLogo={this.props.theme?.cover}
                companyName={this.props.theme?.company_name ?? ''}
                companyWebsiteUrl={this.props.theme?.websiteURL}
                context={this.props.queryParams?.consumerspacecontext ?? ''}
                controlableMemberList={this.props.controlableMemberList}
                franchisorCompanyList={this.props.franchisor?.companies ?? []}
                hasMultipleMembership={
                  this.props.membershipCount && this.props.membershipCount > 1
                }
                memberName={
                  this.props.getMemberFirstName(this.props.membership?.id) ?? ''
                }
                memberRelationshipList={this.props.controlableMemberList}
                membership={this.props.membership}
                navigateBackToMasterRelation={
                  this.props.navigateBackToMasterRelation
                }
                navigateToRelationAccount={this.props.navigateToRelationAccount}
                push={this.props.push}
                showCredit={
                  this.props.theme && this.props.theme.consumer_regularize_debt
                }
                subscriptionPendingActionCount={
                  this.props.subscriptionPendingActionCount
                }
                tabConfigList={this.props.marketplaceSettingsConfig}
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
                    !!this.props.from_basket || !!this.props.from_direct_booking
                  }
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
                    render={this.attachConsumerProps(ConsumerBookingBroadcast)}
                  />
                  <Route
                    path="/c/:companyId/invoice/"
                    render={this.attachConsumerProps(ConsumerInvoiceReworked)}
                  />
                  <Route
                    path="/c/:companyId/profile/"
                    render={this.attachConsumerProfileProps(
                      ConsumerProfileReworked,
                    )}
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
                </Switch>
              </ConsumerNavigation>
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
  withQueryParams([['consumerspacecontext'], 'queryParams']),
  routerParamsToProps({ companyId: 'companyId:number' }),
  withRouter,
  withProps(({ location }) => ({
    from_basket: parseQueryString(location.search).from_basket,
    from_direct_booking: parseQueryString(location.search).from_direct_booking,
  })),
  connect(
    (state, { companyId, from_direct_booking }) => ({
      franchisor: themeSelectors.getTheme(state)?.franchisor
        ? getFranchisor(state)
        : undefined,
      marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
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
      currentBasket: getCurrentBasket(state),
      getMemberFirstName: (id: number) => getMember(state, id)?.firstname ?? '',
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
        fetchCountObjectsAction(memberId, { me: true }),

      fetchMyControlableMemberList,
      navigateToRelationAccount: navigateToRelationAccountAction,
      navigateBackToMasterRelation: navigateBackToMasterRelationAction,
      fetchCurrentBasket: fetchCurrentBasketAction,
      fetchMarketplaceSettings: fetchMarketplaceSettingsAction,
      retrieveFranchise: retrieveFranchiseAction,
    },
  ),
  withHandlers({
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
            fetchEstablishmentBulk([...offerList.map((b) => b.establishment)]);
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
