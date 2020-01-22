// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { replace, goBack } from 'react-router-redux';
import { BUYABLE_ITEM_COMBO_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import parse from '../../../query-string';
import type { PaymentCombo } from '../../../libs/payment-combo/types';
import themeSelectors from '../../../libs/theme/selectors';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';

import { getCurrentBasket } from '../../../libs/checkout/selectors';
import type { Basket } from '../../../libs/checkout/types';
import { getPaymentCombo } from '../../../libs/payment-combo/selectors';
import { fetchPaymentCombo } from '../../../libs/payment-combo/actions';

type Props = {
  loading: boolean,
  location: Object,
  theme: Theme,
  goBack: () => void,

  id: number,
  paymentCombo: ?PaymentCombo,
  fetchPaymentCombo: (number) => void,

  basket: ?Basket,
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

export class PaymentComboPreCheckout extends React.Component<Props, State> {
  state = {
    hasAddedItemToBasket: false,
    error: null,
    processing: false,
  };

  componentDidMount() {
    this.props.fetchPaymentCombo(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.paymentCombo !== this.props.paymentCombo &&
      this.props.paymentCombo
    ) {
      this.props.fetchCurrentBasket(this.props.paymentCombo.company);
    }
  }

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location.href = this.props.theme.scheduleURL;
    } else {
      this.props.goBack();
    }
  };

  addToBasketThenRedirect = () => {
    const { id, loading, basket, paymentCombo } = this.props;
    if (
      !this.state.hasAddedItemToBasket &&
      paymentCombo &&
      basket &&
      !loading &&
      !this.state.error
    ) {
      if (!this.state.processing) {
        this.setState({ processing: true });

        const { nextOffer } = parse(this.props.location.search);
        this.props.addItemToBasket(
          basket.id,
          {
            buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
            quantity: 1,
            buyable_item_id: id,
            extra_data: { offer_next: nextOffer },
          },
          {
            onError: () => this.setState({ error: true }),
            onSuccess: () => this.props.goToCheckout(paymentCombo.company),
          },
        );
      }
    }
  };

  render() {
    this.addToBasketThenRedirect();
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.container}>
          {this.state.error ? (
            <div className={this.props.classes.errorContainer}>
              <InfoIcon className={this.props.classes.errorIcon} />
              <Typography>
                {this.props.t('checkout:autoAdd.paymentCombo.locked')}
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
    paddingTop: theme.spacing.unit * 4,
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
    marginBottom: theme.spacing.unit * 2,
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      loading: state.checkout.basket.current.loading,
      theme: themeSelectors.getTheme(state),
      basket: getCurrentBasket(state),
      paymentCombo: getPaymentCombo(state, id),
    }),
    {
      addItemToBasket,
      fetchCurrentBasket,
      fetchPaymentCombo,
      goToCheckout: (companyId: number) => replace(`/checkout/${companyId}`),
      goBack,
    },
  ),
)(PaymentComboPreCheckout);
