// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { push, replace as replaceRouter, goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import { buildUrlParams, parseQueryString } from '../../../http';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import { payment as paymentActions } from '../../../actions';

import themeSelectors from '../../../libs/theme/selectors';
import type { Theme } from '../../../libs/theme/types';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import Analytics from '../../../components/analytics/Analytics.component';

type Props = {
  location: Object,
  fetchPaymentPack: (number) => void,
  theme: Theme,
  goBack: () => void,
  packId: number,
  push: (string) => void,
  fetchCurrentBasket: (companyId: number) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,
  classes: Object,
  t: TFunction,
};

type State = {
  error: ?Error,
  processing: boolean,
};

export class PaymentPackPaymentPage extends Component<Props, State> {
  state = {
    error: null,
    processing: false,
  };

  componentDidMount() {
    this.props.fetchPaymentPack(this.props.packId, {
      onSuccess: (paymentPack) => {
        this.props.fetchCurrentBasket(paymentPack.company_id, {
          onSuccess: (basket) => {
            if (!this.state.processing) {
              this.setState({ processing: true });
              const { nextOffer } = parseQueryString(
                this.props.location.search,
              );
              const { force } = parseQueryString(this.props.location.search);
              Analytics.addPassToCart(paymentPack, 'payment_pack');
              this.props.addItemToBasket(
                basket.id,
                {
                  buyable_item_identifier: BUYABLE_ITEM_PASS,
                  quantity: 1,
                  buyable_item_id: paymentPack.id,
                  extra_data: { offer_next: nextOffer, force },
                },
                {
                  onError: () => this.setState({ error: true }),
                  onSuccess: () =>
                    this.props.goToCheckout(paymentPack.company_id),
                },
              );
            }
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
  routerParamsToProps({ id: 'packId:number' }),
  withQueryParams([['context'], 'queryParams', 'setQueryParams']),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      addItemToBasket,
      removeItemFromBasket,
      fetchCurrentBasket,
      fetchPaymentPack: paymentActions.fetchPaymentPack,
      goBack,
      replace: replaceRouter,
      push,
    },
  ),
  withHandlers({
    goToCheckout: ({ replace, queryParams }) => (companyId) =>
      replace(
        `/checkout/${companyId}${buildUrlParams(
          ...(queryParams?.context ? { context: queryParams.context } : {}),
          ...(queryParams?.onValidation
            ? { onValidation: queryParams.onValidation }
            : {}),
        )}`,
      ),
  }),
)(PaymentPackPaymentPage);
