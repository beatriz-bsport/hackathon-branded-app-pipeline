// @flow

import React from 'react';
import { compose, withState, withProps, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { replace as replaceRouter, push, goBack } from 'connected-react-router';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import { withNamespaces } from 'react-i18next';
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
import GoogleTagManager from '../../components/GoogleTagManager.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../libs/checkout/components/CheckoutFlow.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import type { Theme } from '../../libs/theme/types';

import themeSelectors from '../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import { getShopItemFeaturedList } from '../../libs/shop/selectors';
import { fetchShopItemFeatured } from '../../libs/shop/actions/shopitem';

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
  attachCoupon: (
    code: string,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,

  basketError: ?Error,
  shopItemList: Array<ShopItem>,
  fetchShopItemFeatured: (companyId: number) => void,

  addShopItemToBasket: (shopitemId: number) => void,
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
    }
    if (this.props.basket && !prevProps.basket) {
      try {
        (window.dataLayer || []).push({
          event: 'bsport:basket:show',
          data: {
            totalPrice: this.props.basket.total_price,
            memberId: this.props.basket.member,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  componentDidMount() {
    if (this.props.basket) {
      try {
        (window.dataLayer || []).push({
          event: 'bsport:basket:show',
          data: {
            totalPrice: this.props.basket.total_price,
            memberId: this.props.basket.member,
          },
        });
      } catch (err) {
        console.error(err);
      }
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
        <GoogleTagManager theme={this.props.theme} />
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
              termsAndConditions={this.props.theme.general_terms_and_conditions}
              attachCoupon={this.props.attachCoupon}
              backToCalendar={this.backToCalendar}
              shopItemList={this.props.shopItemList}
              patchBasket={this.props.patchCurrentBasket}
            />

            {this.renderError()}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingTop: theme.spacing(2),
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
  withNamespaces(['checkout']),
  connect(
    (state) => ({
      basket: getCurrentBasket(state),
      loading: state.checkout.basket.current.loading,
      processing: state.checkout.basket.current.updating,
      theme: themeSelectors.getTheme(state),
      shopItemList: getShopItemFeaturedList(state),
    }),
    {
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
      try {
        (window.dataLayer || []).push({
          event: 'bsport:basket:payment-success',
          data: {
            totalPrice: basket.total_price,
            memberId: basket.member,
          },
        });
      } catch (err) {
        console.error(err);
      }
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
