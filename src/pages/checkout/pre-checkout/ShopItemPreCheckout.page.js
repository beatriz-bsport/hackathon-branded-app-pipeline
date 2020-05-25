// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { replace, goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import { payment as paymentActions } from '../../../actions';
import parse from '../../../query-string';
import themeSelectors from '../../../libs/theme/selectors';
import type { Theme } from '../../../libs/theme/types';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { getCurrentBasket } from '../../../libs/checkout/selectors';
import type { Basket } from '../../../libs/checkout/types';

type Props = {
  loading: boolean,
  location: Object,
  shopItem: ?any,
  fetchShopItem: (number) => void,
  theme: Theme,
  goBack: () => void,
  basket: ?Basket,
  itemId: number,
  fetchCurrentBasket: (companyId: number) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,
  classes: Object,
  t: TFunction,
};

type State = {
  error: ?Error,
  hasAddedItemToBasket: boolean,
  processing: boolean,
};

export class PaymentPackPaymentPage extends Component<Props, State> {
  state = {
    hasAddedItemToBasket: false,
    error: null,
    processing: false,
  };

  componentDidMount() {
    this.props.fetchShopItem(this.props.itemId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.shopItem !== this.props.shopItem && this.props.shopItem) {
      this.props.fetchCurrentBasket(this.props.shopItem.company);
    }
  }

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location.href = this.props.theme.scheduleURL;
    } else {
      this.props.goBack();
    }
  };

  render() {
    const { itemId, basket } = this.props;
    if (
      !this.state.hasAddedItemToBasket &&
      this.props.shopItem &&
      basket &&
      !this.props.loading &&
      !this.state.error
    ) {
      if (!this.state.processing) {
        this.setState({ processing: true });
        const { nextOffer } = parse(this.props.location.search);
        this.props.addItemToBasket(
          basket.id,
          {
            buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
            quantity: 1,
            buyable_item_id: itemId,
            extra_data: { offer_next: nextOffer },
          },
          {
            onError: () => this.setState({ error: true }),
            onSuccess: () =>
              this.props.goToCheckout(this.props.shopItem.company),
          },
        );
      }
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.container}>
          {this.state.error ? (
            <div className={this.props.classes.errorContainer}>
              <InfoIcon className={this.props.classes.errorIcon} />
              <Typography>
                {this.props.t('checkout:autoAdd.paymentPack.locked')}
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                className={this.props.classes.button}
                onClick={this.goToPassMarketplace}
              >
                {this.props.t('payment:goBack')}
              </Button>
            </div>
          ) : (
            <CircularProgress />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
    width: '100vw',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  errorIcon: {
    height: 64,
    width: 64,
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
});

export default compose(
  withTranslation(),
  withStyles(styles),
  routerParamsToProps({ id: 'itemId:number' }),
  connect(
    (state) => ({
      shopItem: state.payment.wantedShopItem,
      loading: state.payment.loading || state.checkout.basket.current.loading,
      theme: themeSelectors.getTheme(state),
      basket: getCurrentBasket(state),
    }),
    {
      addItemToBasket,
      removeItemFromBasket,
      fetchCurrentBasket,
      goToCheckout: (companyId: number) => replace(`/checkout/${companyId}`),
      fetchShopItem: paymentActions.fetchShopItem,
      goBack,
    },
  ),
)(PaymentPackPaymentPage);
