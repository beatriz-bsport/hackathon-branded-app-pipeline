// @flow

import React from 'react';
import { compose, withState, withProps, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import {
  replace as replaceRouter,
  push,
  goBack,
  push as pushRouter,
} from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { getTheme } from '../../theme';
import {
  addItemToBasket as addItemToBasketAction,
  attachCoupon,
  removeItemFromBasket,
  fetchCurrentBasket as fetchCurrentBasketAction,
  patchCurrentBasket,
  attachPayment as attachPaymentAction,
} from '../../libs/checkout/actions';
import Analytics from '../../components/analytics/Analytics.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../libs/checkout/components/CheckoutFlow.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import type { Theme } from '../../libs/theme/types.ts';

import themeSelectors from '../../libs/theme/selectors.ts';
import { fetchCompanyTheme } from '../../libs/theme/actions.ts';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList } from '../../libs/payment/actions';

import { getShopItemFeaturedList } from '../../libs/shop/selectors';
import { fetchShopItemFeatured } from '../../libs/shop/actions/shopitem';

import MarketplaceAppBar from '../marketplace/MarketplaceAppBar.component';

import {
  consumer as consumerActions,
  auth as authActions,
} from '../../actions';

type Props = {
  basket: ?Basket,
  loading: boolean,
  processing: boolean,
  companyId: number,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  submitPayment: (data: *) => void,
  fetchCompanyTheme: (companyId: number) => void,
  onBasketFinalized: (basket: Basket) => void,
  goBack: () => void,
  t: TFunction,
  theme: ?Theme,
  classes: Object,
  fetchCurrentBasket: (companyId: number) => void,
  patchCurrentBasket: (data: any) => void,
  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  attachCoupon: (
    code: string,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,

  basketError: ?Error,
  shopItemList: Array<ShopItem>,
  fetchShopItemFeatured: (companyId: number) => void,

  addShopItemToBasket: (shopitemId: number) => void,
  fetchProfile: () => void,
  goToUserSpace: () => void,
  disconnect: () => void,
  auth: *,

  fetchCurrentBasket: (companyId: number) => void,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
};

export class CheckoutPayment extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchCurrentBasket(this.props.companyId);
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchShopItemFeatured(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.fetchCurrentBasket(this.props.companyId);
      this.props.fetchPaymentMethodList({ company: this.props.companyId });
    }
    if (this.props.basket && !prevProps.basket) {
      Analytics.showBasket(this.props.basket);
    }
  }

  componentDidMount() {
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
    if (this.props.basket) {
      Analytics.showBasket(this.props.basket);
    }
    if (this.props.companyId) {
      this.props.fetchPaymentMethodList({ company: this.props.companyId });
    }
  }

  renderError = () => {
    if (
      this.props.basketError &&
      this.props.basketError.response &&
      this.props.basketError.response.status === 423
    ) {
      return (
        <Typography color="error">
          {this.props.t('myBasket.error.invalidBasket')}
        </Typography>
      );
    }

    return null;
  };

  backToCalendar = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location = this.props.theme.scheduleURL;
      return;
    }
    this.props.goBack();
  };

  render() {
    if (this.props.basket && this.props.basket.is_finalized) {
      this.props.onBasketFinalized(this.props.basket);
    }
    if (!this.props.basket) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.subContainer}>
          <MarketplaceAppBar
            paper
            auth={this.props.auth}
            logo={this.props.theme && this.props.theme.cover}
            goToUserSpace={() =>
              this.props.companyId &&
              this.props.goToUserSpace(this.props.companyId)
            }
            disconnect={() => {
              this.props.disconnect(this.props.goBack);
            }}
          />
          <Analytics theme={this.props.theme} />
          <div className={this.props.classes.container}>
            <div className={this.props.classes.checkoutFlow}>
              <CheckoutFlow
                basket={this.props.basket}
                loading={this.props.loading}
                processing={this.props.processing}
                submitPayment={this.props.submitPayment}
                addItemToBasket={this.props.addItemToBasket}
                addShopItemToBasket={this.props.addShopItemToBasket}
                removeItemFromBasket={this.props.removeItemFromBasket}
                termsAndConditions={
                  this.props.theme.general_terms_and_conditions
                }
                attachCoupon={this.props.attachCoupon}
                backToCalendar={this.backToCalendar}
                shopItemList={this.props.shopItemList}
                patchBasket={this.props.patchCurrentBasket}
                savedPaymentMethodList={this.props.savedPaymentMethodList}
              />
              {this.renderError()}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  subContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingBottom: theme.spacing(3),
  },
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
  },
  checkoutFlow: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({ companyId: 'companyId:number' }),
  withTranslation(['checkout']),
  connect(
    (state) => ({
      auth: state.auth,
      basket: getCurrentBasket(state),
      loading: state.checkout.basket.current.loading,
      processing: state.checkout.basket.current.updating,
      theme: themeSelectors.getTheme(state),
      shopItemList: getShopItemFeaturedList(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      disconnect: authActions.disconnect,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      fetchProfile: consumerActions.fetchProfile,

      addItemToBasket: addItemToBasketAction,
      removeItemFromBasket,
      goBack,
      push,
      replace: replaceRouter,
      fetchCurrentBasket: fetchCurrentBasketAction,
      patchCurrentBasket,
      attachPayment: attachPaymentAction,
      attachCoupon,
      fetchCompanyTheme,
      fetchShopItemFeatured,
      fetchPaymentMethodList,
    },
  ),
  withHandlers({
    addShopItemToBasket: ({ addItemToBasket, basket }) => (shopItemId) =>
      addItemToBasket(basket.id, {
        buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
        quantity: 1,
        buyable_item_id: shopItemId,
        extra_data: {},
      }),
    onBasketFinalized: ({ replace }) => (basket) => {
      Analytics.onPaymentSuccess(basket);
      replace(`/c/${basket.company}/?from_basket=${basket.id}`);
    },
  }),
  withState('basketError', 'setBasketError', null),
  withProps(
    ({ attachPayment, fetchCurrentBasket, companyId, setBasketError }) => ({
      submitPayment: (data, options) =>
        attachPayment(data, {
          onSuccess: (response) => {
            if (options && options.onSuccess) options.onSuccess(response);
          },
          onError: (error) => {
            fetchCurrentBasket(companyId);
            setBasketError(error);
            if (options && options.onError) options.onError(error);
          },
        }),
    }),
  ),
)(CheckoutPayment);
