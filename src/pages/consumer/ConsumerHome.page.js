// @flow
import React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Switch, Route, withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  push as pushRouter,
  replace as replaceRouter,
} from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import parse from '../../query-string';
import { buildUrlParams } from '../../http';
import asyncComponent from '../../AsyncComponent';

import {
  getConsumerMembershipList,
  getMembership,
} from '../../libs/membership/selectors';
import {
  fetchMembershipListAsConsumer,
  linkMeToCompany,
  setActiveActions,
} from '../../libs/membership/actions';
import { getOfferWithRelated } from '../../libs/offer/selectors';

import { fetchBasketGeneratedObjects as fetchBasketGeneratedObjectsAction } from '../../libs/checkout/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import { getBasketGeneratedObjects } from '../../libs/checkout/selectors';

import { getTheme } from '../../theme';
import themeSelectors from '../../libs/theme/selectors';
import ConsumerLoading from '../../libs/consumer-space/components/ConsumerLoading.component';
import ConsumerDrawer from '../../components/navigation/ConsumerDrawer.component';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import type { Membership } from '../../libs/membership/types';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import CongratulationDialog from '../../libs/consumer-space/components/CongratulationDialog.component';

const ConsumerDashboard = asyncComponent(() =>
  import('./ConsumerDashboard.page'),
);
const ConsumerBooking = asyncComponent(() => import('./ConsumerBooking.page'));
const ConsumerBookingBroadcast = asyncComponent(() =>
  import('./ConsumerBookingBroadcast.page'),
);
const ConsumerPack = asyncComponent(() => import('./ConsumerPack.page'));
const ConsumerInvoice = asyncComponent(() => import('./ConsumerInvoice.page'));
const ConsumerSubscription = asyncComponent(() =>
  import('./ConsumerSubscription.page'),
);
const ConsumerProfile = asyncComponent(() => import('./ConsumerProfile.page'));

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
};
export class ConsumerHome extends React.Component<Props> {
  componentWillMount() {
    if (this.props.from_basket) {
      this.props.fetchBasketGeneratedObjects(this.props.from_basket);
    }
    if (this.props.from_direct_booking) {
      this.props.fetchOfferBulk([parseInt(this.props.from_direct_booking, 10)]);
    }
    this.props.linkMeToCompany({ company: this.props.companyId });
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchMembershipListAsConsumer({ page_size: 2 });
    this.props.setActiveActions(this.props.companyId);
  }

  buildPath = (path) => this.props.push(this.props.buildUrl(path));

  attachConsumerProps = (MyComponent: React.Component<*>) => (props: any) => (
    <MyComponent
      {...props}
      membership={this.props.membership}
      push={this.buildPath}
    />
  );

  render() {
    if (!this.props.membership) {
      return <ConsumerLoading />;
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <ConsumerDrawer
          disconnect={this.props.disconnect}
          buildUrl={this.props.buildUrl}
          logo={this.props.theme ? this.props.theme.cover : null}
          membership={this.props.membership}
          hasMultipleMembership={
            this.props.membershipList && this.props.membershipList.length > 1
          }
        >
          <CongratulationDialog
            basketGeneratedObjects={this.props.basketGeneratedObjects}
            offerBooked={
              this.props.offerBooked && this.props.offerBooked.length
                ? this.props.offerBooked[0]
                : null
            }
            onCancel={this.props.resetCongratulations}
            goToCalendar={this.props.goToCalendar}
            open={!!this.props.from_basket || !!this.props.from_direct_booking}
          />
          <div className={this.props.classes.container}>
            <Switch>
              <Route
                path="/c/:companyId/booking/"
                render={this.attachConsumerProps(ConsumerBooking)}
              />
              <Route
                path="/c/:companyId/broadcast/:bookingId/"
                render={this.attachConsumerProps(ConsumerBookingBroadcast)}
              />
              <Route
                path="/c/:companyId/pack/"
                render={this.attachConsumerProps(ConsumerPack)}
              />
              <Route
                path="/c/:companyId/invoice/"
                render={this.attachConsumerProps(ConsumerInvoice)}
              />
              <Route
                path="/c/:companyId/subscription/"
                render={this.attachConsumerProps(ConsumerSubscription)}
              />
              <Route
                path="/c/:companyId/profile/"
                render={this.attachConsumerProps(ConsumerProfile)}
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
          </div>
        </ConsumerDrawer>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(8),
  },
});

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  withStyles(styles),
  withRouter,
  withProps(({ location }) => ({
    from_basket: parse(location.search).from_basket,
    from_direct_booking: parse(location.search).from_direct_booking,
  })),
  connect(
    (state, { companyId, from_direct_booking }) => ({
      membership: getMembership(state, companyId),
      theme: themeSelectors.getTheme(state),
      membershipList: getConsumerMembershipList(state),
      basketGeneratedObjects: getBasketGeneratedObjects(state),
      offerBooked: from_direct_booking
        ? getOfferWithRelated(state, parseInt(from_direct_booking, 10))
        : null,
    }),
    {
      linkMeToCompany,
      fetchMembershipListAsConsumer,
      fetchCompanyTheme,
      push: pushRouter,
      replace: replaceRouter,
      setActiveActions,
      fetchBasketGeneratedObjects: fetchBasketGeneratedObjectsAction,

      fetchOfferBulk: fetchOfferBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      disconnect: () => pushRouter('/login/signout'),
    },
  ),
  withHandlers({
    fetchOfferBulk: ({
      fetchOfferBulk,
      fetchCoachBulk,
      fetchEstablishmentBulk,
      fetchMetaActivityBulk,
    }) => (ids) => {
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
    fetchBasketGeneratedObjects: ({
      fetchBasketGeneratedObjects,
      fetchOfferBulk,
    }) => (company: number) => {
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
    buildUrl: ({ companyId }) => (path) => {
      if (
        path.includes('login') ||
        path.includes('/c/') ||
        path.includes('/m/')
      ) {
        return path;
      }
      return `/c/${companyId}${path}`;
    },
    goToCalendar: ({ membership, push }) => (params) =>
      push(
        `/m/${membership.company_name}/${
          membership.company
        }/calendar/${buildUrlParams({ ...params, filtersOpen: true })}`,
      ),
    resetCongratulations: ({ location, replace }) => () => {
      const params = location.search.slice(1).split('&');
      const filtered_params = params.filter(
        (p) =>
          !p.includes('from_basket=') && !p.includes('from_direct_booking='),
      );
      replace(`${location.pathname}?${filtered_params.join('&')}`);
    },
  }),
  withTitle(({ membership }) => (membership ? membership.company_name : '')),
)(ConsumerHome);
