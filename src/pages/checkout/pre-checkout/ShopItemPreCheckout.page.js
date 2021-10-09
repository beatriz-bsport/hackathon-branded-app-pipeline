// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { replace as replaceAction, goBack, push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_SHOP_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import { payment as paymentActions } from '../../../actions';
import themeSelectors from '../../../libs/theme/selectors';
import type { Theme } from '../../../libs/theme/types';
import { buildUrlParams } from '../../../http';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { getCurrentBasket } from '../../../libs/checkout/selectors';
import Analytics from '../../../components/analytics/Analytics.component';

type Props = {
  fetchShopItem: (number, options: OptionCallback) => void,
  theme: Theme,
  goBack: () => void,
  itemId: number,
  fetchCurrentBasket: (companyId: number, options: OptionCallback) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,
  classes: Object,
  push: (string) => void,
  t: TFunction,
};

type State = {
  error: ?Error,
};

export class PaymentPackPaymentPage extends Component<Props, State> {
  state = {
    error: null,
  };

  componentDidMount() {
    this.props.fetchShopItem(this.props.itemId, {
      onSuccess: (shopItem) => {
        this.props.fetchCurrentBasket(shopItem.company, {
          onSuccess: (basket) => {
            Analytics.addShopItemToCart(shopItem);
            this.props.addItemToBasket(
              basket.id,
              {
                buyable_item_identifier: BUYABLE_ITEM_SHOP_ITEM,
                quantity: 1,
                buyable_item_id: this.props.itemId,
              },
              {
                onError: (error) => this.setState({ error }),
                onSuccess: () => this.props.goToCheckout(shopItem.company),
              },
            );
          },
        });
      },
    });
  }

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      this.props.push(this.props.theme.scheduleURL);
    } else {
      this.props.goBack();
    }
  };

  render() {
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
  withTranslation(['checkout', 'payment']),
  withStyles(styles),
  routerParamsToProps({ id: 'itemId:number' }),
  connect(
    (state) => ({
      shopItem: state.payment.wantedShopItem,
      theme: themeSelectors.getTheme(state),
      basket: getCurrentBasket(state),
    }),
    {
      addItemToBasket,
      removeItemFromBasket,
      fetchCurrentBasket,
      fetchShopItem: paymentActions.fetchShopItem,
      goBack,
      push,
      replace: replaceAction,
    },
  ),
  withQueryParams([['context'], 'queryParams', 'setQueryParams']),
  withHandlers({
    goToCheckout: ({ replace, queryParams }) => (companyId) =>
      replace(
        `/checkout/${companyId}${buildUrlParams({
          ...(queryParams?.context ? { context: queryParams.context } : {}),
          ...(queryParams?.onValidation
            ? { onValidation: queryParams.onValidation }
            : {}),
        })}`,
      ),
  }),
)(PaymentPackPaymentPage);
